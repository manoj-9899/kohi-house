const { getSupabaseAdmin } = require('./shared/supabase')
const { sendTemplatedEmail } = require('./shared/resend')
const { sendWelcomeEmail } = require('./shared/email-sender')
const { addToAudience } = require('./shared/resend-audience')
const {
  json,
  getClientIp,
  hashIp,
  generateToken,
  getSiteUrl,
  isValidEmail,
  sanitizeText,
  isDoubleOptInEnabled,
  checkRateLimit,
} = require('./shared/utils')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {})
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'method_not_allowed' })
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { ok: false, error: 'invalid_json' })
  }

  const email = (body.email || '').trim().toLowerCase()
  const firstName = sanitizeText(body.firstName, 60)
  const source = sanitizeText(body.source, 40) || 'website'
  const honeypot = body.company || body.website || ''

  if (honeypot) {
    return json(200, { ok: true, message: 'subscribed' })
  }

  if (!email) {
    return json(400, { ok: false, error: 'email_required', message: 'Please enter your email address.' })
  }

  if (!isValidEmail(email)) {
    return json(400, { ok: false, error: 'email_invalid', message: 'Please enter a valid email address.' })
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    console.error('Supabase admin not configured')
    return json(503, { ok: false, error: 'service_unavailable' })
  }

  const ip = getClientIp(event)
  const ipHash = hashIp(ip)

  try {
    const allowed = await checkRateLimit(supabase, ipHash)
    if (!allowed) {
      return json(429, { ok: false, error: 'rate_limited', message: 'Too many attempts. Please try again later.' })
    }
  } catch (err) {
    console.error('Rate limit check failed:', err)
  }

  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, status')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    if (existing.status === 'unsubscribed') {
      const token = generateToken()
      const doubleOptIn = isDoubleOptInEnabled()
      const status = doubleOptIn ? 'pending' : 'confirmed'

      await supabase
        .from('newsletter_subscribers')
        .update({
          first_name: firstName,
          status,
          source,
          confirmation_token: doubleOptIn ? token : null,
          confirmation_sent_at: doubleOptIn ? new Date().toISOString() : null,
          confirmed_at: doubleOptIn ? null : new Date().toISOString(),
          subscribed_at: new Date().toISOString(),
          welcome_email_sent: false,
        })
        .eq('id', existing.id)

      await sendEmails({ email, firstName, token, doubleOptIn, supabase, subscriberId: existing.id })
      return json(200, {
        ok: true,
        resubscribed: true,
        doubleOptIn,
        message: doubleOptIn ? 'confirm_sent' : 'welcome_sent',
      })
    }

    if (existing.status === 'blocked') {
      return json(403, { ok: false, error: 'blocked' })
    }

    return json(409, {
      ok: false,
      error: 'already_subscribed',
      message: 'You are already a member of The Kōhī Club.',
    })
  }

  const token = generateToken()
  const doubleOptIn = isDoubleOptInEnabled()
  const status = doubleOptIn ? 'pending' : 'confirmed'

  const { data: inserted, error: insertError } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email,
      first_name: firstName,
      status,
      source,
      confirmation_token: doubleOptIn ? token : null,
      confirmation_sent_at: doubleOptIn ? new Date().toISOString() : null,
      confirmed_at: doubleOptIn ? null : new Date().toISOString(),
      welcome_email_sent: false,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('Insert failed:', insertError)
    return json(500, { ok: false, error: 'save_failed' })
  }

  await sendEmails({
    email,
    firstName,
    token,
    doubleOptIn,
    supabase,
    subscriberId: inserted.id,
  })

  return json(200, {
    ok: true,
    doubleOptIn,
    message: doubleOptIn ? 'confirm_sent' : 'welcome_sent',
  })
}

async function sendEmails({ email, firstName, token, doubleOptIn, supabase, subscriberId }) {
  const siteUrl = getSiteUrl()
  const displayName = firstName || 'there'
  const unsubscribeUrl = `${siteUrl}/unsubscribe.html?email=${encodeURIComponent(email)}`

  try {
    if (doubleOptIn) {
      const confirmUrl = `${siteUrl}/api/newsletter/confirm?token=${token}`
      await sendTemplatedEmail({
        template: 'confirm',
        to: email,
        vars: {
          firstName: displayName,
          confirmUrl,
          unsubscribeUrl,
        },
      })
      await supabase
        .from('newsletter_subscribers')
        .update({ last_email_sent: new Date().toISOString() })
        .eq('id', subscriberId)
    } else {
      await sendWelcomeEmail({ email, firstName: displayName, unsubscribeUrl, supabase, subscriberId })
      await addToAudience({ email, firstName: firstName || undefined })
    }
  } catch (err) {
    console.error('Email send failed (subscriber saved):', err)
    await supabase
      .from('newsletter_subscribers')
      .update({ welcome_email_sent: false })
      .eq('id', subscriberId)
    await queueEmailRetry(supabase, subscriberId, doubleOptIn ? 'confirm' : 'welcome', {
      firstName: displayName,
      confirmUrl: doubleOptIn ? `${siteUrl}/api/newsletter/confirm?token=${token}` : undefined,
      unsubscribeUrl,
    })
  }
}

async function queueEmailRetry(supabase, subscriberId, template, vars) {
  try {
    await supabase.from('newsletter_email_queue').insert({
      subscriber_id: subscriberId,
      template,
      vars,
      scheduled_for: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    })
  } catch (err) {
    console.error('Email queue insert failed:', err?.message || err)
  }
}

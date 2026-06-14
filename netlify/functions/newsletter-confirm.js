const { getSupabaseAdmin } = require('./shared/supabase')
const { sendWelcomeEmail } = require('./shared/email-sender')
const { addToAudience } = require('./shared/resend-audience')

function htmlPage(title, message, ctaHref, ctaLabel) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Kōhī House</title>
  <style>
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0D0906;color:#F5E6C8;font-family:Georgia,serif;padding:2rem}
    .card{max-width:420px;text-align:center}
    h1{font-size:1.75rem;margin:0 0 1rem;font-weight:700}
    p{color:rgba(245,230,200,.72);line-height:1.65;margin:0 0 1.5rem}
    a{display:inline-block;background:#C8894A;color:#0D0906;text-decoration:none;padding:.85rem 1.75rem;border-radius:2px;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    ${ctaHref ? `<a href="${ctaHref}">${ctaLabel}</a>` : ''}
  </div>
</body>
</html>`
}

exports.handler = async (event) => {
  const token = event.queryStringParameters?.token
  const siteUrl = process.env.SITE_URL || 'https://kohi-house.netlify.app'

  if (!token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlPage('Invalid link', 'This confirmation link is not valid.', siteUrl, 'Back to Kōhī House'),
    }
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlPage('Unavailable', 'Please try again in a few minutes.', siteUrl, 'Back to Kōhī House'),
    }
  }

  const { data: subscriber, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, first_name, status, confirmation_token')
    .eq('confirmation_token', token)
    .maybeSingle()

  if (error || !subscriber) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlPage(
        'Link expired',
        'This confirmation link has expired or was already used.',
        siteUrl,
        'Back to Kōhī House'
      ),
    }
  }

  if (subscriber.status === 'confirmed') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlPage(
        'Already confirmed',
        'You are already a member of The Kōhī Club. Check your inbox for your welcome email.',
        `${siteUrl}/#newsletter`,
        'Visit Kōhī House'
      ),
    }
  }

  await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      confirmation_token: null,
    })
    .eq('id', subscriber.id)

  const unsubscribeUrl = `${siteUrl}/unsubscribe.html?email=${encodeURIComponent(subscriber.email)}`

  try {
    await sendWelcomeEmail({
      email: subscriber.email,
      firstName: subscriber.first_name || 'there',
      unsubscribeUrl,
      supabase,
      subscriberId: subscriber.id,
    })
    await addToAudience({
      email: subscriber.email,
      firstName: subscriber.first_name || undefined,
    })
  } catch (err) {
    console.error('Welcome email after confirm failed:', err)
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: htmlPage(
      'Welcome to The Kōhī Club ☕',
      'Your membership is confirmed. Check your inbox for your welcome reward and member benefits.',
      `${siteUrl}/#reservation`,
      'Reserve a Table'
    ),
  }
}

const { getSupabaseAdmin } = require('./shared/supabase')
const { removeFromAudience } = require('./shared/resend-audience')
const { json, isValidEmail } = require('./shared/utils')

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {})
  }

  const siteUrl = process.env.SITE_URL || 'https://kohi-house.netlify.app'

  if (event.httpMethod === 'GET') {
    const email = (event.queryStringParameters?.email || '').trim().toLowerCase()
    if (!email || !isValidEmail(email)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: page('Invalid request', 'Please use the unsubscribe link from your email.', siteUrl),
      }
    }
    return unsubscribeEmail(email, siteUrl)
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false })
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { ok: false })
  }

  const email = (body.email || '').trim().toLowerCase()
  if (!email || !isValidEmail(email)) {
    return json(400, { ok: false, message: 'Invalid email.' })
  }

  return unsubscribeEmail(email, siteUrl, true)
}

async function unsubscribeEmail(email, siteUrl, asJson = false) {
  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    if (asJson) return json(503, { ok: false })
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: page('Unavailable', 'Please try again later.', siteUrl),
    }
  }

  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (data) {
    await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed', confirmation_token: null })
      .eq('id', data.id)
    await removeFromAudience(email)
  }

  if (asJson) {
    return json(200, { ok: true })
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: page(
      'You have been unsubscribed',
      'You will no longer receive emails from The Kōhī Club. We hope to see you at the café.',
      siteUrl
    ),
  }
}

function page(title, message, siteUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Kōhī House</title>
  <style>
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0D0906;color:#F5E6C8;font-family:Georgia,serif;padding:2rem}
    .card{max-width:420px;text-align:center}
    h1{font-size:1.75rem;margin:0 0 1rem}
    p{color:rgba(245,230,200,.72);line-height:1.65;margin:0 0 1.5rem}
    a{color:#C8894A}
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${siteUrl}">Return to Kōhī House</a>
  </div>
</body>
</html>`
}

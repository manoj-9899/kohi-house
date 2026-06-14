const { Resend } = require('resend')
const { readFileSync } = require('fs')
const { join } = require('path')

const manifest = JSON.parse(
  readFileSync(join(__dirname, '../_templates/manifest.json'), 'utf8')
)

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY')
  return new Resend(key)
}

function getFromAddress() {
  const email = process.env.FROM_EMAIL || 'hello@kohihouse.in'
  const name = process.env.NEWSLETTER_FROM_NAME || 'Kōhī House'
  return `${name} <${email}>`
}

function loadTemplate(name) {
  return readFileSync(join(__dirname, '../_templates', `${name}.html`), 'utf8')
}

function applyVars(html, vars) {
  let out = html
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(String(value ?? ''))
  }
  return out
}

async function sendTemplatedEmail({ template, to, vars, subject, replyTo }) {
  const resend = getResend()
  const html = applyVars(loadTemplate(template), vars)
  const meta = manifest[template] || {}

  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    subject: subject || meta.subject,
    html,
    replyTo: replyTo || process.env.REPLY_TO_EMAIL || undefined,
  })

  if (error) throw error
  return data
}

module.exports = { sendTemplatedEmail, getFromAddress, applyVars }

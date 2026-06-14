const { Resend } = require('resend')

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

function getAudienceId() {
  return process.env.RESEND_AUDIENCE_ID || null
}

/** Add or update a contact in the Resend audience (no-op if audience not configured). */
async function addToAudience({ email, firstName, unsubscribed = false }) {
  const audienceId = getAudienceId()
  const resend = getResend()
  if (!audienceId || !resend) return

  try {
    await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      unsubscribed,
      audienceId,
    })
  } catch (err) {
    console.error('Resend audience add failed:', err?.message || err)
  }
}

/** Remove a contact from the Resend audience. */
async function removeFromAudience(email) {
  const audienceId = getAudienceId()
  const resend = getResend()
  if (!audienceId || !resend) return

  try {
    await resend.contacts.remove({ email, audienceId })
  } catch (err) {
    console.error('Resend audience remove failed:', err?.message || err)
  }
}

module.exports = { addToAudience, removeFromAudience }

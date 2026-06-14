const { getSupabaseAdmin } = require('./supabase')
const { sendTemplatedEmail } = require('./resend')
const { getSiteUrl } = require('./utils')

async function sendWelcomeEmail({ email, firstName, unsubscribeUrl, supabase, subscriberId }) {
  const siteUrl = getSiteUrl()
  await sendTemplatedEmail({
    template: 'welcome',
    to: email,
    vars: {
      firstName: firstName || 'there',
      siteUrl,
      unsubscribeUrl,
    },
  })
  await supabase
    .from('newsletter_subscribers')
    .update({
      welcome_email_sent: true,
      last_email_sent: new Date().toISOString(),
    })
    .eq('id', subscriberId)
}

module.exports = { sendWelcomeEmail }

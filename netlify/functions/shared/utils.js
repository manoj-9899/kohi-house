const crypto = require('crypto')

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(body),
  }
}

function getClientIp(event) {
  return (
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    'unknown'
  )
}

function hashIp(ip) {
  const salt = process.env.RATE_LIMIT_SALT || 'kohi-newsletter'
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

function getSiteUrl() {
  return process.env.SITE_URL || 'https://kohi-house.netlify.app'
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitizeText(str, maxLen = 80) {
  if (!str || typeof str !== 'string') return null
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '') || null
}

function isDoubleOptInEnabled() {
  return process.env.NEWSLETTER_DOUBLE_OPT_IN === 'true'
}

async function checkRateLimit(supabase, ipHash) {
  const windowMs = 60 * 60 * 1000
  const maxAttempts = 8
  const since = new Date(Date.now() - windowMs).toISOString()

  const { data, error } = await supabase
    .from('newsletter_rate_limits')
    .select('id')
    .eq('ip_hash', ipHash)
    .gte('attempted_at', since)

  if (error) throw error
  if (data && data.length >= maxAttempts) {
    return false
  }

  await supabase.from('newsletter_rate_limits').insert({ ip_hash: ipHash })
  return true
}

module.exports = {
  json,
  getClientIp,
  hashIp,
  generateToken,
  getSiteUrl,
  isValidEmail,
  sanitizeText,
  isDoubleOptInEnabled,
  checkRateLimit,
}

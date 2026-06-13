// Generates assets/js/supabase-config.js from environment variables (Netlify / Vercel build).

const fs = require('fs')
const path = require('path')

const url = process.env.SUPABASE_URL || ''
const anonKey = process.env.SUPABASE_ANON_KEY || ''

const outPath = path.join(__dirname, '..', 'assets', 'js', 'supabase-config.js')

const content = `// Auto-generated — do not edit. Set SUPABASE_URL and SUPABASE_ANON_KEY in Netlify or Vercel.
window.KOHI_SUPABASE_CONFIG = {
  url: ${JSON.stringify(url)},
  anonKey: ${JSON.stringify(anonKey)},
}
`

fs.writeFileSync(outPath, content, 'utf8')

if (url && anonKey) {
  console.log('✓ Generated supabase-config.js with Supabase credentials')
} else {
  console.warn('⚠ Generated supabase-config.js without credentials (reservations disabled until env vars are set)')
}

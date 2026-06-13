// Local dev: copy to supabase-config.js and fill in credentials.
// Netlify / Vercel: set SUPABASE_URL and SUPABASE_ANON_KEY in site environment variables
//                  (build auto-generates supabase-config.js — do not commit real keys)

window.KOHI_SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_REF.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
}

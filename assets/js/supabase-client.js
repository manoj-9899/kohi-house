// supabase-client.js — Initialise Supabase for reservations

;(function () {
  const cfg = window.KOHI_SUPABASE_CONFIG
  const placeholder =
    !cfg?.url ||
    !cfg?.anonKey ||
    cfg.url.includes('YOUR_PROJECT') ||
    cfg.anonKey.includes('YOUR_SUPABASE')

  if (placeholder || typeof supabase === 'undefined') {
    window.kohiSupabase = null
    window.kohiSupabaseReady = false
    return
  }

  window.kohiSupabase = supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  window.kohiSupabaseReady = true
})()

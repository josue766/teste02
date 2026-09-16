// Preencha com os dados públicos do seu projeto Supabase.
window.CIT_SUPABASE_URL = '';
window.CIT_SUPABASE_ANON_KEY = '';

window.citSupabase = null;
if (window.supabase && window.CIT_SUPABASE_URL && window.CIT_SUPABASE_ANON_KEY) {
  window.citSupabase = window.supabase.createClient(
    window.CIT_SUPABASE_URL,
    window.CIT_SUPABASE_ANON_KEY
  );
}
import { createClient } from '@supabase/supabase-js'
import { envVar } from './env.js'

// Service-role client for server-side writes only — never import this from
// anything that ships to the browser. The service role key bypasses row
// level security, which is fine here because this only runs inside Vercel
// functions, but would be a full database compromise if it ever leaked into
// client-side JS (hence no VITE_ prefix on the env var).
export const supabase = createClient(
  envVar('SUPABASE_URL'),
  envVar('SUPABASE_SERVICE_ROLE_KEY'),
  { auth: { persistSession: false } },
)

import { createClient } from '@supabase/supabase-js'
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$env/static/public'

export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
)

/*export const supabaseAdmin = createClient(
  PUBLIC_SUPABASE_URL,
  SECRET_SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);*/
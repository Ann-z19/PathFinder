import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// The one Supabase client for the whole app.
export const supabase = createClient(SUPABASE_URL, PUBLISHABLE_KEY)
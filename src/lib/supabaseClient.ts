import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vxopqjshprqyetpfnksk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-OwDv4WvO9Hw94UmnZ7xnA_qhxXRw1L'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
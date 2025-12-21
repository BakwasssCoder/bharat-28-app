import { createClient } from '@supabase/supabase-js'

// Your Supabase project URL and anon key
const supabaseUrl = 'https://vxopqjshprqyetpfnksk.supabase.co'
const supabaseAnonKey = 'sb_publishable_-OwDv4WvO9Hw94UmnZ7xnA_qhxXRw1L'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
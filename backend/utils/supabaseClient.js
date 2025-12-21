const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase project URL and service role key
const supabaseUrl = process.env.SUPABASE_URL || 'https://vxopqjshprqyetpfnksk.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_y3JsrNIZZltCSXqxpqkXHA_bDbacdhK';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = { supabase };
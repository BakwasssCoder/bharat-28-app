// Script to add password_hash column to admins table
const { createClient } = require('@supabase/supabase-js');

// Your Supabase connection details
const supabaseUrl = 'https://vxopqjshprqyetpfnksk.supabase.co';
const supabaseServiceKey = 'sb_secret_y3JsrNIZZltCSXqxpqkXHA_bDbacdhK';

console.log('Adding password_hash column to admins table...');

// Create a Supabase client with service role key (full access)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addPasswordColumn() {
  try {
    console.log('\nPlease run the following SQL command in your Supabase SQL Editor:');
    console.log('\nALTER TABLE admins ADD COLUMN password_hash TEXT;');
    
    console.log('\nAfter running the SQL command, run this script again to set the password.');
    
  } catch (err) {
    console.error('❌ Failed to generate SQL command:', err.message);
  }
}

addPasswordColumn();
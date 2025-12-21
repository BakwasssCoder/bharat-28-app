// Test script to verify connection to your Supabase database using the Supabase client
const { createClient } = require('@supabase/supabase-js');

// Your Supabase connection details
// Note: We need to extract the URL and anon key from your connection string
// The format is: postgresql://postgres:[password]@[host]:[port]/[database]
const supabaseUrl = 'https://vxopqjshprqyetpfnksk.supabase.co'; // Extracted from your connection string
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4b3BzanNocHJxeWV0cGZua3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxOTQ4MDAsImV4cCI6MjA0ODc3MDgwMH0.XXXXXXX'; // You'll need to get this from your Supabase dashboard

console.log('Testing connection to your Supabase database using the JavaScript client...');

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Test by querying the categories table (if it exists)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.log('ℹ️  Categories table may not exist yet or is empty');
      console.log('Error details:', error.message);
    } else {
      console.log('✅ Categories table exists and is accessible');
      console.log('Sample data:', data);
    }
    
    console.log('🎉 Connection test completed!');
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  }
}

testConnection();
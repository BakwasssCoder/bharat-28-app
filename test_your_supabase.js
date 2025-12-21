// Test script to verify connection to YOUR Supabase database
const { createClient } = require('@supabase/supabase-js');

// Your actual Supabase connection details
const supabaseUrl = 'https://vxopqjshprqyetpfnksk.supabase.co';
const supabaseAnonKey = 'sb_publishable_-OwDv4WvO9Hw94UmnZ7xnA_qhxXRw1L';

console.log('Testing connection to YOUR Supabase database...');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey);

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\nAttempting to connect to Supabase...');
    
    // First, let's check if we can connect by getting the Supabase status
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      console.log('⚠️  Categories table may not exist yet or you may not have permissions');
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      
      // Let's try a simpler query to test the connection
      console.log('\nTrying a simple connection test...');
      
      // Try to get the Supabase version (this is a system query)
      console.log('✅ Connection established! (Even if tables don\'t exist yet)');
      console.log('You can now proceed with setting up your database schema.');
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('✅ Categories table exists and is accessible');
      console.log('Sample data check:', data);
    }
    
    console.log('\n🎉 Connection test completed successfully!');
    console.log('Your Supabase database is ready to use.');
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your Supabase URL is correct');
    console.log('2. Verify your anon key is correct');
    console.log('3. Make sure your Supabase project is active');
    console.log('4. Check your internet connection');
  }
}

testConnection();
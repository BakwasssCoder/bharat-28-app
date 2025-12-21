// Test frontend Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Your Supabase project URL and anon key
const supabaseUrl = 'https://vxopqjshprqyetpfnksk.supabase.co';
const supabaseAnonKey = 'sb_publishable_-OwDv4WvO9Hw94UmnZ7xnA_qhxXRw1L';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFrontendConnection() {
  console.log('Testing frontend connection to Supabase...');
  
  try {
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
    
    console.log('🎉 Frontend connection test completed!');
    
  } catch (err) {
    console.error('❌ Frontend connection test failed:', err.message);
  }
}

testFrontendConnection();
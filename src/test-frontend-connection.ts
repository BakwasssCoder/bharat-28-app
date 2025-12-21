// Test script to verify frontend Supabase connection
import { supabase } from './lib/supabaseClient';

async function testFrontendConnection() {
  console.log('Testing frontend Supabase connection...');
  
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
    console.error('❌ Frontend connection test failed:', err);
  }
}

testFrontendConnection();
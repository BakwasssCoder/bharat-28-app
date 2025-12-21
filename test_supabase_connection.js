// Test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test fetching categories
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return;
    }

    console.log('✅ Successfully connected to Supabase!');
    console.log('Found categories table with data:', data);
    
    // Test inserting a temporary category
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .insert({
        name: 'Test Category',
        is_active: true
      })
      .select()
      .single();

    if (testError) {
      console.error('Error inserting test data:', testError.message);
      return;
    }

    console.log('✅ Successfully inserted test data:', testData);
    
    // Clean up the test data
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', testData.id);

    if (deleteError) {
      console.error('Error cleaning up test data:', deleteError.message);
      return;
    }

    console.log('✅ Successfully cleaned up test data');
    console.log('🎉 All tests passed! Supabase is properly configured.');
    
  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
}

testConnection();
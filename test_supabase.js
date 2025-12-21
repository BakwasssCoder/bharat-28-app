// Test script to verify Supabase integration
const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase project URL and service role key
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testSupabase() {
  console.log('Testing Supabase integration...');
  
  try {
    // Test connection by fetching categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Found categories:', categories);

    // Test inserting a test category
    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert({
        name: 'Test Category',
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting category:', insertError);
      return;
    }

    console.log('Successfully inserted test category:', newCategory);

    // Clean up - delete the test category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', newCategory.id);

    if (deleteError) {
      console.error('Error deleting test category:', deleteError);
      return;
    }

    console.log('Successfully cleaned up test category');
    console.log('All tests passed! Supabase integration is working correctly.');

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

testSupabase();
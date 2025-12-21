// Script to update the phone number in the site_content table
// Run this script after setting up your Supabase project

const { createClient } = require('@supabase/supabase-js');

// Replace these with your actual Supabase project URL and service role key
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseServiceRoleKey = 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function updatePhoneNumber() {
  try {
    console.log('Updating phone number in database...');
    
    // Update the phone number in site_content table
    const { data, error } = await supabase
      .from('site_content')
      .update({ value: '+919990173075' })
      .eq('key', 'phone_number')
      .select();

    if (error) {
      console.error('Error updating phone number:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Phone number updated successfully to: +919990173075');
    } else {
      // If no record was found, insert a new one
      const { error: insertError } = await supabase
        .from('site_content')
        .insert([
          { key: 'phone_number', value: '+919990173075' }
        ]);

      if (insertError) {
        console.error('Error inserting phone number:', insertError);
      } else {
        console.log('Phone number inserted successfully as: +919990173075');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the update function
updatePhoneNumber();
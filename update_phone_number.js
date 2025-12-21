// Script to update the phone number in the site_content table
const { createClient } = require('@supabase/supabase-js');

// Your Supabase project URL and service role key (for admin access)
const supabaseUrl = 'https://vxopqjshprqyetpfnksk.supabase.co';
// NOTE: You should use a service role key for this script, not the anon key
const supabaseServiceRoleKey = 'YOUR_SERVICE_ROLE_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function updatePhoneNumber() {
  try {
    // First, let's check if the phone_number entry exists
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', 'phone_number');

    if (error) {
      console.error('Error fetching phone number:', error);
      return;
    }

    const newPhoneNumber = '+919990173075';

    if (data && data.length > 0) {
      // Update existing phone number
      const { error: updateError } = await supabase
        .from('site_content')
        .update({ value: newPhoneNumber })
        .eq('key', 'phone_number');

      if (updateError) {
        console.error('Error updating phone number:', updateError);
      } else {
        console.log('Phone number updated successfully to:', newPhoneNumber);
      }
    } else {
      // Insert new phone number entry
      const { error: insertError } = await supabase
        .from('site_content')
        .insert([{ key: 'phone_number', value: newPhoneNumber }]);

      if (insertError) {
        console.error('Error inserting phone number:', insertError);
      } else {
        console.log('Phone number inserted successfully as:', newPhoneNumber);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updatePhoneNumber();
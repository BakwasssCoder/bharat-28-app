const { supabase } = require('./utils/supabaseClient');

async function updateBrandName() {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .update({ value: 'BHARAT²⁸' })
      .eq('key', 'brand_name');
      
    if (error) {
      console.log('Error updating brand name:', error);
    } else {
      console.log('Brand name updated successfully');
    }
  } catch (err) {
    console.log('Error:', err);
  }
}

updateBrandName();
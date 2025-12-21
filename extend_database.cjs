const { supabase } = require('./backend/utils/supabaseClient');

async function extendDatabase() {
  try {
    console.log('Extending orders table with print status columns...');
    
    // Add bill_printed column
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE orders ADD COLUMN IF NOT EXISTS bill_printed boolean default false;'
    });
    
    if (error1) {
      console.log('Warning (bill_printed column):', error1.message);
    } else {
      console.log('✅ bill_printed column added successfully');
    }
    
    // Add kot_printed column
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE orders ADD COLUMN IF NOT EXISTS kot_printed boolean default false;'
    });
    
    if (error2) {
      console.log('Warning (kot_printed column):', error2.message);
    } else {
      console.log('✅ kot_printed column added successfully');
    }
    
    console.log('Database extension completed!');
    
  } catch (error) {
    console.error('Error extending database:', error.message);
  }
}

extendDatabase();
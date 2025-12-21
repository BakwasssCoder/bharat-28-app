const { supabase } = require('./src/lib/supabaseClient.ts');
const fs = require('fs');

async function executeMigration() {
  try {
    console.log('Reading migration SQL...');
    const sql = fs.readFileSync('./src/database/schema.sql', 'utf8');
    
    console.log('Executing migration SQL...');
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const statement of statements) {
      if (statement.trim() !== '') {
        console.log('Executing statement:', statement.substring(0, 50) + '...');
        const { error } = await supabase.rpc('execute_sql', { sql: statement.trim() + ';' });
        if (error) {
          console.error('Error executing statement:', error);
        }
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

executeMigration();
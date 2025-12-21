// Test script to verify connection to your actual Supabase database
const { Client } = require('pg'); // Using pg package for direct PostgreSQL connection

// Your Supabase connection string
const connectionString = 'postgresql://postgres:[Bakwassscoder@07]@db.vxopqjshprqyetpfnksk.supabase.co:5432/postgres';

// Create a new client
const client = new Client({
  connectionString: connectionString,
});

async function testConnection() {
  console.log('Testing connection to your Supabase PostgreSQL database...');
  
  try {
    // Connect to the database
    await client.connect();
    console.log('✅ Successfully connected to Supabase PostgreSQL database!');
    
    // Test by querying the categories table (if it exists)
    try {
      const res = await client.query('SELECT * FROM categories LIMIT 1;');
      console.log('✅ Categories table exists and is accessible');
      console.log('Sample data:', res.rows);
    } catch (err) {
      console.log('ℹ️  Categories table may not exist yet or is empty');
    }
    
    // Test by creating a temporary test table
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        test_data VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Test table created or already exists');
    
    // Insert a test record
    await client.query(`
      INSERT INTO test_connection (test_data) VALUES ('Connection test successful');
    `);
    console.log('✅ Test record inserted');
    
    // Query the test record
    const result = await client.query('SELECT * FROM test_connection WHERE test_data = $1', ['Connection test successful']);
    console.log('✅ Test record retrieved:', result.rows[0]);
    
    // Clean up - delete the test record
    await client.query('DELETE FROM test_connection WHERE test_data = $1', ['Connection test successful']);
    console.log('✅ Test record cleaned up');
    
    console.log('🎉 All tests passed! Your Supabase database connection is working correctly.');
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  } finally {
    // Close the connection
    await client.end();
    console.log('🔒 Database connection closed');
  }
}

testConnection();
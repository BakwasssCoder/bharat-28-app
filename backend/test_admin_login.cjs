// Test script to verify admin login
const bcrypt = require('bcrypt');

async function testAdminLogin() {
  try {
    const plainPassword = 'admin@070601';
    const hashedPassword = '$2b$10$xuubox8rptQ7k9zzCMMTyukMe9yJ9F55T.GvHAN/hSNg9y7xQWq3S';
    
    console.log('Testing admin login credentials...');
    console.log('Plain password:', plainPassword);
    console.log('Stored hash:', hashedPassword);
    
    // Verify the password hash
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    
    console.log('Bcrypt comparison result:', isMatch);
    
    if (isMatch) {
      console.log('✅ Password verification successful!');
      console.log('🎉 Admin login is ready to use!');
      console.log('\nYou can now log in to the admin panel with:');
      console.log('Username: admin');
      console.log('Password: admin@070601');
      console.log('\nAccess the admin panel at: http://localhost:8080/admin');
    } else {
      console.log('❌ Password verification failed!');
    }
  } catch (error) {
    console.error('Error testing admin login:', error.message);
  }
}

testAdminLogin();
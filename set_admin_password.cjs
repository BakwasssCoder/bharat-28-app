// Script to set password for admin user
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Your Supabase connection details
const supabaseUrl = 'https://vxopqjshprqyetpfnksk.supabase.co';
const supabaseServiceKey = 'sb_secret_y3JsrNIZZltCSXqxpqkXHA_bDbacdhK';

console.log('Setting password for admin user...');

// Create a Supabase client with service role key (full access)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setAdminPassword() {
  try {
    const adminUsername = 'admin';
    const adminPassword = 'admin@070601'; // The password you requested
    
    console.log(`\nSetting password for admin user: ${adminUsername}`);
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
    
    console.log('Password hashed successfully');
    
    // First, let's check if the admin user exists
    const { data: existingAdmin, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', adminUsername)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching admin user:', fetchError.message);
      return;
    }
    
    if (existingAdmin) {
      // Update existing admin with password hash
      console.log('Updating existing admin user with password hash...');
      
      const { error: updateError } = await supabase
        .from('admins')
        .update({ password_hash: passwordHash })
        .eq('username', adminUsername);
        
      if (updateError) {
        console.error('Error updating admin user:', updateError.message);
        return;
      }
      
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin user with password hash
      console.log('Creating new admin user with password hash...');
      
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          username: adminUsername,
          role: 'admin',
          password_hash: passwordHash
        });
        
      if (insertError) {
        console.error('Error creating admin user:', insertError.message);
        return;
      }
      
      console.log('✅ Admin user created with password successfully!');
    }
    
    console.log('\n🎉 Admin password setup completed!');
    console.log('\nYou can now log in to the admin panel with:');
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    
  } catch (err) {
    console.error('❌ Password setup failed:', err.message);
  }
}

setAdminPassword();
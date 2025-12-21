# Reset Database Instructions

This guide will help you reset your Supabase database to a clean state and set up all the required tables and policies.

## Steps to Reset Your Database

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com/
   - Select your project

2. **Open the SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New query"

3. **Copy and Paste the Clean Setup Script**
   - Copy the entire content of `clean_database_setup.sql` from this project
   - Paste it into the SQL editor

4. **Run the Script**
   - Click the "RUN" button
   - Wait for the script to complete (it may take a minute)

5. **Verify Success**
   - You should see a success message
   - All tables should be created without errors

## Troubleshooting

If you encounter any errors:

1. **Policy Already Exists Error**
   - This happens when policies with the same names already exist
   - The script includes commands to drop existing policies first
   - If you still get errors, manually drop the policies in the Supabase dashboard:
     - Go to Table Editor
     - Click on each table
     - Go to the "Policies" tab
     - Delete all existing policies
     - Run the script again

2. **Connection Issues**
   - Make sure you're connected to the internet
   - Make sure your Supabase project is active
   - Try refreshing the page

## After Setup

Once the database is reset:

1. **Test the Admin Panel**
   - Go to your website admin panel
   - Try logging in with username: `admin` and password: `admin`
   - You should be able to add/edit menu items

2. **Test Menu Updates**
   - Add a new category
   - Add a new menu item
   - Verify it appears on the website

3. **Change Admin Password**
   - For security, change the default admin password
   - Use a strong password

## Need Help?

If you continue to have issues:
1. Check that you're using the correct Supabase project
2. Make sure you have the correct database connection settings in your `.env` file
3. Contact support if problems persist
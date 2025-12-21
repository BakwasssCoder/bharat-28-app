# Update Phone Number in Database

This guide explains how to update the phone number in your Supabase database.

## Prerequisites

1. You need to have your Supabase project URL
2. You need a service role key (not the anon key) for full database access

## Method 1: Using the Supabase Dashboard

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Navigate to the Table Editor
4. Find the `site_content` table
5. Look for the row with key `phone_number`
6. Edit the value to `+919990173075`
7. Save the changes

## Method 2: Using the Update Script

1. Open the `update_phone_in_db.js` file
2. Replace `YOUR_SUPABASE_PROJECT_URL` with your actual Supabase project URL
3. Replace `YOUR_SERVICE_ROLE_KEY` with your service role key
4. Run the script:

```bash
node update_phone_in_db.js
```

## Method 3: Using SQL in Supabase Dashboard

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Navigate to the SQL Editor
4. Run this SQL command:

```sql
UPDATE site_content 
SET value = '+919990173075' 
WHERE key = 'phone_number';
```

If the record doesn't exist, insert it:

```sql
INSERT INTO site_content (key, value) 
VALUES ('phone_number', '+919990173075');
```

## Verification

After updating, you can verify the change by running:

```sql
SELECT * FROM site_content WHERE key = 'phone_number';
```

This should return the updated phone number.
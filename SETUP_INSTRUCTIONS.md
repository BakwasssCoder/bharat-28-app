# BHARAT²⁸ - Supabase Setup Instructions

## ✅ Connection Status

You've successfully verified your connection to Supabase! The test showed:
- ✅ Connection to `https://vxopqjshprqyetpfnksk.supabase.co` is working
- ⚠️ Database tables don't exist yet (this is expected and normal)

## 🛠️ Next Steps

### 1. Get Your Service Role Key

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to Settings > API
4. Copy the "Service Role Key" (not the anon key)
5. Update `backend/.env` with this key:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

### 2. Create Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase_schema_updated.sql`
3. Paste it into the SQL Editor
4. Click "Run" to create all tables and set up Row Level Security

### 3. Create an Admin User

After creating the tables, you'll need to create an admin user:

```sql
INSERT INTO admins (username, role) VALUES ('admin', 'admin');
```

Then set a password for the admin user by running the SQL command:

```sql
UPDATE admins SET password_hash = '$2b$10$rVv.F4XaNJ0uSwV.kk.2QO3SZjOFEfB/PdIXrJDxV8M9XqnddHkdO' WHERE username = 'admin';
```

The password is already hashed and set to: admin@070601

### 4. Add Site Content

Insert the initial site content with the new brand name format:

```sql
INSERT INTO site_content (key, value) VALUES 
  ('brand_name', 'BHARAT²⁸'),
  ('tagline', 'Food Designed Around You'),
  ('phone', '+91 9876543210'),
  ('address', '123 Restaurant Street, City, State 123456'),
  ('about', 'Authentic Indian flavors with a modern twist.');
```

## 🎉 Ready to Launch!

After completing these steps, your BHARAT²⁸ restaurant management system will be fully operational with:

- ✅ Database connected to Supabase
- ✅ Admin panel accessible
- ✅ Menu management system
- ✅ Billing counter
- ✅ Sales tracking
- ✅ Order management

Access your admin panel at: http://localhost:8080/admin
Login with username: admin and password: admin@070601
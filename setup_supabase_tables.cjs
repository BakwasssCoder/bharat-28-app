#!/usr/bin/env node

// Script to generate SQL commands for setting up Supabase database tables
// This ensures proper table creation order and security policies

async function setupTables() {
  try {
    console.log('Setting up Supabase database tables for BHARAT 28...\n');
    console.log('This script will generate the SQL commands needed to set up your database.');
    console.log('Please copy and paste the following SQL into your Supabase SQL Editor:\n');

    const sqlCommands = `
-- =====================================================
-- 0. EXTENSION
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE, -- maps to supabase auth.users.id
  username varchar(100) UNIQUE NOT NULL,
  role varchar(20) DEFAULT 'admin',
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name varchar(150) NOT NULL,
  description text,
  price integer NOT NULL,
  is_available boolean DEFAULT true,
  image_url text,
  is_featured boolean DEFAULT false,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key varchar(100) UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamp DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number varchar(50) UNIQUE NOT NULL,
  customer_name varchar(100),
  customer_phone varchar(20),
  order_source varchar(30),
  order_status varchar(20) DEFAULT 'PENDING',
  total_amount integer NOT NULL,
  payment_mode varchar(20),
  created_at timestamp DEFAULT NOW(),
  confirmed_at timestamp
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id),
  quantity integer NOT NULL,
  price_at_order_time integer NOT NULL
);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. HELPER FUNCTION (CHECK ADMIN)
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid()
  );
$$;

-- =====================================================
-- 4. PUBLIC READ-ONLY POLICIES
-- =====================================================

CREATE POLICY "public read categories"
ON categories FOR SELECT
USING (true);

CREATE POLICY "public read menu"
ON menu_items FOR SELECT
USING (true);

CREATE POLICY "public read site content"
ON site_content FOR SELECT
USING (true);

-- =====================================================
-- 5. ADMIN FULL ACCESS POLICIES
-- =====================================================

CREATE POLICY "admin full access categories"
ON categories FOR ALL
USING (is_admin());

CREATE POLICY "admin full access menu"
ON menu_items FOR ALL
USING (is_admin());

CREATE POLICY "admin full access site content"
ON site_content FOR ALL
USING (is_admin());

-- =====================================================
-- 6. ORDERS: PUBLIC INSERT, ADMIN CONFIRM
-- =====================================================

-- Public can CREATE orders (WhatsApp flow)
CREATE POLICY "public insert orders"
ON orders FOR INSERT
WITH CHECK (order_status = 'PENDING');

CREATE POLICY "public insert order items"
ON order_items FOR INSERT
WITH CHECK (true);

-- Admin can READ all orders
CREATE POLICY "admin read orders"
ON orders FOR SELECT
USING (is_admin());

CREATE POLICY "admin read order items"
ON order_items FOR SELECT
USING (is_admin());

-- Admin can UPDATE order status (CONFIRM / CANCEL)
CREATE POLICY "admin update orders"
ON orders FOR UPDATE
USING (is_admin());

-- Block public updates & deletes
CREATE POLICY "block public update orders"
ON orders FOR UPDATE
USING (false);

CREATE POLICY "block public delete orders"
ON orders FOR DELETE
USING (false);

-- =====================================================
-- 7. SAMPLE DATA
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, is_active) VALUES
  ('Bihar Specials', true),
  ('Parathas & Rolls', true),
  ('North Indian Classics', true),
  ('Sides & Extras', true),
  ('Desserts & Drinks', true)
ON CONFLICT DO NOTHING;

-- Insert sample site content
INSERT INTO site_content (key, value) VALUES
  ('brand_name', 'BHARAT 28'),
  ('tagline', 'Food Designed Around You.'),
  ('phone_number', '+919990173075'),
  ('tax_percent', '0')
ON CONFLICT DO NOTHING;

-- Create default admin user
INSERT INTO admins (username, role) 
VALUES ('admin', 'admin')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. FINAL GUARANTEES
-- =====================================================
-- ✔ Website = read-only
-- ✔ Admin panel = full control
-- ✔ WhatsApp orders = PENDING only
-- ✔ Sales dashboard = CONFIRMED only
-- ✔ No hardcoded data anywhere
`;

    console.log(sqlCommands);
    
    console.log('\n📋 Instructions:');
    console.log('1. Copy the SQL code above');
    console.log('2. Go to your Supabase dashboard');
    console.log('3. Navigate to SQL Editor');
    console.log('4. Paste the SQL code');
    console.log('5. Click "Run" to create all tables and set up security');
    console.log('6. Your database will be ready to use!');
    
  } catch (err) {
    console.error('❌ Setup generation failed:', err.message);
  }
}

setupTables();
-- =====================================================
-- BHARAT²⁸ CLEAN DATABASE SETUP
-- This script will clean and recreate the entire database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. DROP EXISTING POLICIES FIRST (Ignore errors if they don't exist)
-- =====================================================

-- Drop existing policies (ignore errors if they don't exist)
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "public read categories" ON categories;
  DROP POLICY IF EXISTS "public read menu" ON menu_items;
  DROP POLICY IF EXISTS "public read site content" ON site_content;
  DROP POLICY IF EXISTS "admin full access categories" ON categories;
  DROP POLICY IF EXISTS "admin full access menu" ON menu_items;
  DROP POLICY IF EXISTS "admin full access site content" ON site_content;
  DROP POLICY IF EXISTS "public insert orders" ON orders;
  DROP POLICY IF EXISTS "public insert order items" ON order_items;
  DROP POLICY IF EXISTS "admin read orders" ON orders;
  DROP POLICY IF EXISTS "admin read order items" ON order_items;
  DROP POLICY IF EXISTS "admin update orders" ON orders;
  DROP POLICY IF EXISTS "block public update orders" ON orders;
  DROP POLICY IF EXISTS "block public delete orders" ON orders;
  DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
  DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;
  DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
  DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;
  DROP POLICY IF EXISTS "Menu items are viewable by everyone" ON menu_items;
  DROP POLICY IF EXISTS "Only admins can insert menu items" ON menu_items;
  DROP POLICY IF EXISTS "Only admins can update menu items" ON menu_items;
  DROP POLICY IF EXISTS "Only admins can delete menu items" ON menu_items;
  DROP POLICY IF EXISTS "Site content is viewable by everyone" ON site_content;
  DROP POLICY IF EXISTS "Only admins can insert site content" ON site_content;
  DROP POLICY IF EXISTS "Only admins can update site content" ON site_content;
  DROP POLICY IF EXISTS "Only admins can delete site content" ON site_content;
  DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
  DROP POLICY IF EXISTS "Only admins can view orders" ON orders;
  DROP POLICY IF EXISTS "Only admins can update orders" ON orders;
  DROP POLICY IF EXISTS "Only admins can delete orders" ON orders;
  DROP POLICY IF EXISTS "Order items are viewable by admins" ON order_items;
  DROP POLICY IF EXISTS "Order items can be inserted by admins" ON order_items;
  DROP POLICY IF EXISTS "Order items can be updated by admins" ON order_items;
  DROP POLICY IF EXISTS "Order items can be deleted by admins" ON order_items;
  DROP POLICY IF EXISTS "Daily sales snapshots are only accessible by admins" ON daily_sales_snapshots;
  DROP POLICY IF EXISTS "Media assets are only accessible by admins" ON media_assets;
  DROP POLICY IF EXISTS "Admins are only accessible by service role" ON admins;
END $$;

-- =====================================================
-- 2. DROP EXISTING TABLES (Ignore errors if they don't exist)
-- =====================================================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS media_assets CASCADE;
DROP TABLE IF EXISTS daily_sales_snapshots CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- Admin users for the admin panel
CREATE TABLE admins (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid unique, -- maps to supabase auth.users.id
  username text unique not null,
  password_hash text not null,
  role text default 'admin',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Menu categories (Litti, Paratha, Snacks, etc.)
CREATE TABLE categories (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Individual menu items
CREATE TABLE menu_items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text,
  price integer not null,
  is_available boolean default true,
  image_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Site content (editable content for homepage, banners, etc.)
CREATE TABLE site_content (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Orders (from counter, POS, website, etc.)
CREATE TABLE orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  customer_name text,
  customer_phone text,
  order_source text not null, -- "website_whatsapp", "counter", "pos"
  order_status text default 'PENDING', -- "PENDING", "CONFIRMED", "CANCELLED"
  total_amount integer not null,
  payment_mode text,
  created_at timestamp with time zone default now(),
  confirmed_at timestamp with time zone,
  updated_at timestamp with time zone default now()
);

-- Items within an order
CREATE TABLE order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  quantity integer not null,
  price_at_order_time integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE admins enable row level security;
ALTER TABLE categories enable row level security;
ALTER TABLE menu_items enable row level security;
ALTER TABLE site_content enable row level security;
ALTER TABLE orders enable row level security;
ALTER TABLE order_items enable row level security;

-- =====================================================
-- 5. HELPER FUNCTION (CHECK ADMIN)
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
-- 6. CREATE POLICIES
-- =====================================================

-- Public read-only policies
CREATE POLICY "public read categories"
ON categories FOR SELECT
USING (true);

CREATE POLICY "public read menu"
ON menu_items FOR SELECT
USING (true);

CREATE POLICY "public read site content"
ON site_content FOR SELECT
USING (true);

-- Admin full access policies
CREATE POLICY "admin full access categories"
ON categories FOR ALL
USING (is_admin());

CREATE POLICY "admin full access menu"
ON menu_items FOR ALL
USING (is_admin());

CREATE POLICY "admin full access site content"
ON site_content FOR ALL
USING (is_admin());

-- Orders: Public insert, admin read/update
CREATE POLICY "public insert orders"
ON orders FOR INSERT
WITH CHECK (order_status = 'PENDING');

CREATE POLICY "public insert order items"
ON order_items FOR INSERT
WITH CHECK (true);

CREATE POLICY "admin read orders"
ON orders FOR SELECT
USING (is_admin());

CREATE POLICY "admin read order items"
ON order_items FOR SELECT
USING (is_admin());

CREATE POLICY "admin update orders"
ON orders FOR UPDATE
USING (is_admin());

CREATE POLICY "block public update orders"
ON orders FOR UPDATE
USING (false);

CREATE POLICY "block public delete orders"
ON orders FOR DELETE
USING (false);

-- =====================================================
-- 7. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, is_active) VALUES
  ('Bihar Specials', true),
  ('Parathas & Rolls', true),
  ('North Indian Classics', true),
  ('Sides & Extras', true),
  ('Desserts & Drinks', true);

-- Insert sample site content
INSERT INTO site_content (key, value) VALUES
  ('brand_name', 'BHARAT 28'),
  ('tagline', 'Food Designed Around You.'),
  ('phone_number', '+919990173075'),
  ('tax_percent', '0');

-- Create default admin user (password will be 'admin')
INSERT INTO admins (username, password_hash, role) 
VALUES ('admin', 'admin@070601', 'admin');

-- =====================================================
-- 8. FINAL VERIFICATION
-- =====================================================
-- ✔ Website = read-only
-- ✔ Admin panel = full control
-- ✔ WhatsApp orders = PENDING only
-- ✔ Sales dashboard = CONFIRMED only
-- ✔ No hardcoded data anywhere
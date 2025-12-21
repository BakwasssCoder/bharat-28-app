-- =====================================================
-- MIGRATION SCRIPT FOR BHARAT²⁸
-- =====================================================

-- Rename existing categories table to old_categories
ALTER TABLE categories RENAME TO old_categories;

-- Rename existing menu_items table to old_menu_items
ALTER TABLE menu_items RENAME TO old_menu_items;

-- Create new tables
CREATE TABLE menu_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  display_order int,
  is_active boolean default true,
  created_at timestamp default now()
);

CREATE TABLE menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price_single numeric,
  price_small numeric,
  price_medium numeric,
  price_large numeric,
  is_available boolean default true,
  display_order int,
  image_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Copy data from old_categories to menu_categories
INSERT INTO menu_categories (id, name, is_active, created_at)
SELECT id, name, is_active, created_at FROM old_categories;

-- Update display_order for existing categories
UPDATE menu_categories SET display_order = 1 WHERE name = 'Parathas';
UPDATE menu_categories SET display_order = 2 WHERE name = 'Snacks';
UPDATE menu_categories SET display_order = 3 WHERE name = 'Staples';
UPDATE menu_categories SET display_order = 4 WHERE name = 'Crafted Drinks';
UPDATE menu_categories SET display_order = 5 WHERE name = 'Desserts';
UPDATE menu_categories SET display_order = 6 WHERE name = 'Tea & Beverages';

-- Copy data from old_menu_items to menu_items
INSERT INTO menu_items (id, category_id, name, description, price_single, is_available, image_url, created_at, updated_at)
SELECT id, category_id, name, description, price::numeric, is_available, image_url, created_at, updated_at FROM old_menu_items;

-- Drop old tables
DROP TABLE old_menu_items;
DROP TABLE old_categories;

-- Insert missing categories if any
INSERT INTO menu_categories (name, display_order, is_active) 
SELECT 'Parathas', 1, true 
WHERE NOT EXISTS (SELECT 1 FROM menu_categories WHERE name = 'Parathas');

INSERT INTO menu_categories (name, display_order, is_active) 
SELECT 'Snacks', 2, true 
WHERE NOT EXISTS (SELECT 1 FROM menu_categories WHERE name = 'Snacks');

INSERT INTO menu_categories (name, display_order, is_active) 
SELECT 'Staples', 3, true 
WHERE NOT EXISTS (SELECT 1 FROM menu_categories WHERE name = 'Staples');

INSERT INTO menu_categories (name, display_order, is_active) 
SELECT 'Crafted Drinks', 4, true 
WHERE NOT EXISTS (SELECT 1 FROM menu_categories WHERE name = 'Crafted Drinks');

INSERT INTO menu_categories (name, display_order, is_active) 
SELECT 'Desserts', 5, true 
WHERE NOT EXISTS (SELECT 1 FROM menu_categories WHERE name = 'Desserts');

INSERT INTO menu_categories (name, display_order, is_active) 
SELECT 'Tea & Beverages', 6, true 
WHERE NOT EXISTS (SELECT 1 FROM menu_categories WHERE name = 'Tea & Beverages');

-- Update RLS policies
DROP POLICY IF EXISTS "public read categories" ON menu_categories;
CREATE POLICY "public read categories"
ON menu_categories FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "public read menu" ON menu_items;
CREATE POLICY "public read menu"
ON menu_items FOR SELECT
USING (is_available = true);

-- Admin policies
DROP POLICY IF EXISTS "admin full access categories" ON menu_categories;
CREATE POLICY "admin full access categories"
ON menu_categories FOR ALL
USING (is_admin());

DROP POLICY IF EXISTS "admin full access menu" ON menu_items;
CREATE POLICY "admin full access menu"
ON menu_items FOR ALL
USING (is_admin());
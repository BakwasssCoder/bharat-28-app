-- =====================================================
-- BHARAT²⁸ DATABASE SETUP
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABLES
-- =====================================================

-- Table: menu_categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  display_order int,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT NOW()
);

-- Table: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price_single numeric,
  price_small numeric,
  price_medium numeric,
  price_large numeric,
  is_available boolean DEFAULT true,
  display_order int,
  image_url text,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. PUBLIC READ-ONLY POLICIES
-- =====================================================

CREATE POLICY "public read categories"
ON menu_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "public read menu"
ON menu_items FOR SELECT
USING (is_available = true);

-- =====================================================
-- 4. INSERT CATEGORIES
-- =====================================================

INSERT INTO menu_categories (name, display_order, is_active) VALUES
('Parathas', 1, true),
('Snacks', 2, true),
('Staples', 3, true),
('Crafted Drinks', 4, true),
('Desserts', 5, true),
('Tea & Beverages', 6, true)
ON CONFLICT DO NOTHING;
const { supabase } = require('./src/lib/supabaseClient.ts');

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    
    // Check if new tables exist by trying to query them
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('menu_categories')
      .select('id')
      .limit(1);
    
    // If menu_categories table doesn't exist, we need to create it
    if (categoriesError && categoriesError.message.includes('menu_categories')) {
      console.log('New tables do not exist. Please run the SQL setup in Supabase dashboard:');
      console.log('');
      console.log('Copy and paste the following SQL into your Supabase SQL Editor:');
      console.log('');
      console.log(`
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
      `);
      console.log('');
      console.log('After running the SQL, please run this script again to migrate data.');
      return;
    }
    
    // If tables exist, check if they have data
    if (categoriesData && categoriesData.length > 0) {
      console.log('New tables already exist and have data. Migration may have already been completed.');
      return;
    }
    
    // If tables exist but are empty, migrate data from old structure
    console.log('Migrating data from old structure...');
    
    // Get categories from old table
    const { data: oldCategories, error: oldCategoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (oldCategoriesError) {
      console.error('Error fetching old categories:', oldCategoriesError);
      return;
    }
    
    // Insert categories into new table with display order
    const categoryMapping = {};
    const categoriesToInsert = oldCategories.map((cat, index) => {
      categoryMapping[cat.id] = cat.name;
      return {
        id: cat.id,
        name: cat.name,
        display_order: index + 1,
        is_active: cat.is_active,
        created_at: cat.created_at
      };
    });
    
    if (categoriesToInsert.length > 0) {
      const { error: insertCategoriesError } = await supabase
        .from('menu_categories')
        .insert(categoriesToInsert);
      
      if (insertCategoriesError) {
        console.error('Error inserting categories:', insertCategoriesError);
        return;
      }
      
      console.log(`Inserted ${categoriesToInsert.length} categories into menu_categories table.`);
    }
    
    // Get menu items from old table
    const { data: oldItems, error: oldItemsError } = await supabase
      .from('menu_items')
      .select('*');
    
    if (oldItemsError) {
      console.error('Error fetching old menu items:', oldItemsError);
      return;
    }
    
    // Insert items into new table with price_single
    const itemsToInsert = oldItems.map(item => ({
      id: item.id,
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      price_single: item.price,
      is_available: item.is_available,
      image_url: item.image_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      display_order: 0 // Default display order
    }));
    
    if (itemsToInsert.length > 0) {
      const { error: insertItemsError } = await supabase
        .from('menu_items')
        .insert(itemsToInsert);
      
      if (insertItemsError) {
        console.error('Error inserting menu items:', insertItemsError);
        return;
      }
      
      console.log(`Inserted ${itemsToInsert.length} menu items into menu_items table.`);
    }
    
    console.log('Database migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateDatabase();
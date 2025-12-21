const { createClient } = require('@supabase/supabase-js');

// Your Supabase project URL and anon key
const supabaseUrl = 'https://vxopqjshprqyetpfnksk.supabase.co';
const supabaseAnonKey = 'sb_publishable_-OwDv4WvO9Hw94UmnZ7xnA_qhxXRw1L';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTables() {
  try {
    console.log('Creating menu_categories table...');
    
    // Create menu_categories table
    const { error: categoriesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS menu_categories (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          name text NOT NULL,
          display_order int,
          is_active boolean DEFAULT true,
          created_at timestamp DEFAULT NOW()
        );
        
        ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "public read categories"
        ON menu_categories FOR SELECT
        USING (is_active = true);
        
        CREATE POLICY "admin full access categories"
        ON menu_categories FOR ALL
        USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
      `
    });
    
    if (categoriesError) {
      console.error('Error creating menu_categories table:', categoriesError);
    } else {
      console.log('menu_categories table created successfully!');
    }
    
    console.log('Creating menu_items table...');
    
    // Create menu_items table
    const { error: itemsError } = await supabase.rpc('execute_sql', {
      sql: `
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
        
        ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "public read menu"
        ON menu_items FOR SELECT
        USING (is_available = true);
        
        CREATE POLICY "admin full access menu"
        ON menu_items FOR ALL
        USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
      `
    });
    
    if (itemsError) {
      console.error('Error creating menu_items table:', itemsError);
    } else {
      console.log('menu_items table created successfully!');
    }
    
    console.log('Inserting categories...');
    
    // Insert categories
    const { error: insertError } = await supabase
      .from('menu_categories')
      .insert([
        { name: 'Parathas', display_order: 1, is_active: true },
        { name: 'Snacks', display_order: 2, is_active: true },
        { name: 'Staples', display_order: 3, is_active: true },
        { name: 'Crafted Drinks', display_order: 4, is_active: true },
        { name: 'Desserts', display_order: 5, is_active: true },
        { name: 'Tea & Beverages', display_order: 6, is_active: true }
      ]);
    
    if (insertError) {
      console.error('Error inserting categories:', insertError);
    } else {
      console.log('Categories inserted successfully!');
    }
    
    console.log('All tables created and seeded successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

createTables();
-- =====================================================
-- INSERT MENU DATA FOR BHARAT²⁸
-- =====================================================

-- Get category IDs
WITH category_ids AS (
  SELECT id, name FROM menu_categories
),

-- Insert Parathas
parathas AS (
  INSERT INTO menu_items (category_id, name, price_single, display_order) 
  SELECT id, 'Plain Paratha', 29, 1 FROM category_ids WHERE name = 'Parathas'
  UNION ALL
  SELECT id, 'Aalo Paratha', 49, 2 FROM category_ids WHERE name = 'Parathas'
  UNION ALL
  SELECT id, 'Aalo Pyaj Paratha', 69, 3 FROM category_ids WHERE name = 'Parathas'
  UNION ALL
  SELECT id, 'Pyaj Paratha', 59, 4 FROM category_ids WHERE name = 'Parathas'
  UNION ALL
  SELECT id, 'Gobhi Paratha', 69, 5 FROM category_ids WHERE name = 'Parathas'
  UNION ALL
  SELECT id, 'Paneer Paratha', 89, 6 FROM category_ids WHERE name = 'Parathas'
  UNION ALL
  SELECT id, 'Sattu Paratha', 69, 7 FROM category_ids WHERE name = 'Parathas'
  UNION ALL
  SELECT id, 'Mix Paratha', 79, 8 FROM category_ids WHERE name = 'Parathas'
),

-- Insert Snacks
snacks AS (
  INSERT INTO menu_items (category_id, name, price_single, display_order) 
  SELECT id, 'Spl. Kachori Sabji', 49, 1 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Pyaj Kachori Sabji', 59, 2 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Dal Kachori Sabji', 59, 3 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Poori Sabji', 39, 4 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Spl. Sattu Kachori', 39, 5 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Aalo Samosa', 19, 6 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Paneer Samosa', 39, 7 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Vegi Samosa', 29, 8 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Plain Maggi', 49, 9 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Butter Maggi', 69, 10 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Vegi Loaded Maggi', 59, 11 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Poha', 29, 12 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Chhole Chawal', 29, 13 FROM category_ids WHERE name = 'Snacks'
  UNION ALL
  SELECT id, 'Rajma Chawal', 39, 14 FROM category_ids WHERE name = 'Snacks'
),

-- Update Chhole Chawal and Rajma Chawal with multiple prices
chhole_update AS (
  UPDATE menu_items 
  SET price_single = 29, price_large = 49
  WHERE name = 'Chhole Chawal'
),

rajma_update AS (
  UPDATE menu_items 
  SET price_single = 39, price_large = 59
  WHERE name = 'Rajma Chawal'
),

-- Insert Staples
staples AS (
  INSERT INTO menu_items (category_id, name, description, price_single, display_order) 
  SELECT id, 'Charcoal Roasted Litti with Spiced Vegetable Chokha', 'Artisanal Littis', 49, 1 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Charcoal Roasted Litti in Desi Ghee', 'Artisanal Littis', 59, 2 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Charcoal Roasted Stuffed Multigrain Litti', 'Artisanal Littis', 99, 3 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Charcoal Roasted Veggie Loaded Litti', 'Artisanal Littis', 99, 4 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Charcoal Roasted Paneer Stuffed Litti', 'Artisanal Littis', 119, 5 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Roasted Baati with Rajasthani Dal', 'Heritage Dal Baati', 79, 6 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Roasted Baati with Dal & Churma', 'Heritage Dal Baati', 99, 7 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Dal Baati Artisan Combo', 'Heritage Dal Baati', 149, 8 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Chhole Bhature', 'Palatial Chhole Bhature', 69, 9 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Unlimited Chhole Bhature', 'Palatial Chhole Bhature', 99, 10 FROM category_ids WHERE name = 'Staples'
  UNION ALL
  SELECT id, 'Paneer Chhole Bhature', 'Palatial Chhole Bhature', 129, 11 FROM category_ids WHERE name = 'Staples'
),

-- Update Dal Baati Artisan Combo with multiple prices
dal_baati_update AS (
  UPDATE menu_items 
  SET price_single = 149, price_large = 169
  WHERE name = 'Dal Baati Artisan Combo'
),

-- Insert Crafted Drinks
crafted_drinks AS (
  INSERT INTO menu_items (category_id, name, price_small, price_medium, price_large, display_order) 
  SELECT id, 'High Protein Sattu Shake', 59, 79, 99, 1 FROM category_ids WHERE name = 'Crafted Drinks'
  UNION ALL
  SELECT id, 'Salted Sattu Sharbat', 39, 49, 59, 2 FROM category_ids WHERE name = 'Crafted Drinks'
  UNION ALL
  SELECT id, 'Saunf Sharbat', 39, NULL, NULL, 3 FROM category_ids WHERE name = 'Crafted Drinks'
),

-- Insert Desserts
desserts AS (
  INSERT INTO menu_items (category_id, name, price_single, display_order) 
  SELECT id, 'Gajar Ka Halwa', 79, 1 FROM category_ids WHERE name = 'Desserts'
  UNION ALL
  SELECT id, 'Moong Dal Halwa', 79, 2 FROM category_ids WHERE name = 'Desserts'
  UNION ALL
  SELECT id, 'Kulhad Kheer', 59, 3 FROM category_ids WHERE name = 'Desserts'
  UNION ALL
  SELECT id, 'Gulab Jamun', 25, 4 FROM category_ids WHERE name = 'Desserts'
  UNION ALL
  SELECT id, 'Rasgulla', 25, 5 FROM category_ids WHERE name = 'Desserts'
),

-- Insert Tea & Beverages
tea_beverages AS (
  INSERT INTO menu_items (category_id, name, price_single, display_order) 
  SELECT id, 'Tea', 10, 1 FROM category_ids WHERE name = 'Tea & Beverages'
  UNION ALL
  SELECT id, 'Spl. Kulhad Tea', 20, 2 FROM category_ids WHERE name = 'Tea & Beverages'
  UNION ALL
  SELECT id, 'Tandoori Tea', 20, 3 FROM category_ids WHERE name = 'Tea & Beverages'
  UNION ALL
  SELECT id, 'Spl. Kulhad Tandoori Tea', 30, 4 FROM category_ids WHERE name = 'Tea & Beverages'
)

-- Execute all inserts
SELECT 1;
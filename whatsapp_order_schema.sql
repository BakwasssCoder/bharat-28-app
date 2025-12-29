-- WhatsApp Ordering Schema for BHARAT²⁸
-- Simple schema for WhatsApp-based orders

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Menu categories
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Menu items
create table menu_items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id) on delete restrict,
  name text not null,
  price numeric(10,2) not null,
  description text,
  image_url text,
  is_available boolean default true,
  created_at timestamp with time zone default now()
);

-- Orders from WhatsApp
create table whatsapp_orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  customer_name text,
  customer_phone text not null,
  order_status text default 'PENDING', -- PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED
  total_amount numeric(10,2) not null,
  order_source text default 'WHATSAPP',
  order_items jsonb not null, -- Store order items as JSON
  special_instructions text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index idx_categories_name on categories(name);
create index idx_menu_items_category on menu_items(category_id);
create index idx_menu_items_name on menu_items(name);
create index idx_whatsapp_orders_phone on whatsapp_orders(customer_phone);
create index idx_whatsapp_orders_status on whatsapp_orders(order_status);

-- Insert categories
insert into categories (name, is_active) values 
  ('PARATHAS', true),
  ('STAPLES / MAINS', true),
  ('DAL BAATI', true),
  ('CHOLE BHATURE', true),
  ('RICE & MEALS', true),
  ('SNACKS', true),
  ('QUICK BITES', true),
  ('TEA & HOT DRINKS', true),
  ('CRAFTED DRINKS', true),
  ('DESSERTS', true);

-- Insert menu items
insert into menu_items (category_id, name, price, description, is_available) values 
  -- PARATHAS
  ((select id from categories where name = 'PARATHAS'), 'Plain Paratha', 29.00, 'Basic paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Aloo Paratha', 49.00, 'Aloo stuffed paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Aloo Pyaj Paratha', 69.00, 'Aloo and onion stuffed paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Pyaj Paratha', 59.00, 'Onion stuffed paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Gobhi Paratha', 69.00, 'Cauliflower stuffed paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Paneer Paratha', 89.00, 'Paneer stuffed paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Sattu Paratha', 69.00, 'Sattu stuffed paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Mix Paratha', 79.00, 'Mixed vegetables stuffed paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Multigrain Paratha', 89.00, 'Multigrain flour paratha', true),
  ((select id from categories where name = 'PARATHAS'), 'Veg Kebab Paratha', 89.00, 'Vegetable kebab stuffed paratha', true),

  -- STAPLES / MAINS
  ((select id from categories where name = 'STAPLES / MAINS'), 'Litti Chokha', 49.00, 'Traditional roasted litti with spiced chokha', true),
  ((select id from categories where name = 'STAPLES / MAINS'), 'Litti Chokha (Desi Ghee)', 59.00, 'Traditional roasted litti with spiced chokha and desi ghee', true),
  ((select id from categories where name = 'STAPLES / MAINS'), 'Stuffed Multigrain Litti Chokha', 99.00, 'Multigrain stuffed litti with chokha', true),
  ((select id from categories where name = 'STAPLES / MAINS'), 'Veg Loaded Litti Chokha', 99.00, 'Vegetable loaded litti with chokha', true),
  ((select id from categories where name = 'STAPLES / MAINS'), 'Paneer Stuffed Litti Chokha', 119.00, 'Paneer stuffed litti with chokha', true),

  -- DAL BAATI
  ((select id from categories where name = 'DAL BAATI'), 'Dal Baati', 79.00, 'Dal with baati', true),
  ((select id from categories where name = 'DAL BAATI'), 'Dal Baati Churma', 99.00, 'Dal with baati and sweet churma', true),
  ((select id from categories where name = 'DAL BAATI'), 'Dal Baati Churma Combo', 149.00, 'Dal with baati and churma combo (serves 2)', true),

  -- CHOLE BHATURE
  ((select id from categories where name = 'CHOLE BHATURE'), 'Chole Bhature', 69.00, 'Chole with bhatura', true),
  ((select id from categories where name = 'CHOLE BHATURE'), 'Unlimited Chole Bhature (Per Person)', 99.00, 'Unlimited chole bhature per person', true),
  ((select id from categories where name = 'CHOLE BHATURE'), 'Paneer Chole Bhature', 129.00, 'Paneer with chole and bhatura', true),

  -- RICE & MEALS
  ((select id from categories where name = 'RICE & MEALS'), 'Veg Biryani', 89.00, 'Vegetable biryani (Half)', true),
  ((select id from categories where name = 'RICE & MEALS'), 'Veg Biryani', 149.00, 'Vegetable biryani (Full)', true),
  ((select id from categories where name = 'RICE & MEALS'), 'Chawal Chole', 30.00, 'Rice with chole (Half)', true),
  ((select id from categories where name = 'RICE & MEALS'), 'Chawal Chole', 60.00, 'Rice with chole (Full)', true),

  -- SNACKS
  ((select id from categories where name = 'SNACKS'), 'SPL Kachori Sabji', 49.00, 'Special kachori with sabji', true),
  ((select id from categories where name = 'SNACKS'), 'Pyaj Kachori Sabji', 59.00, 'Onion kachori with sabji', true),
  ((select id from categories where name = 'SNACKS'), 'Dal Kachori Sabji', 59.00, 'Dal kachori with sabji', true),
  ((select id from categories where name = 'SNACKS'), 'Poori Sabji', 39.00, 'Poori with sabji', true),
  ((select id from categories where name = 'SNACKS'), 'SPL Sattu Kachori', 39.00, 'Special sattu kachori', true),
  ((select id from categories where name = 'SNACKS'), 'Aloo Samosa', 19.00, 'Aloo stuffed samosa', true),
  ((select id from categories where name = 'SNACKS'), 'Paneer Samosa', 39.00, 'Paneer stuffed samosa', true),
  ((select id from categories where name = 'SNACKS'), 'Veg Samosa', 29.00, 'Vegetable samosa', true),
  ((select id from categories where name = 'SNACKS'), 'Bread Pakoda', 29.00, 'Bread pakoda', true),
  ((select id from categories where name = 'SNACKS'), 'Paneer Bread Pakoda', 59.00, 'Paneer stuffed bread pakoda', true),
  ((select id from categories where name = 'SNACKS'), 'Bedmi Poori', 69.00, 'Bedmi poori with sabji', true),

  -- QUICK BITES
  ((select id from categories where name = 'QUICK BITES'), 'Plain Maggi', 49.00, 'Plain maggi', true),
  ((select id from categories where name = 'QUICK BITES'), 'Butter Maggi', 69.00, 'Butter maggi', true),
  ((select id from categories where name = 'QUICK BITES'), 'Veg Loaded Maggi', 59.00, 'Vegetable loaded maggi', true),
  ((select id from categories where name = 'QUICK BITES'), 'Poha', 29.00, 'Poha (Half)', true),
  ((select id from categories where name = 'QUICK BITES'), 'Poha', 39.00, 'Poha (Full)', true),

  -- TEA & HOT DRINKS
  ((select id from categories where name = 'TEA & HOT DRINKS'), 'Tea', 10.00, 'Regular tea', true),
  ((select id from categories where name = 'TEA & HOT DRINKS'), 'SPL Kulhad Tea', 20.00, 'Special kulhad tea', true),
  ((select id from categories where name = 'TEA & HOT DRINKS'), 'Tandoori Tea', 20.00, 'Tandoori tea', true),
  ((select id from categories where name = 'TEA & HOT DRINKS'), 'SPL Kulhad Tandoori Tea', 30.00, 'Special kulhad tandoori tea', true),

  -- CRAFTED DRINKS
  ((select id from categories where name = 'CRAFTED DRINKS'), 'High Protein Sattu Shake', 59.00, 'High protein sattu shake (Small)', true),
  ((select id from categories where name = 'CRAFTED DRINKS'), 'High Protein Sattu Shake', 79.00, 'High protein sattu shake (Medium)', true),
  ((select id from categories where name = 'CRAFTED DRINKS'), 'High Protein Sattu Shake', 99.00, 'High protein sattu shake (Large)', true),
  ((select id from categories where name = 'CRAFTED DRINKS'), 'Salted Sattu Sharbat', 39.00, 'Salted sattu sharbat (Small)', true),
  ((select id from categories where name = 'CRAFTED DRINKS'), 'Salted Sattu Sharbat', 49.00, 'Salted sattu sharbat (Medium)', true),
  ((select id from categories where name = 'CRAFTED DRINKS'), 'Salted Sattu Sharbat', 59.00, 'Salted sattu sharbat (Large)', true),
  ((select id from categories where name = 'CRAFTED DRINKS'), 'Saunf Sharbat', 39.00, 'Fennel sharbat', true),

  -- DESSERTS
  ((select id from categories where name = 'DESSERTS'), 'Gajar Ka Halwa', 79.00, 'Carrot halwa', true),
  ((select id from categories where name = 'DESSERTS'), 'Moong Dal Halwa', 79.00, 'Moong dal halwa', true),
  ((select id from categories where name = 'DESSERTS'), 'Kulhad Kheer', 59.00, 'Kulhad kheer', true),
  ((select id from categories where name = 'DESSERTS'), 'Gulab Jamun', 25.00, 'Gulab jamun (1 piece)', true),
  ((select id from categories where name = 'DESSERTS'), 'Rasgulla', 25.00, 'Rasgulla (1 piece)', true);
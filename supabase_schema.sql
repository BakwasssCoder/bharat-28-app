-- Supabase Schema for BHARAT 28 Restaurant System

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Admin users for the admin panel
create table admins (
  id uuid default uuid_generate_v4() primary key,
  username text unique not null,
  password_hash text not null,
  role text default 'admin',
  last_login timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Menu categories (Litti, Paratha, Snacks, etc.)
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Individual menu items
create table menu_items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references categories(id) on delete restrict,
  name text not null,
  description text,
  price numeric(10,2) not null,
  is_available boolean default true,
  image_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Media assets (images, etc.)
create table media_assets (
  id uuid default uuid_generate_v4() primary key,
  file_url text not null,
  uploaded_by uuid references admins(id), -- Admin ID who uploaded
  created_at timestamp with time zone default now()
);

-- Site content (editable content for homepage, banners, etc.)
create table site_content (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Orders (from counter, POS, website, etc.)
create table orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null,
  customer_name text,
  customer_phone text,
  order_source text not null, -- "website_whatsapp", "counter", "pos"
  order_status text default 'PENDING', -- "PENDING", "CONFIRMED", "CANCELLED"
  total_amount numeric(10,2) not null,
  payment_mode text,
  created_at timestamp with time zone default now(),
  confirmed_at timestamp with time zone,
  updated_at timestamp with time zone default now()
);

-- Items within an order
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete restrict,
  quantity integer not null,
  price_at_sale numeric(10,2) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Daily sales snapshots for analytics
create table daily_sales_snapshots (
  id uuid default uuid_generate_v4() primary key,
  date date unique not null,
  total_orders integer not null,
  total_revenue numeric(10,2) not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table admins enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table media_assets enable row level security;
alter table site_content enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table daily_sales_snapshots enable row level security;

-- RLS Policies

-- Admins table - Only service role can read/write (no public access)
create policy "Admins are only accessible by service role" on admins
  for all using (false);

-- Categories table - Public read, admin write
create policy "Categories are viewable by everyone" on categories
  for select using (is_active = true);

create policy "Only admins can insert categories" on categories
  for insert with check (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Only admins can update categories" on categories
  for update using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Only admins can delete categories" on categories
  for delete using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

-- Menu items table - Public read, admin write
create policy "Menu items are viewable by everyone" on menu_items
  for select using (is_available = true);

create policy "Only admins can insert menu items" on menu_items
  for insert with check (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Only admins can update menu items" on menu_items
  for update using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Only admins can delete menu items" on menu_items
  for delete using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

-- Site content table - Public read, admin write
create policy "Site content is viewable by everyone" on site_content
  for select using (true);

create policy "Only admins can insert site content" on site_content
  for insert with check (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Only admins can update site content" on site_content
  for update using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Only admins can delete site content" on site_content
  for delete using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

-- Orders table - Public insert, admin update/read
create policy "Anyone can insert orders" on orders
  for insert with check (true);

create policy "Only admins can view orders" on orders
  for select using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Only admins can update orders" on orders
  for update using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Only admins can delete orders" on orders
  for delete using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

-- Order items table - Linked to orders
create policy "Order items are viewable by admins" on order_items
  for select using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Order items can be inserted by admins" on order_items
  for insert with check (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Order items can be updated by admins" on order_items
  for update using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

create policy "Order items can be deleted by admins" on order_items
  for delete using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

-- Daily sales snapshots - Admin only
create policy "Daily sales snapshots are only accessible by admins" on daily_sales_snapshots
  for all using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

-- Media assets - Admin only
create policy "Media assets are only accessible by admins" on media_assets
  for all using (exists (
    select 1 from admins where admins.id = auth.uid()
  ));

-- Create indexes for better performance
create index idx_admins_username on admins(username);
create index idx_categories_name on categories(name);
create index idx_menu_items_category on menu_items(category_id);
create index idx_menu_items_name on menu_items(name);
create index idx_site_content_key on site_content(key);
create index idx_orders_order_number on orders(order_number);
create index idx_orders_status on orders(order_status);
create index idx_orders_created_at on orders(created_at);
create index idx_order_items_order on order_items(order_id);
create index idx_order_items_menu_item on order_items(menu_item_id);
create index idx_daily_sales_snapshots_date on daily_sales_snapshots(date);

-- Sample Data

-- Insert sample categories
insert into categories (name, is_active) values 
  ('Bihar Specials', true),
  ('Parathas & Rolls', true),
  ('North Indian Classics', true),
  ('Sides & Extras', true),
  ('Desserts & Drinks', true);

-- Insert sample menu items
insert into menu_items (category_id, name, description, price, is_available, is_featured) values 
  -- Bihar Specials
  ((select id from categories where name = 'Bihar Specials'), 'Litti Chokha (Plate)', 'Traditional roasted litti served with spiced chokha and ghee.', 149.00, true, true),
  ((select id from categories where name = 'Bihar Specials'), 'Sattu Paratha (2 pcs)', 'Stuffed parathas with sattu, served with curd and pickle.', 119.00, true, false),
  ((select id from categories where name = 'Bihar Specials'), 'Dal Bati Churma (Veg)', 'Classic dal with bati and sweet churma.', 199.00, true, true),
  
  -- Parathas & Rolls
  ((select id from categories where name = 'Parathas & Rolls'), 'Aloo Paratha', 'Stuffed potato paratha with butter.', 89.00, true, false),
  ((select id from categories where name = 'Parathas & Rolls'), 'Paneer Paratha', 'Cottage cheese stuffed paratha, served with raita.', 119.00, true, true),
  ((select id from categories where name = 'Parathas & Rolls'), 'Mixed Veg Paratha', 'Loaded with seasonal veggies.', 99.00, true, false),
  
  -- North Indian Classics
  ((select id from categories where name = 'North Indian Classics'), 'Butter Chicken (Half)', 'Creamy tomato-based chicken curry.', 229.00, true, true),
  ((select id from categories where name = 'North Indian Classics'), 'Paneer Butter Masala', 'Cottage cheese in rich gravy.', 199.00, true, true),
  ((select id from categories where name = 'North Indian Classics'), 'Rajma Chawal', 'Comfort kidney beans with steamed rice.', 129.00, true, false),
  
  -- Sides & Extras
  ((select id from categories where name = 'Sides & Extras'), 'Raita', 'Cooling cucumber raita.', 39.00, true, false),
  ((select id from categories where name = 'Sides & Extras'), 'Assorted Pickles', 'Homestyle pickles.', 29.00, true, false),
  ((select id from categories where name = 'Sides & Extras'), 'Roasted Papad', 'Crispy roasted papad.', 19.00, true, false),
  
  -- Desserts & Drinks
  ((select id from categories where name = 'Desserts & Drinks'), 'Rabri', 'Rich condensed milk dessert.', 79.00, true, true),
  ((select id from categories where name = 'Desserts & Drinks'), 'Masala Chai', 'Spiced tea.', 29.00, true, false),
  ((select id from categories where name = 'Desserts & Drinks'), 'Sweet Lassi', 'Creamy yogurt drink.', 69.00, true, false);

-- Insert sample site content
insert into site_content (key, value) values
  ('brand_name', 'BHARAT 28'),
  ('tagline', 'Food Designed Around You.'),
  ('phone_number', '+919990173075'),
  ('tax_percent', '0');

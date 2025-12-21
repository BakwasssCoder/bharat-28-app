-- =====================================================
-- NEW DATABASE SCHEMA FOR BHARAT²⁸
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- 1. TABLES
-- =====================================================

-- Table: admins
create table admins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique, -- maps to supabase auth.users.id
  username varchar(100) unique not null,
  password_hash text,
  role varchar(20) default 'admin',
  created_at timestamp default now()
);

-- Table: menu_categories
create table menu_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  display_order int,
  is_active boolean default true,
  created_at timestamp default now()
);

-- Table: menu_items
create table menu_items (
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

-- Table: site_content
create table site_content (
  id uuid primary key default uuid_generate_v4(),
  key varchar(100) unique not null,
  value text not null,
  updated_at timestamp default now()
);

-- Table: orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number varchar(50) unique not null,
  customer_name varchar(100),
  customer_phone varchar(20),
  order_source varchar(30),
  order_status varchar(20) default 'PENDING',
  total_amount integer not null,
  payment_mode varchar(20),
  created_at timestamp default now(),
  confirmed_at timestamp
);

-- Table: order_items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  quantity integer not null,
  price_at_order_time integer not null
);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

alter table admins enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table site_content enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- =====================================================
-- 3. HELPER FUNCTION (CHECK ADMIN)
-- =====================================================

create or replace function is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from admins
    where user_id = auth.uid()
  );
$$;

-- =====================================================
-- 4. PUBLIC READ-ONLY POLICIES
-- =====================================================

create policy "public read categories"
on menu_categories for select
using (is_active = true);

create policy "public read menu"
on menu_items for select
using (is_available = true);

create policy "public read site content"
on site_content for select
using (true);

-- =====================================================
-- 5. ADMIN FULL ACCESS POLICIES
-- =====================================================

create policy "admin full access admins"
on admins for all
using (is_admin());

create policy "admin full access categories"
on menu_categories for all
using (is_admin());

create policy "admin full access menu"
on menu_items for all
using (is_admin());

create policy "admin full access site content"
on site_content for all
using (is_admin());

-- =====================================================
-- 6. ORDERS: PUBLIC INSERT, ADMIN CONFIRM
-- =====================================================

-- Public can CREATE orders (WhatsApp flow)
create policy "public insert orders"
on orders for insert
with check (order_status = 'PENDING');

create policy "public insert order items"
on order_items for insert
with check (true);

-- Admin can READ all orders
create policy "admin read orders"
on orders for select
using (is_admin());

create policy "admin read order items"
on order_items for select
using (is_admin());

-- Admin can UPDATE order status (CONFIRM / CANCEL)
create policy "admin update orders"
on orders for update
using (is_admin());

-- Block public updates & deletes
create policy "block public update orders"
on orders for update
using (false);

create policy "block public delete orders"
on orders for delete
using (false);

-- =====================================================
-- 7. INSERT CATEGORIES
-- =====================================================

insert into menu_categories (name, display_order, is_active) values
('Parathas', 1, true),
('Snacks', 2, true),
('Staples', 3, true),
('Crafted Drinks', 4, true),
('Desserts', 5, true),
('Tea & Beverages', 6, true);
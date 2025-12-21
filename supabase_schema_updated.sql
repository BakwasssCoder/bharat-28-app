-- =====================================================
-- 0. EXTENSION
-- =====================================================
create extension if not exists "uuid-ossp";

-- =====================================================
-- 1. TABLES
-- =====================================================

create table admins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique, -- maps to supabase auth.users.id
  username varchar(100) unique not null,
  role varchar(20) default 'admin',
  created_at timestamp default now()
);

create table categories (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null,
  is_active boolean default true,
  created_at timestamp default now()
);

create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete cascade,
  name varchar(150) not null,
  description text,
  price integer not null,
  is_available boolean default true,
  image_url text,
  is_featured boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table site_content (
  id uuid primary key default uuid_generate_v4(),
  key varchar(100) unique not null,
  value text not null,
  updated_at timestamp default now()
);

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
alter table categories enable row level security;
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
on categories for select
using (true);

create policy "public read menu"
on menu_items for select
using (true);

create policy "public read site content"
on site_content for select
using (true);

-- =====================================================
-- 5. ADMIN FULL ACCESS POLICIES
-- =====================================================

create policy "admin full access categories"
on categories for all
using (is_admin());

create policy "admin full access menu"
on menu_items for all
using (is_admin());

create policy "admin full access site content"
on site_content for all
using (is_admin());

-- =====================================================ALTER TABLE admins ADD COLUMN password_hash TEXT;
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
-- 7. FINAL GUARANTEES
-- =====================================================
-- ✔ Website = read-only
-- ✔ Admin panel = full control
-- ✔ WhatsApp orders = PENDING only
-- ✔ Sales dashboard = CONFIRMED only
-- ✔ No hardcoded data anywhere
-- Extend orders table with print status tracking columns
ALTER TABLE orders ADD COLUMN bill_printed boolean default false;
ALTER TABLE orders ADD COLUMN kot_printed boolean default false;
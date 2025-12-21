# BHARAT 28 - Printing Extension SQL Commands

To extend your database with printing capabilities, run these SQL commands in your Supabase SQL Editor:

```sql
-- Extend orders table with print status columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS bill_printed boolean default false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS kot_printed boolean default false;
```

These commands will:
1. Add a `bill_printed` boolean column to track if a bill has been printed
2. Add a `kot_printed` boolean column to track if a KOT has been printed
3. Set default values to `false` for both columns

After running these commands, your database will be ready to support the printing functionality.
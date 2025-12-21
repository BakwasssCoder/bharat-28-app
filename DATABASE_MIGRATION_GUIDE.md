# Bharat²⁸ Database Migration Guide

This guide explains how to migrate your Bharat²⁸ database to the new structure that supports enhanced menu features.

## Current Issue

The website is currently working with the old database structure, but to fully implement the requested features (multiple pricing tiers, improved categorization, etc.), we need to migrate to the new database schema.

## Solution Options

### Option 1: Manual SQL Execution (Recommended)

1. **Copy the SQL script** from the `supabase_setup.sql` file or run the `node migrate_database.cjs` script to get the SQL output.

2. **Execute the SQL in Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Paste the SQL code
   - Click "Run" to create all tables and set up security

3. **Run the migration script** to transfer data from old tables to new structure:
   ```bash
   node migrate_database.cjs
   ```

### Option 2: Continue with Current Structure

The website is currently working with the existing database structure. If you prefer not to migrate immediately, you can continue using the current setup, but you won't have access to the enhanced features like multiple pricing tiers.

## New Database Structure

The new structure includes:

1. **menu_categories** table:
   - `id` (UUID)
   - `name` (text)
   - `display_order` (int)
   - `is_active` (boolean)
   - `created_at` (timestamp)

2. **menu_items** table:
   - `id` (UUID)
   - `category_id` (foreign key to menu_categories)
   - `name` (text)
   - `description` (text)
   - `price_single` (numeric)
   - `price_small` (numeric)
   - `price_medium` (numeric)
   - `price_large` (numeric)
   - `is_available` (boolean)
   - `display_order` (int)
   - `image_url` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## Benefits of Migration

1. **Multiple Pricing Tiers**: Support for items with different sizes/prices
2. **Better Organization**: Improved category management with display ordering
3. **Enhanced Admin Panel**: More flexible menu management
4. **Future-Proof**: Better structure for upcoming features

## Migration Steps

1. **Backup your current database** (recommended)
2. **Execute the SQL script** in Supabase dashboard
3. **Run the migration script** to transfer existing data
4. **Test the website** to ensure everything works correctly
5. **Update the frontend** to use the new structure (already implemented in the code)

## Troubleshooting

If you encounter any issues:

1. **Check table existence**:
   ```bash
   node test_frontend_connection.cjs
   ```

2. **Verify data migration**:
   ```bash
   node migrate_database.cjs
   ```

3. **Restart the development server**:
   ```bash
   npm run dev
   ```

## Need Help?

If you need assistance with the migration, please:
1. Share any error messages you encounter
2. Provide details about your current database structure
3. Let us know which option you prefer (migrate now or later)

The team is ready to help you complete the migration successfully.
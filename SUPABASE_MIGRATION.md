# BHARAT 28 - Supabase Migration Guide

This document outlines the migration of the BHARAT 28 restaurant management system from SQLite/Prisma to Supabase (PostgreSQL).

## Overview

The BHARAT 28 system has been migrated to use Supabase as the single source of truth for all data, including:
- Menu items and categories
- Orders and order items
- Site content and branding
- Admin authentication
- Sales analytics

## Key Changes

### 1. Database Migration

#### Old Stack
- SQLite database with Prisma ORM
- Local database file (`dev.db`)

#### New Stack
- Supabase PostgreSQL database
- Direct Supabase JavaScript client
- Row Level Security (RLS) for data protection

### 2. Schema Changes

The database schema has been updated to use UUIDs instead of auto-incrementing integers and follows Supabase conventions:

- `admins` table for admin users
- `categories` table for menu categories
- `menu_items` table for menu items
- `orders` table for customer orders
- `order_items` table for items within orders
- `site_content` table for dynamic content
- `media_assets` table for media files
- `daily_sales_snapshots` table for analytics

### 3. Authentication

- Admin authentication now uses JWT tokens with Supabase
- Passwords are still hashed with bcrypt
- Session management remains the same

### 4. API Endpoints

All backend API endpoints remain the same, but now use Supabase instead of Prisma:
- `/api/admin/*` - Admin authentication and profile
- `/api/menu/*` - Menu management (categories and items)
- `/api/orders/*` - Order management
- `/api/sales/*` - Sales dashboard and reporting

### 5. Frontend Integration

The frontend now fetches all data directly from Supabase:
- Homepage content from `site_content` table
- Menu items from `menu_items` and `categories` tables
- Order placement creates records in `orders` and `order_items` tables

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Security

Row Level Security (RLS) policies have been implemented:
- Public read access to menu items and categories
- Admin write access to all tables
- Public order creation with admin-only order management
- Protected admin authentication

## Real-time Features

Supabase real-time subscriptions can be implemented for:
- Live menu updates
- Real-time order notifications
- Instant content changes

## Deployment

1. Create a Supabase project
2. Run the schema SQL script to create tables and RLS policies
3. Configure environment variables
4. Deploy the backend and frontend applications

## Testing

All functionality has been tested:
- Admin login and authentication
- Menu management (CRUD operations)
- Order placement and management
- Sales dashboard analytics
- Public website menu browsing
- Cart and checkout flow

## Future Enhancements

- Implement real-time subscriptions for live updates
- Add media asset management with Supabase Storage
- Enhance analytics with Supabase Functions
- Implement role-based access control (RBAC)
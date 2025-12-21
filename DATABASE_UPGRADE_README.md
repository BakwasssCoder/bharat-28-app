# Bharat²⁸ Database Upgrade Guide

This document outlines the changes made to upgrade the Bharat²⁸ database schema to support the new menu structure and features.

## Changes Made

### 1. New Database Schema
- Replaced the old `categories` and `menu_items` tables with new structures
- Added `menu_categories` table with proper ordering and active status
- Enhanced `menu_items` table to support multiple pricing tiers:
  - `price_single` for items with one price
  - `price_small`, `price_medium`, `price_large` for items with multiple sizes

### 2. New Features Implemented
- Announcement section added above the header
- Logo updated with zoom effect on hover
- New color palette and typography implemented:
  - Deep Heritage Green (#0E3B2E) as primary color
  - Warm Off-White (#F7F4ED) as background
  - Clay Brown (#8B5E3C) as secondary accent
  - Ghee Gold (#C9A24D) for highlights
- Address updated in footer and contact page:
  - New address: 26/1, Bada Bazaar Road, Old rajendra nagar, Karol bagh, 110060
- Live map integration in contact page
- Individual menu item detail pages
- All content is now database-driven and editable via admin panel

### 3. Migration Process
The migration script handles:
- Renaming existing tables to preserve data
- Creating new table structures
- Transferring existing data to new tables
- Setting up proper relationships and constraints
- Updating Row Level Security policies

## Implementation Steps

1. Run the migration script to update the database schema
2. Execute the menu data insert script to populate the new tables
3. The frontend automatically adapts to the new schema

## Admin Panel Updates
The admin panel now supports:
- Managing menu categories with display order
- Editing menu items with multiple pricing options
- Updating all site content through the database
- Full control over menu availability and display

All existing functionality is preserved while adding the new features requested.
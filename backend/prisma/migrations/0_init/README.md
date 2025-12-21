# Initial Migration

This migration creates all the necessary tables for the BHARAT 28 restaurant management system:

## Tables Created

1. **Admin** - Stores admin user credentials and information
2. **Category** - Menu categories (e.g., "Bihar Specials", "Parathas")
3. **MenuItem** - Individual food items with prices and descriptions
4. **MediaAsset** - References to uploaded images and media
5. **SiteContent** - Dynamic content for the website (banners, text, etc.)
6. **Order** - Sales records from counter, POS, and online orders
7. **OrderItem** - Individual items within orders
8. **DailySalesSnapshot** - Aggregated sales data for analytics

## Relationships

- MenuItem belongs to Category (many-to-one)
- OrderItem belongs to Order (many-to-one)
- OrderItem belongs to MenuItem (many-to-one)

## Indexes

- Unique indexes on usernames, category names, site content keys, order numbers, and daily sales dates
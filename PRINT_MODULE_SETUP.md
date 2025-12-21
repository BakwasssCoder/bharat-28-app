# BHARAT 28 - Print Module Setup Instructions

## ✅ Print Module Implementation Status

The print module (BILL and KOT printing functionality) has been fully implemented in the codebase with:

1. Backend API endpoints for generating print-ready content
2. Database schema extensions for tracking print status
3. Admin panel UI with print buttons and preview functionality
4. Security measures to ensure only admins can trigger printing

## 🛠️ Database Extension Required

Before the print functionality will work, you need to extend your Supabase database with two new columns in the `orders` table.

### SQL Commands to Execute

```sql
-- Extend orders table with print status tracking columns
ALTER TABLE orders ADD COLUMN bill_printed boolean default false;
ALTER TABLE orders ADD COLUMN kot_printed boolean default false;
```

### How to Apply the Database Extension

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Navigate to the SQL Editor
4. Copy and paste the SQL commands above
5. Click "Run" to execute the commands

## 🎯 Print Functionality Features

### Admin Panel Integration
- Print buttons available in "Confirmed Orders" section
- Separate "Print KOT" and "Print Bill" buttons for each order
- Print preview modal to review content before sending to printer
- Print status tracking in the database

### Print Content Formats

#### KOT (Kitchen Order Ticket)
- Order Number
- Date & Time
- Table / Order Source
- Item Name
- Quantity
- (NO prices)
- Monospaced, thermal-printer friendly format

#### Bill
- Restaurant Name (BHARAT 28)
- Order Number
- Date & Time
- Item list with Quantity × Price
- Subtotal
- Total Amount
- Payment Mode
- "Thank You" message

## 🔧 Hardware Integration

The system is designed to work with any POS or thermal printer through a hardware-agnostic approach:

1. Backend exposes print APIs that generate structured print data
2. Actual hardware handling is done by external POS/local service
3. Backend only sends formatted print content

### Example API Endpoints
- POST /api/print/kot/:orderId
- POST /api/print/bill/:orderId

## 🔒 Security

- Only authenticated admins can trigger print actions
- All print APIs are protected by admin authentication
- No public access to print functionality
- Print status is securely saved in Supabase

## 📋 Usage Workflow

1. Order is created → PENDING status
2. Admin confirms order → CONFIRMED status
3. Admin clicks "Print KOT" or "Print Bill"
4. System generates print-ready content
5. Content is displayed in preview modal
6. Admin sends to printer (in production)
7. Print status is updated in database

## ✅ Validation

After applying the database extension, you can verify the setup by:

1. Logging into the admin panel
2. Going to "Incoming Orders" tab
3. Confirming a pending order
4. Checking that "Print KOT" and "Print Bill" buttons appear
5. Clicking the buttons to see the print preview
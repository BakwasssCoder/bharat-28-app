# BHARAT 28 - Printing Module Documentation

## Overview

This document describes the implementation of the BILL PRINTING and KOT (Kitchen Order Ticket) printer functionality for the BHARAT 28 restaurant management system. This is an ADD-ON MODULE that extends the existing admin panel and billing system.

## Database Extension

The following optional fields were added to the `orders` table:

```sql
ALTER TABLE orders ADD COLUMN bill_printed boolean default false;
ALTER TABLE orders ADD COLUMN kot_printed boolean default false;
```

These fields track the print status of bills and KOTs for each order.

## API Endpoints

### Print KOT
- **Endpoint**: `POST /api/print/kot/:orderId`
- **Description**: Generates and sends a Kitchen Order Ticket for the specified order
- **Authentication**: Admin only
- **Response**: Print payload and content for preview

### Print Bill
- **Endpoint**: `POST /api/print/bill/:orderId`
- **Description**: Generates and sends a Bill for the specified order
- **Authentication**: Admin only
- **Response**: Print payload and content for preview

### Get Print Status
- **Endpoint**: `GET /api/print/status/:orderId`
- **Description**: Retrieves the print status for the specified order
- **Authentication**: Admin only
- **Response**: Current print status (bill_printed, kot_printed)

## Print Content Formats

### KOT (Kitchen Order Ticket)

```
================================
          KITCHEN ORDER         
================================
Order #: ORD-XXXXXX
Date: DD/MM/YYYY
Time: HH:MM
Source: Counter/Table
--------------------------------
2 x Paneer Tikka
1 x Butter Naan
--------------------------------
        ORDER SENT TO KITCHEN   
================================
```

Features:
- Monospaced font friendly
- Thermal-printer optimized
- Minimal width (58mm / 80mm compatible)
- No prices (kitchen-focused)

### Bill

```
================================
           BHARAT 28            
      FOOD DESIGNED AROUND YOU  
================================
Order #: ORD-XXXXXX
Date: DD/MM/YYYY
Time: HH:MM
--------------------------------
2 x Paneer Tikka
    ₹250 × 2 = ₹500
1 x Butter Naan
    ₹40 × 1 = ₹40
--------------------------------
Subtotal: ₹540
Total: ₹540
Payment: Cash
--------------------------------
          THANK YOU!            
      Visit us again soon       
================================
```

Features:
- Full restaurant branding
- Detailed itemization with prices
- Payment information
- Professional appearance

## Admin Panel Integration

### Confirmed Orders Section

For each CONFIRMED order, the following buttons are available:
- **Print KOT**: Generates kitchen order ticket
- **Print Bill**: Generates customer bill
- **Reverse**: Changes order back to PENDING
- **Delete**: Permanently removes order

### Print Preview

When a print button is clicked:
1. Print content is generated
2. Preview modal displays formatted content
3. Admin can review before sending to printer
4. Database flags are updated (bill_printed/kot_printed)

## Security

- Only authenticated admin users can trigger print actions
- All print APIs are protected by admin authentication
- No public access to print endpoints
- Print status is securely stored in Supabase

## Hardware Agnostic Design

The system is designed to work with:
- eZee POS systems
- Generic POS systems
- Local thermal printers
- KOT printers

Implementation approach:
- Backend exposes structured print APIs
- Actual hardware integration handled by POS/local service
- Backend only sends formatted print data

## Future Enhancements

1. **Duplicate Print Prevention**: Track reprint attempts
2. **Printer Queue Management**: Handle multiple print jobs
3. **Hardware Integration Layer**: Direct printer connectivity
4. **GST Support**: Tax calculation in bills
5. **Customizable Templates**: Restaurant-branded formats

## Testing

To test the printing functionality:

1. Create a CONFIRMED order in the database
2. Log into the admin panel
3. Navigate to "Incoming Orders" → "Confirmed Orders"
4. Find the test order
5. Click "Print KOT" or "Print Bill"
6. Review the preview modal
7. Verify database flags are updated

## Integration with External Systems

For production deployment with actual printers:

1. Implement a print service that listens to `/api/print/*` endpoints
2. Format payloads for specific printer models
3. Handle printer status and error reporting
4. Update the frontend to send directly to printers instead of preview modal

The current implementation provides a solid foundation that can be extended with minimal changes to accommodate specific hardware requirements.
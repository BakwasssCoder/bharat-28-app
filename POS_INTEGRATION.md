# POS System Integration Guide

This document explains how to integrate external POS systems with the BHARAT 28 restaurant management system.

## Overview

The BHARAT 28 system provides a dedicated API endpoint for POS systems to send order data directly to the central database. This enables seamless integration with existing POS hardware and software.

## Integration Endpoint

```
POST /api/orders/pos
```

This endpoint is publicly accessible (no authentication required) to facilitate easy integration with POS systems.

## Request Format

Send a POST request with the following JSON structure:

```json
{
  "items": [
    {
      "menuItemId": "uuid-string",
      "quantity": 2,
      "priceAtSale": 149.00
    }
  ],
  "totalAmount": 298.00,
  "paymentMode": "UPI"
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| items | Array | Yes | List of items in the order |
| items[].menuItemId | String (UUID) | Yes | ID of the menu item |
| items[].quantity | Integer | Yes | Quantity of the item |
| items[].priceAtSale | Number | Yes | Price of the item at time of sale |
| totalAmount | Number | Yes | Total order amount |
| paymentMode | String | Yes | Payment method: "Cash", "UPI", or "Card" |

## Response Format

```json
{
  "success": true,
  "message": "POS order created successfully",
  "order": {
    "id": "uuid-string",
    "orderNumber": "ORD-123456-789",
    "totalAmount": 298.00,
    "paymentMode": "UPI",
    "orderSource": "POS",
    "createdAt": "2023-01-01T10:30:00.000Z",
    "orderItems": [
      {
        "id": "uuid-string",
        "orderId": "uuid-string",
        "menuItemId": "uuid-string",
        "quantity": 2,
        "priceAtSale": 149.00,
        "createdAt": "2023-01-01T10:30:00.000Z",
        "updatedAt": "2023-01-01T10:30:00.000Z",
        "menuItem": {
          "id": "uuid-string",
          "name": "Litti Chokha",
          "price": 149.00
        }
      }
    ]
  }
}
```

## Implementation Steps

### 1. Obtain Menu Item IDs

Before sending orders, POS systems need to know the UUIDs of menu items. These can be obtained in two ways:

#### Option A: From Admin Panel
1. Log into the admin panel
2. Navigate to menu management
3. Copy the UUIDs for each menu item

#### Option B: Via API (Future Enhancement)
A future enhancement could provide an API endpoint to retrieve all menu items with their IDs.

### 2. Configure POS System

Configure your POS system to send HTTP POST requests to:
```
http://your-backend-url/api/orders/pos
```

Set the following headers:
```
Content-Type: application/json
```

### 3. Send Order Data

When an order is completed on the POS system, send the data in the required format.

Example using curl:
```bash
curl -X POST \
  http://your-backend-url/api/orders/pos \
  -H 'Content-Type: application/json' \
  -d '{
  "items": [
    {
      "menuItemId": "abcd1234-abcd-1234-abcd-1234abcd1234",
      "quantity": 2,
      "priceAtSale": 149.00
    }
  ],
  "totalAmount": 298.00,
  "paymentMode": "UPI"
}'
```

## Error Handling

The API will return appropriate HTTP status codes:

- `201 Created` - Order successfully created
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Menu item not found
- `500 Internal Server Error` - Server error

Always check the response body for detailed error messages:

```json
{
  "success": false,
  "message": "Error description here"
}
```

## Best Practices

### 1. Data Validation
- Validate all data before sending to the API
- Ensure menu item IDs exist and are valid UUIDs
- Verify quantities are positive integers
- Confirm prices are non-negative numbers

### 2. Network Resilience
- Implement retry logic for failed requests
- Queue orders locally if the server is unreachable
- Handle timeouts gracefully

### 3. Security
- Use HTTPS in production environments
- Protect the POS system from unauthorized access
- Regularly update POS software

### 4. Testing
- Test with sample data before going live
- Verify all payment modes work correctly
- Check edge cases (zero quantities, etc.)

## Sample Implementation

Here's a sample Python script that demonstrates how a POS system might integrate:

```python
import requests
import json
from datetime import datetime

class Bharat28POSIntegration:
    def __init__(self, base_url):
        self.base_url = base_url
        self.endpoint = f"{base_url}/api/orders/pos"
    
    def send_order(self, items, total_amount, payment_mode):
        """
        Send order data to BHARAT 28 system
        
        Args:
            items: List of dictionaries with menuItemId, quantity, priceAtSale
            total_amount: Total order amount
            payment_mode: "Cash", "UPI", or "Card"
        
        Returns:
            dict: API response
        """
        payload = {
            "items": items,
            "totalAmount": total_amount,
            "paymentMode": payment_mode
        }
        
        try:
            response = requests.post(
                self.endpoint,
                headers={'Content-Type': 'application/json'},
                data=json.dumps(payload),
                timeout=30
            )
            
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "message": f"Network error: {str(e)}"
            }
    
    def process_pos_order(self, pos_order_data):
        """
        Process a complete POS order
        
        Args:
            pos_order_data: Raw data from POS system
        
        Returns:
            bool: True if successful
        """
        # Transform POS data to our format
        items = []
        total = 0
        
        for item in pos_order_data['items']:
            # Validate item exists in our system
            # (Implementation depends on how you store POS item mappings)
            
            order_item = {
                "menuItemId": item['menu_item_id'],
                "quantity": item['quantity'],
                "priceAtSale": item['price']
            }
            
            items.append(order_item)
            total += item['price'] * item['quantity']
        
        # Send to BHARAT 28 system
        result = self.send_order(
            items=items,
            total_amount=total,
            payment_mode=pos_order_data['payment_mode']
        )
        
        return result['success']

# Usage example
if __name__ == "__main__":
    pos_integration = Bharat28POSIntegration("http://localhost:5000")
    
    sample_order = {
        "items": [
            {
                "menu_item_id": "abcd1234-abcd-1234-abcd-1234abcd1234",
                "quantity": 2,
                "price": 149.00
            }
        ],
        "payment_mode": "UPI"
    }
    
    success = pos_integration.process_pos_order(sample_order)
    print(f"Order sent successfully: {success}")
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if the backend server is running
   - Verify the URL is correct
   - Ensure firewall settings allow connections

2. **404 Errors**
   - Verify menu item IDs are correct
   - Check if the backend database is properly initialized

3. **400 Bad Request**
   - Validate JSON format
   - Check all required fields are present
   - Ensure data types are correct

4. **500 Internal Server Error**
   - Check backend logs for detailed error information
   - Verify database connectivity
   - Ensure all required environment variables are set

## Support

For integration support, contact the development team with:
- Details of your POS system
- Sample data formats
- Error messages received
- Steps to reproduce any issues
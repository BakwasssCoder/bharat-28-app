# 🍽️ BHARAT²⁸ WhatsApp Ordering System

## Overview
Simple WhatsApp-based ordering system for BHARAT²⁸ restaurant. Customers can place orders via WhatsApp at +919999173075.

## 📱 How It Works

### For Customers:
1. Message +919999173075 with your order details
2. Include item names and quantities
3. Add your name and any special instructions
4. Wait for order confirmation
5. Pick up your order or wait for delivery

### For Restaurant Staff:
1. Monitor WhatsApp Business app for new orders
2. Use the helper script to process orders
3. Update order status as it progresses
4. Notify customers when order is ready

## 📋 Order Process Flow

1. **Order Received** → PENDING status
2. **Order Confirmed** → CONFIRMED status
3. **Food Preparing** → PREPARING status  
4. **Order Ready** → READY status
5. **Order Delivered/Picked Up** → DELIVERED status

## 💰 Pricing

All prices in Indian Rupees (₹)

### 🫓 PARATHAS
- Plain Paratha – ₹29
- Aloo Paratha – ₹49
- Aloo Pyaj Paratha – ₹69
- Pyaj Paratha – ₹59
- Gobhi Paratha – ₹69
- Paneer Paratha – ₹89
- Sattu Paratha – ₹69
- Mix Paratha – ₹79
- Multigrain Paratha – ₹89
- Veg Kebab Paratha – ₹89

### 🍛 STAPLES / MAINS
- Litti Chokha – ₹49
- Litti Chokha (Desi Ghee) – ₹59
- Stuffed Multigrain Litti Chokha – ₹99
- Veg Loaded Litti Chokha – ₹99
- Paneer Stuffed Litti Chokha – ₹119

### 🍲 DAL BAATI
- Dal Baati – ₹79
- Dal Baati Churma – ₹99
- Dal Baati Churma Combo – ₹149 / ₹169

### 🫔 CHOLE BHATURE
- Chole Bhature – ₹69
- Unlimited Chole Bhature (Per Person) – ₹99
- Paneer Chole Bhature – ₹129

### 🍚 RICE & MEALS
- Veg Biryani – ₹89 / ₹149
- Chawal Chole – ₹30 / ₹60

### 🍟 SNACKS
- SPL Kachori Sabji – ₹49
- Pyaj Kachori Sabji – ₹59
- Dal Kachori Sabji – ₹59
- Poori Sabji – ₹39
- SPL Sattu Kachori – ₹39
- Aloo Samosa – ₹19
- Paneer Samosa – ₹39
- Veg Samosa – ₹29
- Bread Pakoda – ₹29
- Paneer Bread Pakoda – ₹59
- Bedmi Poori – ₹69

### 🍜 QUICK BITES
- Plain Maggi – ₹49
- Butter Maggi – ₹69
- Veg Loaded Maggi – ₹59
- Poha – ₹29 / ₹39

### ☕ TEA & HOT DRINKS
- Tea – ₹10
- SPL Kulhad Tea – ₹20
- Tandoori Tea – ₹20
- SPL Kulhad Tandoori Tea – ₹30

### 🥤 CRAFTED DRINKS
- High Protein Sattu Shake – ₹59 / ₹79 / ₹99
- Salted Sattu Sharbat – ₹39 / ₹49 / ₹59
- Saunf Sharbat – ₹39

### 🍨 DESSERTS
- Gajar Ka Halwa – ₹79
- Moong Dal Halwa – ₹79
- Kulhad Kheer – ₹59
- Gulab Jamun – ₹25
- Rasgulla – ₹25

## 📞 Contact
- **WhatsApp**: +919999173075
- **Business**: BHARAT²⁸ – TASTE OF TRADITION

## 🛠️ Technical Implementation

### Files Included:
1. `whatsapp_order_schema.sql` - Database schema for orders
2. `whatsapp_order_helper.js` - Helper script for processing orders
3. `WHATSAPP_ORDERING_WORKFLOW.md` - Detailed workflow documentation

### Database Tables:
- `categories` - Menu categories
- `menu_items` - Individual menu items with prices and image URLs
- `whatsapp_orders` - Orders placed via WhatsApp

### Features:
- Simple menu categorization
- Price tracking
- Order status management
- Customer information storage
- Special instructions handling

## 📸 Image URLs

For each menu item, you can add image URLs in the `image_url` field of the `menu_items` table. This allows you to display images of each dish in your admin panel and potentially show them to customers in the future.

## 🔄 Admin Panel Integration

The system is designed to work with your existing admin panel, allowing you to:
- Edit menu items and prices
- Add or remove items
- Update availability
- Add image URLs for each item
- View and manage orders
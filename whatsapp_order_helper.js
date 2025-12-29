// WhatsApp Order Helper for BHARAT²⁸
// Simple script to help process WhatsApp orders

class WhatsAppOrderHelper {
  constructor() {
    this.orderStatuses = [
      'PENDING',
      'CONFIRMED', 
      'PREPARING',
      'READY',
      'DELIVERED',
      'CANCELLED'
    ];
    
    this.menuCategories = [
      'PARATHAS',
      'STAPLES / MAINS',
      'DAL BAATI', 
      'CHOLE BHATURE',
      'RICE & MEALS',
      'SNACKS',
      'QUICK BITES',
      'TEA & HOT DRINKS',
      'CRAFTED DRINKS',
      'DESSERTS'
    ];
    
    this.prices = {
      // PARATHAS
      'Plain Paratha': 29,
      'Aloo Paratha': 49,
      'Aloo Pyaj Paratha': 69,
      'Pyaj Paratha': 59,
      'Gobhi Paratha': 69,
      'Paneer Paratha': 89,
      'Sattu Paratha': 69,
      'Mix Paratha': 79,
      'Multigrain Paratha': 89,
      'Veg Kebab Paratha': 89,
      
      // STAPLES / MAINS
      'Litti Chokha': 49,
      'Litti Chokha (Desi Ghee)': 59,
      'Stuffed Multigrain Litti Chokha': 99,
      'Veg Loaded Litti Chokha': 99,
      'Paneer Stuffed Litti Chokha': 119,
      
      // DAL BAATI
      'Dal Baati': 79,
      'Dal Baati Churma': 99,
      'Dal Baati Churma Combo': 149,
      
      // CHOLE BHATURE
      'Chole Bhature': 69,
      'Unlimited Chole Bhature (Per Person)': 99,
      'Paneer Chole Bhature': 129,
      
      // RICE & MEALS
      'Veg Biryani': [89, 149], // Half, Full
      'Chawal Chole': [30, 60], // Half, Full
      
      // SNACKS
      'SPL Kachori Sabji': 49,
      'Pyaj Kachori Sabji': 59,
      'Dal Kachori Sabji': 59,
      'Poori Sabji': 39,
      'SPL Sattu Kachori': 39,
      'Aloo Samosa': 19,
      'Paneer Samosa': 39,
      'Veg Samosa': 29,
      'Bread Pakoda': 29,
      'Paneer Bread Pakoda': 59,
      'Bedmi Poori': 69,
      
      // QUICK BITES
      'Plain Maggi': 49,
      'Butter Maggi': 69,
      'Veg Loaded Maggi': 59,
      'Poha': [29, 39], // Half, Full
      
      // TEA & HOT DRINKS
      'Tea': 10,
      'SPL Kulhad Tea': 20,
      'Tandoori Tea': 20,
      'SPL Kulhad Tandoori Tea': 30,
      
      // CRAFTED DRINKS
      'High Protein Sattu Shake': [59, 79, 99], // Small, Medium, Large
      'Salted Sattu Sharbat': [39, 49, 59], // Small, Medium, Large
      'Saunf Sharbat': 39,
      
      // DESSERTS
      'Gajar Ka Halwa': 79,
      'Moong Dal Halwa': 79,
      'Kulhad Kheer': 59,
      'Gulab Jamun': 25,
      'Rasgulla': 25
    };
  }

  // Process an incoming WhatsApp order
  processOrder(message) {
    console.log('Processing new WhatsApp order...');
    
    // Extract order items from message
    const orderItems = this.extractOrderItems(message);
    const customerName = this.extractCustomerName(message);
    const specialInstructions = this.extractSpecialInstructions(message);
    
    // Calculate total
    const total = this.calculateTotal(orderItems);
    
    // Create order object
    const order = {
      orderNumber: this.generateOrderNumber(),
      customerName: customerName || 'Guest',
      customerPhone: this.extractPhoneNumber(message) || 'Unknown',
      orderItems: orderItems,
      totalAmount: total,
      specialInstructions: specialInstructions || '',
      orderStatus: 'PENDING',
      orderSource: 'WHATSAPP',
      createdAt: new Date()
    };
    
    console.log('Order processed:', order);
    return order;
  }

  // Extract order items from message text
  extractOrderItems(message) {
    const items = [];
    const lines = message.split('\n');
    
    for (const line of lines) {
      // Look for patterns like "2 x Item Name" or "Item Name - Quantity"
      const itemMatch = line.match(/(\d+)\s*[xX]?\s*(.+)/i);
      if (itemMatch) {
        const quantity = parseInt(itemMatch[1]);
        let itemName = itemMatch[2].trim();
        
        // Clean up the item name (remove price mentions)
        itemName = itemName.replace(/\(₹\d+(\s*\/\s*₹\d+)*\)/g, '').trim();
        itemName = itemName.replace(/\d+\s*pcs?/i, '').trim();
        itemName = itemName.replace(/half|full/i, '').trim();
        
        // Find matching item in our menu
        const menuItem = this.findMenuItem(itemName);
        if (menuItem) {
          items.push({
            name: menuItem.name,
            quantity: quantity,
            price: Array.isArray(menuItem.price) ? menuItem.price[0] : menuItem.price,
            total: Array.isArray(menuItem.price) ? menuItem.price[0] * quantity : menuItem.price * quantity
          });
        }
      }
    }
    
    return items;
  }

  // Find a menu item by name
  findMenuItem(searchName) {
    searchName = searchName.toLowerCase();
    
    for (const [name, price] of Object.entries(this.prices)) {
      if (name.toLowerCase().includes(searchName) || searchName.includes(name.toLowerCase())) {
        return { name, price };
      }
    }
    
    return null;
  }

  // Extract customer name from message
  extractCustomerName(message) {
    const nameMatch = message.match(/(?:name|customer):\s*(.+)/i);
    if (nameMatch) {
      return nameMatch[1].trim();
    }
    return null;
  }

  // Extract special instructions
  extractSpecialInstructions(message) {
    const instructionMatch = message.match(/(?:instructions?|notes?|special):\s*(.+)/i);
    if (instructionMatch) {
      return instructionMatch[1].trim();
    }
    return null;
  }

  // Extract phone number (not applicable for incoming messages, but useful for logging)
  extractPhoneNumber(message) {
    // This would be the sender's number in a real WhatsApp integration
    return null;
  }

  // Calculate total amount
  calculateTotal(orderItems) {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  }

  // Generate order number
  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `W${timestamp}-${random}`;
  }

  // Update order status
  updateOrderStatus(order, newStatus) {
    if (!this.orderStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }
    
    order.orderStatus = newStatus;
    order.updatedAt = new Date();
    
    console.log(`Order ${order.orderNumber} status updated to ${newStatus}`);
    return order;
  }

  // Generate order confirmation message
  generateConfirmationMessage(order) {
    let message = `🍽️ BHARAT²⁸ ORDER CONFIRMED 🍽️\n\n`;
    message += `Order #${order.orderNumber}\n`;
    message += `Customer: ${order.customerName}\n`;
    message += `Status: ${order.orderStatus}\n\n`;
    
    message += 'ORDER DETAILS:\n';
    for (const item of order.orderItems) {
      message += `- ${item.quantity} x ${item.name} (₹${item.price} each) = ₹${item.total}\n`;
    }
    
    message += `\nTOTAL: ₹${order.totalAmount}\n`;
    
    if (order.specialInstructions) {
      message += `\nSPECIAL INSTRUCTIONS: ${order.specialInstructions}\n`;
    }
    
    message += '\nThank you for your order! We will notify you when your order is ready.';
    
    return message;
  }

  // Generate menu for customers
  generateMenuMessage() {
    let message = `🍽️ BHARAT²⁸ – TASTE OF TRADITION\n`;
    message += 'COMPLETE MENU (CATEGORY WISE)\n\n';
    
    // Group items by category
    const menuByCategory = this.groupMenuByCategory();
    
    for (const [category, items] of Object.entries(menuByCategory)) {
      message += `🫓 ${category}\n`;
      
      for (const item of items) {
        if (Array.isArray(item.price)) {
          message += `${item.name} – ₹${item.price.join(' / ₹')}\n`;
        } else {
          message += `${item.name} – ₹${item.price}\n`;
        }
      }
      
      message += '\n';
    }
    
    message += '📌 To place an order, simply message your order details!';
    return message;
  }

  // Group menu items by category (simplified)
  groupMenuByCategory() {
    const menu = {};
    
    // For simplicity, we'll categorize items manually
    // PARATHAS
    menu['PARATHAS'] = [
      { name: 'Plain Paratha', price: 29 },
      { name: 'Aloo Paratha', price: 49 },
      { name: 'Aloo Pyaj Paratha', price: 69 },
      { name: 'Pyaj Paratha', price: 59 },
      { name: 'Gobhi Paratha', price: 69 },
      { name: 'Paneer Paratha', price: 89 },
      { name: 'Sattu Paratha', price: 69 },
      { name: 'Mix Paratha', price: 79 },
      { name: 'Multigrain Paratha', price: 89 },
      { name: 'Veg Kebab Paratha', price: 89 }
    ];
    
    // STAPLES / MAINS
    menu['STAPLES / MAINS'] = [
      { name: 'Litti Chokha', price: 49 },
      { name: 'Litti Chokha (Desi Ghee)', price: 59 },
      { name: 'Stuffed Multigrain Litti Chokha', price: 99 },
      { name: 'Veg Loaded Litti Chokha', price: 99 },
      { name: 'Paneer Stuffed Litti Chokha', price: 119 }
    ];
    
    // DAL BAATI
    menu['DAL BAATI'] = [
      { name: 'Dal Baati', price: 79 },
      { name: 'Dal Baati Churma', price: 99 },
      { name: 'Dal Baati Churma Combo', price: 149 }
    ];
    
    // CHOLE BHATURE
    menu['CHOLE BHATURE'] = [
      { name: 'Chole Bhature', price: 69 },
      { name: 'Unlimited Chole Bhature (Per Person)', price: 99 },
      { name: 'Paneer Chole Bhature', price: 129 }
    ];
    
    // RICE & MEALS
    menu['RICE & MEALS'] = [
      { name: 'Veg Biryani', price: [89, 149] },
      { name: 'Chawal Chole', price: [30, 60] }
    ];
    
    // SNACKS
    menu['SNACKS'] = [
      { name: 'SPL Kachori Sabji', price: 49 },
      { name: 'Pyaj Kachori Sabji', price: 59 },
      { name: 'Dal Kachori Sabji', price: 59 },
      { name: 'Poori Sabji', price: 39 },
      { name: 'SPL Sattu Kachori', price: 39 },
      { name: 'Aloo Samosa', price: 19 },
      { name: 'Paneer Samosa', price: 39 },
      { name: 'Veg Samosa', price: 29 },
      { name: 'Bread Pakoda', price: 29 },
      { name: 'Paneer Bread Pakoda', price: 59 },
      { name: 'Bedmi Poori', price: 69 }
    ];
    
    // QUICK BITES
    menu['QUICK BITES'] = [
      { name: 'Plain Maggi', price: 49 },
      { name: 'Butter Maggi', price: 69 },
      { name: 'Veg Loaded Maggi', price: 59 },
      { name: 'Poha', price: [29, 39] }
    ];
    
    // TEA & HOT DRINKS
    menu['TEA & HOT DRINKS'] = [
      { name: 'Tea', price: 10 },
      { name: 'SPL Kulhad Tea', price: 20 },
      { name: 'Tandoori Tea', price: 20 },
      { name: 'SPL Kulhad Tandoori Tea', price: 30 }
    ];
    
    // CRAFTED DRINKS
    menu['CRAFTED DRINKS'] = [
      { name: 'High Protein Sattu Shake', price: [59, 79, 99] },
      { name: 'Salted Sattu Sharbat', price: [39, 49, 59] },
      { name: 'Saunf Sharbat', price: 39 }
    ];
    
    // DESSERTS
    menu['DESSERTS'] = [
      { name: 'Gajar Ka Halwa', price: 79 },
      { name: 'Moong Dal Halwa', price: 79 },
      { name: 'Kulhad Kheer', price: 59 },
      { name: 'Gulab Jamun', price: 25 },
      { name: 'Rasgulla', price: 25 }
    ];
    
    return menu;
  }
}

// Example usage
const orderHelper = new WhatsAppOrderHelper();

// Example order message
const exampleOrder = `Hi, I'd like to order:
- 2 x Aloo Paratha
- 1 x Litti Chokha 
- 2 x Tea

Customer Name: John Doe
Special Instructions: No onions in paratha`;

// Process the order
const processedOrder = orderHelper.processOrder(exampleOrder);
console.log('\nProcessed Order:', processedOrder);

// Generate confirmation message
const confirmation = orderHelper.generateConfirmationMessage(processedOrder);
console.log('\nConfirmation Message:\n', confirmation);

// Generate menu
const menu = orderHelper.generateMenuMessage();
console.log('\nMenu Message:\n', menu);

module.exports = WhatsAppOrderHelper;
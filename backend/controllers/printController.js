const { supabase } = require('../utils/supabaseClient');

// Generate KOT (Kitchen Order Ticket) content
const generateKOTContent = (order, orderItems, siteContent) => {
  const restaurantName = siteContent.find(item => item.key === 'brand_name')?.value || 'BHARAT²⁸';
  
  let kotContent = '';
  kotContent += '================================\n';
  kotContent += `${restaurantName}\n`;
  kotContent += '================================\n';
  kotContent += `ORDER #: ${order.order_number}\n`;
  kotContent += `DATE: ${new Date(order.created_at).toLocaleDateString()}\n`;
  kotContent += `TIME: ${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n`;
  kotContent += `SOURCE: ${order.order_source || 'N/A'}\n`;
  kotContent += '================================\n';
  
  // Add items (without prices)
  orderItems.forEach(item => {
    kotContent += `${item.quantity} x ${item.menu_items?.name || 'Unknown Item'}\n`;
  });
  
  kotContent += '================================\n';
  kotContent += 'PREPARE WITH CARE\n';
  kotContent += 'THANK YOU!\n';
  
  return kotContent;
};

// Generate Bill content
const generateBillContent = (order, orderItems, siteContent) => {
  const restaurantName = siteContent.find(item => item.key === 'brand_name')?.value || 'BHARAT²⁸';
  const tagline = siteContent.find(item => item.key === 'tagline')?.value || '';
  
  let billContent = '';
  billContent += '================================\n';
  billContent += `${restaurantName}\n`;
  if (tagline) {
    billContent += `${tagline}\n`;
  }
  billContent += '================================\n';
  billContent += `ORDER #: ${order.order_number}\n`;
  billContent += `DATE: ${new Date(order.created_at).toLocaleDateString()}\n`;
  billContent += `TIME: ${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n`;
  billContent += '================================\n';
  
  // Add items with prices
  let subtotal = 0;
  orderItems.forEach(item => {
    const itemName = item.menu_items?.name || 'Unknown Item';
    const itemTotal = item.quantity * item.price_at_order_time;
    subtotal += itemTotal;
    billContent += `${item.quantity} x ${itemName}\n`;
    billContent += `    ₹${item.price_at_order_time} = ₹${itemTotal}\n`;
  });
  
  billContent += '================================\n';
  billContent += `SUBTOTAL: ₹${subtotal}\n`;
  billContent += `TOTAL: ₹${order.total_amount}\n`;
  billContent += `PAYMENT: ${order.payment_mode || 'N/A'}\n`;
  billContent += '================================\n';
  billContent += 'THANK YOU FOR DINING WITH US!\n';
  billContent += 'VISIT AGAIN\n';
  
  return billContent;
};

// Print KOT
const printKOT = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (orderError) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order is confirmed
    if (order.order_status !== 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed orders can be printed'
      });
    }
    
    // Get order items with menu item details
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        menu_items (name)
      `)
      .eq('order_id', orderId);
      
    if (itemsError) {
      throw itemsError;
    }
    
    // Get site content for restaurant details
    const { data: siteContent, error: siteError } = await supabase
      .from('site_content')
      .select('*');
      
    if (siteError) {
      throw siteError;
    }
    
    // Generate KOT content
    const kotContent = generateKOTContent(order, orderItems, siteContent);
    
    // Update KOT printed status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ kot_printed: true })
      .eq('id', orderId);
      
    if (updateError) {
      throw updateError;
    }
    
    // Return print-ready content
    res.json({
      success: true,
      message: 'KOT generated successfully',
      content: kotContent,
      orderId: order.id,
      orderNumber: order.order_number
    });
    
  } catch (error) {
    console.error('Print KOT error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate KOT'
    });
  }
};

// Print Bill
const printBill = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (orderError) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order is confirmed
    if (order.order_status !== 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed orders can be printed'
      });
    }
    
    // Get order items with menu item details
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        menu_items (name)
      `)
      .eq('order_id', orderId);
      
    if (itemsError) {
      throw itemsError;
    }
    
    // Get site content for restaurant details
    const { data: siteContent, error: siteError } = await supabase
      .from('site_content')
      .select('*');
      
    if (siteError) {
      throw siteError;
    }
    
    // Generate bill content
    const billContent = generateBillContent(order, orderItems, siteContent);
    
    // Update bill printed status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ bill_printed: true })
      .eq('id', orderId);
      
    if (updateError) {
      throw updateError;
    }
    
    // Return print-ready content
    res.json({
      success: true,
      message: 'Bill generated successfully',
      content: billContent,
      orderId: order.id,
      orderNumber: order.order_number
    });
    
  } catch (error) {
    console.error('Print Bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate bill'
    });
  }
};

module.exports = {
  printKOT,
  printBill
};
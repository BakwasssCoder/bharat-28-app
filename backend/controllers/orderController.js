const { supabase } = require('../utils/supabaseClient');
const { generateOrderNumber } = require('../utils/helpers');

// Create a new order (billing at counter)
const createOrder = async (req, res) => {
  try {
    const { items, paymentMode, orderSource = 'Counter' } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items are required and must be an array'
      });
    }

    if (!paymentMode || !['Cash', 'UPI', 'Card'].includes(paymentMode)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment mode is required (Cash, UPI, Card)'
      });
    }

    // Calculate total amount and validate items
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const { menuItemId, quantity } = item;

      if (!menuItemId || !quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid menuItemId and positive quantity'
        });
      }

      // Get menu item to verify it exists and get price
      const { data: menuItem, error: menuItemError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', menuItemId)
        .single();

      if (menuItemError || !menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item with ID ${menuItemId} not found`
        });
      }

      const itemTotal = menuItem.price * quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        menu_item_id: menuItemId,
        quantity,
        price_at_order_time: menuItem.price
      });
    }

    // Generate unique order number
    let orderNumber;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 5) {
      orderNumber = generateOrderNumber();
      
      const { data: existingOrder, error: existingOrderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

      if (existingOrderError && existingOrderError.code === 'PGRST116') {
        // No existing order found
        isUnique = true;
      } else if (existingOrder) {
        // Order exists
        isUnique = false;
      } else {
        // Some other error
        throw existingOrderError;
      }
      
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Unable to generate unique order number'
      });
    }

    // Create order and order items
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        total_amount: totalAmount,
        payment_mode: paymentMode,
        order_source: orderSource,
        order_status: 'PENDING'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItemsWithOrderId = orderItemsData.map(item => ({
      ...item,
      order_id: newOrder.id
    }));

    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId)
      .select();

    if (orderItemsError) throw orderItemsError;

    // Include order items in the response
    newOrder.order_items = orderItems;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Handle POS order (external system integration)
const createPOSOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMode, customerName, customerPhone } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items are required and must be an array'
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required'
      });
    }

    if (!paymentMode || !['Cash', 'UPI', 'Card'].includes(paymentMode)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment mode is required (Cash, UPI, Card)'
      });
    }

    // Validate each item has required fields
    for (const item of items) {
      const { menuItemId, quantity, priceAtOrderTime } = item;

      if (!menuItemId || !quantity || quantity <= 0 || !priceAtOrderTime || priceAtOrderTime <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have valid menuItemId, quantity, and priceAtOrderTime'
        });
      }

      // Verify menu item exists
      const { data: menuItem, error: menuItemError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', menuItemId)
        .single();

      if (menuItemError || !menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item with ID ${menuItemId} not found`
        });
      }
    }

    // Generate unique order number
    let orderNumber;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 5) {
      orderNumber = generateOrderNumber();
      
      const { data: existingOrder, error: existingOrderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

      if (existingOrderError && existingOrderError.code === 'PGRST116') {
        // No existing order found
        isUnique = true;
      } else if (existingOrder) {
        // Order exists
        isUnique = false;
      } else {
        // Some other error
        throw existingOrderError;
      }
      
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Unable to generate unique order number'
      });
    }

    // Create order and order items
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        total_amount: totalAmount,
        payment_mode: paymentMode,
        order_source: 'POS',
        order_status: 'CONFIRMED',
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        confirmed_at: new Date()
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItemsWithOrderId = items.map(item => ({
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      price_at_order_time: item.priceAtOrderTime,
      order_id: newOrder.id
    }));

    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId)
      .select();

    if (orderItemsError) throw orderItemsError;

    // Include order items in the response
    newOrder.order_items = orderItems;

    res.status(201).json({
      success: true,
      message: 'POS order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Create POS order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all orders (for admin dashboard)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (*)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const totalOrders = count;

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page * limit < totalOrders,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Confirm order (admin only)
const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        order_status: 'CONFIRMED',
        confirmed_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Order confirmed successfully',
      order
    });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cancel order (admin only)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        order_status: 'CANCELLED'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reverse confirmed order (change back to PENDING)
const reverseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the order to check its current status
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw fetchError;
    }

    // Check if order is CONFIRMED
    if (existingOrder.order_status !== 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: 'Only CONFIRMED orders can be reversed'
      });
    }

    // Update order status back to PENDING and clear confirmation timestamp
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        order_status: 'PENDING',
        confirmed_at: null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Order reversed successfully',
      order
    });
  } catch (error) {
    console.error('Reverse order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete order (admin only)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the order to check if it exists
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw fetchError;
    }

    // Delete associated order items first
    const { error: deleteItemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (deleteItemsError) {
      throw deleteItemsError;
    }

    // Delete the order
    const { data: order, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
      order
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createOrder,
  createPOSOrder,
  getAllOrders,
  getOrderById,
  confirmOrder,
  cancelOrder,
  reverseOrder,
  deleteOrder
};
const { supabase } = require('../utils/supabaseClient');

// Get sales dashboard data
const getSalesDashboard = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Today's stats
    const { data: todayOrders, error: todayError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('order_status', 'CONFIRMED')
      .gte('confirmed_at', today.toISOString())
      .lte('confirmed_at', new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString());

    if (todayError) throw todayError;

    const todayStats = {
      totalOrders: todayOrders.length,
      totalRevenue: todayOrders.reduce((sum, order) => sum + order.total_amount, 0)
    };

    // Weekly stats
    const { data: weeklyOrders, error: weeklyError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('order_status', 'CONFIRMED')
      .gte('confirmed_at', weekAgo.toISOString())
      .lte('confirmed_at', new Date().toISOString());

    if (weeklyError) throw weeklyError;

    const weeklyStats = {
      totalOrders: weeklyOrders.length,
      totalRevenue: weeklyOrders.reduce((sum, order) => sum + order.total_amount, 0)
    };

    // Monthly stats
    const { data: monthlyOrders, error: monthlyError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('order_status', 'CONFIRMED')
      .gte('confirmed_at', monthAgo.toISOString())
      .lte('confirmed_at', new Date().toISOString());

    if (monthlyError) throw monthlyError;

    const monthlyStats = {
      totalOrders: monthlyOrders.length,
      totalRevenue: monthlyOrders.reduce((sum, order) => sum + order.total_amount, 0)
    };

    // Recent orders (last 10 confirmed)
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (*)
        )
      `)
      .eq('order_status', 'CONFIRMED')
      .order('confirmed_at', { ascending: false })
      .limit(10);

    if (ordersError) throw ordersError;

    res.json({
      success: true,
      data: {
        today: todayStats,
        weekly: weeklyStats,
        monthly: monthlyStats,
        recentOrders,
        dailySales: []
      }
    });
  } catch (error) {
    console.error('Get sales dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get sales report (custom date range)
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }
    
    // Ensure end date is not before start date
    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }
    
    // Get sales data for the date range
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, confirmed_at')
      .eq('order_status', 'CONFIRMED')
      .gte('confirmed_at', start.toISOString())
      .lte('confirmed_at', end.toISOString())
      .order('confirmed_at', { ascending: true });

    if (error) throw error;
    
    // Calculate totals
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    
    res.json({
      success: true,
      data: {
        orders,
        summary: {
          totalOrders,
          totalRevenue,
          startDate: start,
          endDate: end
        }
      }
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getSalesDashboard,
  getSalesReport
};
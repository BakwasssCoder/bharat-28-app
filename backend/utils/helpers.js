const { supabase } = require('./supabaseClient');

// Generate a unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3-digit random number
  return `ORD-${timestamp}-${random}`;
};

module.exports = {
  generateOrderNumber
};

// Update or create daily sales snapshot
const updateDailySalesSnapshot = async (date, amount) => {
  try {
    const dateString = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Try to find existing snapshot for the day
    const { data: snapshot, error: findError } = await supabase
      .from('daily_sales_snapshots')
      .select('*')
      .eq('date', dateString)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }

    if (snapshot) {
      // Update existing snapshot
      const { data: updatedSnapshot, error: updateError } = await supabase
        .from('daily_sales_snapshots')
        .update({
          total_orders: snapshot.total_orders + 1,
          total_revenue: snapshot.total_revenue + amount
        })
        .eq('id', snapshot.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedSnapshot;
    } else {
      // Create new snapshot
      const { data: newSnapshot, error: insertError } = await supabase
        .from('daily_sales_snapshots')
        .insert({
          date: dateString,
          total_orders: 1,
          total_revenue: amount
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newSnapshot;
    }
  } catch (error) {
    console.error('Error updating daily sales snapshot:', error);
    throw error;
  }
};

// Get sales statistics for dashboard
const getSalesStats = async () => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Today's stats
    const { data: todaySnapshot, error: todayError } = await supabase
      .from('daily_sales_snapshots')
      .select('*')
      .eq('date', today.toISOString().split('T')[0])
      .single();

    const todayStats = todayError ? { total_orders: 0, total_revenue: 0 } : todaySnapshot;

    // Weekly stats
    const { data: weeklySnapshots, error: weeklyError } = await supabase
      .from('daily_sales_snapshots')
      .select('total_orders, total_revenue')
      .gte('date', weekAgo.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0]);

    if (weeklyError) throw weeklyError;

    const weeklyStats = {
      total_orders: weeklySnapshots.reduce((sum, day) => sum + day.total_orders, 0),
      total_revenue: weeklySnapshots.reduce((sum, day) => sum + day.total_revenue, 0)
    };

    // Monthly stats
    const { data: monthlySnapshots, error: monthlyError } = await supabase
      .from('daily_sales_snapshots')
      .select('total_orders, total_revenue')
      .gte('date', monthAgo.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0]);

    if (monthlyError) throw monthlyError;

    const monthlyStats = {
      total_orders: monthlySnapshots.reduce((sum, day) => sum + day.total_orders, 0),
      total_revenue: monthlySnapshots.reduce((sum, day) => sum + day.total_revenue, 0)
    };

    // Recent orders (last 10)
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (ordersError) throw ordersError;

    // Daily sales for chart (last 7 days)
    const { data: dailySales, error: dailyError } = await supabase
      .from('daily_sales_snapshots')
      .select('*')
      .gte('date', weekAgo.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (dailyError) throw dailyError;

    return {
      today: {
        totalOrders: todayStats.total_orders,
        totalRevenue: todayStats.total_revenue
      },
      weekly: {
        totalOrders: weeklyStats.total_orders,
        totalRevenue: weeklyStats.total_revenue
      },
      monthly: {
        totalOrders: monthlyStats.total_orders,
        totalRevenue: monthlyStats.total_revenue
      },
      recentOrders,
      dailySales
    };
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    throw error;
  }
};

module.exports = {
  generateOrderNumber,
  updateDailySalesSnapshot,
  getSalesStats
};
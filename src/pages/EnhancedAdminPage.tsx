import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Download, 
  Check, 
  Trash2, 
  LogOut, 
  Plus, 
  ShoppingCart,
  BarChart3,
  Package,
  Users,
  IndianRupee,
  Undo  // Add Undo icon
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  adminLogin, 
  getAdminProfile, 
  createOrder, 
  getSalesDashboard,
  getMenuCategories,
  getMenuItems as getAPIMenuItems,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllOrders,
  confirmOrder,
  cancelOrder,
  reverseOrder,
  refreshAdminToken,
  deleteOrder,
  printKOT,  // Add printKOT function
  printBill  // Add printBill function
} from '@/utils/api';

// Types
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface SalesStats {
  today: {
    totalOrders: number;
    totalRevenue: number;
  };
  weekly: {
    totalOrders: number;
    totalRevenue: number;
  };
  monthly: {
    totalOrders: number;
    totalRevenue: number;
  };
  recentOrders: any[];
  dailySales: any[];
}

const EnhancedAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('billing');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Add state for print preview
  const [printPreview, setPrintPreview] = useState<{ type: string; content: string } | null>(null);
  
  // Add state for keeping track of activity
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Menu management state
  const [categories, setCategories] = useState<any[]>([]);
  const [apiMenuItems, setAPIMenuItems] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', isActive: true });
  const [itemForm, setItemForm] = useState({ 
    name: '', 
    description: '', 
    price: 0, 
    category_id: '', 
    isAvailable: true, 
    isFeatured: false, 
    imageUrl: '' 
  });
  // Orders management state
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  // Load data on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadSalesDashboard();
      loadMenuCategories();
      loadAPIMenuItems();
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadSalesDashboard = async () => {
    try {
      const response = await getSalesDashboard(token);
      if (response.success) {
        setSalesStats(response.data);
      } else {
        toast.error(response.message || 'Failed to load sales data');
      }
    } catch (error) {
      console.error('Error loading sales dashboard:', error);
      toast.error('Failed to load sales data');
    }
  };

  const loadMenuCategories = async () => {
    try {
      const response = await getMenuCategories(token);
      if (response.success) {
        setCategories(response.categories);
      } else {
        toast.error(response.message || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadAPIMenuItems = async () => {
    try {
      const response = await getAPIMenuItems(token);
      if (response.success) {
        setAPIMenuItems(response.menuItems);
      } else {
        toast.error(response.message || 'Failed to load menu items');
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast.error('Failed to load menu items');
    }
  };

  const loadOrders = async () => {
    try {
      const response = await getAllOrders(token);
      if (response.success) {
        const allOrders = response.orders;
        setOrders(allOrders.filter((order: any) => order.order_status === 'CONFIRMED'));
        setPendingOrders(allOrders.filter((order: any) => order.order_status === 'PENDING'));
      } else {
        toast.error(response.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await adminLogin(username, password);
      
      if (response.success) {
        setIsAuthenticated(true);
        setToken(response.token);
        toast.success('Access granted');
      } else {
        toast.error(response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    setUsername('');
    setPassword('');
    setCart([]);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    setLoading(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        })),
        paymentMode,
        orderSource: 'Counter'
      };
      
      const response = await createOrder(token, orderData);
      
      if (response.success) {
        toast.success('Order created successfully');
        setCart([]);
        // Refresh sales dashboard and orders
        loadSalesDashboard();
        loadOrders();
      } else {
        toast.error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Create order error:', error);
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  // Menu Management Functions
  const handleCreateCategory = async () => {
    try {
      const response = await createMenuCategory(token, categoryForm);
      if (response.success) {
        toast.success('Category created successfully');
        setShowCategoryForm(false);
        setCategoryForm({ name: '', isActive: true });
        loadMenuCategories();
      } else {
        toast.error(response.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Create category error:', error);
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const response = await updateMenuCategory(token, editingCategory.id, categoryForm);
      if (response.success) {
        toast.success('Category updated successfully');
        setEditingCategory(null);
        setShowCategoryForm(false);
        setCategoryForm({ name: '', isActive: true });
        loadMenuCategories();
      } else {
        toast.error(response.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Update category error:', error);
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await deleteMenuCategory(token, id);
      if (response.success) {
        toast.success('Category deleted successfully');
        loadMenuCategories();
      } else {
        toast.error(response.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleCreateMenuItem = async () => {
    try {
      // Validate form
      if (!itemForm.name || itemForm.name.trim() === '') {
        toast.error('Item name is required');
        return;
      }
      
      if (!itemForm.category_id || itemForm.category_id.trim() === '') {
        toast.error('Category is required');
        return;
      }
      
      if (!itemForm.price || itemForm.price <= 0) {
        toast.error('Valid price is required');
        return;
      }

      const response = await createMenuItem(token, itemForm);
      if (response.success) {
        toast.success('Menu item created successfully');
        setShowItemForm(false);
        setItemForm({ 
          name: '', 
          description: '', 
          price: 0, 
          category_id: '', 
          isAvailable: true, 
          isFeatured: false, 
          imageUrl: '' 
        });
        loadAPIMenuItems();
      } else {
        toast.error(response.message || 'Failed to create menu item');
      }
    } catch (error) {
      console.error('Create menu item error:', error);
      toast.error('Failed to create menu item');
    }
  };  const handleUpdateMenuItem = async () => {
    try {
      // Validate form
      if (!itemForm.name || itemForm.name.trim() === '') {
        toast.error('Item name is required');
        return;
      }
      
      if (!itemForm.category_id || itemForm.category_id.trim() === '') {
        toast.error('Category is required');
        return;
      }
      
      if (!itemForm.price || itemForm.price <= 0) {
        toast.error('Valid price is required');
        return;
      }

      const response = await updateMenuItem(token, editingItem.id, itemForm);
      if (response.success) {
        toast.success('Menu item updated successfully');
        setEditingItem(null);
        setShowItemForm(false);
        setItemForm({ 
          name: '', 
          description: '', 
          price: 0, 
          category_id: '', 
          isAvailable: true, 
          isFeatured: false, 
          imageUrl: '' 
        });
        loadAPIMenuItems();
      } else {
        toast.error(response.message || 'Failed to update menu item');
      }
    } catch (error) {
      console.error('Update menu item error:', error);
      toast.error('Failed to update menu item');
    }
  };  const handleDeleteMenuItem = async (id: string) => {
    try {
      const response = await deleteMenuItem(token, id);
      if (response.success) {
        toast.success('Menu item deleted successfully');
        loadAPIMenuItems();
      } else {
        toast.error(response.message || 'Failed to delete menu item');
      }
    } catch (error) {
      console.error('Delete menu item error:', error);
      toast.error('Failed to delete menu item');
    }
  };

  // Order Management Functions
  const handleConfirmOrder = async (orderId: string) => {
    try {
      const response = await confirmOrder(token, orderId);
      if (response.success) {
        toast.success('Order confirmed successfully');
        loadOrders();
        loadSalesDashboard();
      } else {
        toast.error(response.message || 'Failed to confirm order');
      }
    } catch (error) {
      console.error('Confirm order error:', error);
      toast.error('Failed to confirm order');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await cancelOrder(token, orderId);
      if (response.success) {
        toast.success('Order cancelled successfully');
        loadOrders();
        loadSalesDashboard();
      } else {
        toast.error(response.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error('Failed to cancel order');
    }
  };

  // Add this function after the other order management functions
  const handleReverseOrder = async (orderId: string) => {
    try {
      const response = await reverseOrder(token, orderId);
      if (response.success) {
        toast.success('Order reversed successfully');
        loadOrders();
        loadSalesDashboard();
      } else {
        toast.error(response.message || 'Failed to reverse order');
      }
    } catch (error) {
      console.error('Reverse order error:', error);
      toast.error('Failed to reverse order');
    }
  };

  // Add this function after the other order management functions
  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await deleteOrder(token, orderId);
      if (response.success) {
        toast.success('Order deleted successfully');
        loadOrders();
        loadSalesDashboard();
      } else {
        toast.error(response.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Delete order error:', error);
      toast.error('Failed to delete order');
    }
  };

  // Add image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll just show a preview and store the file name
    // In a real implementation, you would upload to a service like Cloudinary
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setItemForm({...itemForm, imageUrl: event.target.result as string});
      }
    };
    reader.readAsDataURL(file);
  };

  // Update the print functions to show preview
  const handlePrintKOT = async (orderId: string) => {
    try {
      const response = await printKOT(token, orderId);
      if (response.success) {
        toast.success('KOT sent to printer');
        // Show preview in modal
        setPrintPreview({ type: 'KOT', content: response.content });
        loadOrders();
      } else {
        toast.error(response.message || 'Failed to print KOT');
      }
    } catch (error) {
      console.error('Print KOT error:', error);
      toast.error('Failed to print KOT');
    }
  };

  const handlePrintBill = async (orderId: string) => {
    try {
      const response = await printBill(token, orderId);
      if (response.success) {
        toast.success('Bill sent to printer');
        // Show preview in modal
        setPrintPreview({ type: 'Bill', content: response.content });
        loadOrders();
      } else {
        toast.error(response.message || 'Failed to print bill');
      }
    } catch (error) {
      console.error('Print bill error:', error);
      toast.error('Failed to print bill');
    }
  };

  // Add effect to prevent auto-logout with proper token refresh
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;
    
    if (isAuthenticated && token) {
      // Refresh token every 20 minutes (before the 24-hour expiry)
      refreshInterval = setInterval(async () => {
        try {
          const response = await refreshAdminToken(token);
          if (response.success && response.token) {
            setToken(response.token);
            console.log('Token refreshed successfully');
          } else {
            console.log('Token refresh failed:', response.message);
            // If refresh fails, we might want to logout
            // But for now, we'll just continue trying
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          // Continue trying to refresh
        }
      }, 20 * 60 * 1000); // 20 minutes
    }
    
    // Clean up interval on unmount or when auth state changes
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAuthenticated, token]);
  
  // Render login screen
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold">Admin Portal</h1>
                <p className="text-muted-foreground">Sign in to access dashboard</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg">BHARAT²⁸</h1>
                  <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4">
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveTab('billing')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'billing'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShoppingCart className="h-4 w-4 inline mr-2" />
                Billing Counter
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Incoming Orders
              </button>
              
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sales'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Sales Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('menu')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'menu'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Package className="h-4 w-4 inline mr-2" />
                Menu Management
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Billing Counter Tab */}
          {activeTab === 'billing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-4">Menu Items</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {apiMenuItems.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                        onClick={() => addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          category: item.category?.name
                        })}
                      >
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.category?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{item.price}</p>
                          <Button 
                            size="sm" 
                            className="mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                category: item.category?.name
                              });
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Cart & Payment */}
              <div>
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="font-display text-xl font-bold mb-4">Current Order</h2>
                  
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No items in cart</p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">₹{item.price} × {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-lg">₹{calculateTotal()}</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Payment Mode</label>
                            <select 
                              value={paymentMode}
                              onChange={(e) => setPaymentMode(e.target.value)}
                              className="w-full p-2 border rounded-md bg-background"
                            >
                              <option value="Cash">Cash</option>
                              <option value="UPI">UPI</option>
                              <option value="Card">Card</option>
                            </select>
                          </div>
                          
                          <Button 
                            className="w-full gap-2"
                            onClick={handleCreateOrder}
                            disabled={loading}
                          >
                            <Check className="h-4 w-4" />
                            {loading ? 'Processing...' : 'Complete Order'}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Pending Orders Section - Modified to include delete button */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-xl font-bold mb-4">Pending Orders</h2>
                
                {pendingOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pending orders</p>
                ) : (
                  <div className="space-y-4">
                    {pendingOrders.map(order => (
                      <div key={order.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Order #{order.order_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.customer_name} - {order.customer_phone}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{order.total_amount}</p>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleConfirmOrder(order.id)}
                              >
                                Confirm
                              </Button>
                              {/* Delete Order Button */}
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-border">
                          <h4 className="text-sm font-medium mb-2">Items:</h4>
                          <ul className="text-sm space-y-1">
                            {order.order_items?.map((item: any) => (
                              <li key={item.id}>
                                {item.quantity} × {item.menu_items?.name} - ₹{item.price_at_sale * item.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Confirmed Orders Section - Modified to include print buttons */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-xl font-bold mb-4">Confirmed Orders</h2>
                
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No confirmed orders</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {orders.map(order => (
                      <div key={order.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">Order #{order.order_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{order.total_amount}</p>
                            <p className="text-sm text-muted-foreground">{order.payment_mode}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {/* Print KOT Button */}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handlePrintKOT(order.id)}
                              >
                                Print KOT
                              </Button>
                              
                              {/* Print Bill Button */}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handlePrintBill(order.id)}
                              >
                                Print Bill
                              </Button>
                              
                              {/* Reverse Order Button */}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handleReverseOrder(order.id)}
                              >
                                <Undo className="h-4 w-4" />
                                Reverse
                              </Button>
                              
                              {/* Delete Order Button */}
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="gap-1"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Sales Dashboard Tab */}
          {activeTab === 'sales' && salesStats && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Revenue</p>
                      <p className="font-display text-2xl font-bold">₹{salesStats.today.totalRevenue.toFixed(2)}</p>
                    </div>
                    <IndianRupee className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Orders</p>
                      <p className="font-display text-2xl font-bold">{salesStats.today.totalOrders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Weekly Revenue</p>
                      <p className="font-display text-2xl font-bold">₹{salesStats.weekly.totalRevenue.toFixed(2)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
              
              {/* Charts and Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart Placeholder */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display text-xl font-bold mb-4">Sales Trend</h2>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Sales chart visualization would appear here</p>
                  </div>
                </div>
                
                {/* Recent Orders - Modified to include delete button */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h2 className="font-display text-xl font-bold mb-4">Recent Orders</h2>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {salesStats.recentOrders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">Order #{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <p className="font-bold">₹{order.total_amount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{order.payment_mode}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {salesStats.recentOrders.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No recent orders</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              {/* Categories Section */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display text-xl font-bold">Categories</h2>
                  <Button 
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: '', isActive: true });
                      setShowCategoryForm(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Category
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map(category => (
                    <div key={category.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.is_active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryForm({
                                name: category.name,
                                isActive: category.is_active
                              });
                              setShowCategoryForm(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Menu Items Section */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display text-xl font-bold">Menu Items</h2>
                  <Button 
                    onClick={() => {
                      setEditingItem(null);
                      setItemForm({ 
                        name: '', 
                        description: '', 
                        price: 0, 
                        category_id: categories.length > 0 ? categories[0].id : '', 
                        isAvailable: true, 
                        isFeatured: false, 
                        imageUrl: '' 
                      });
                      setShowItemForm(true);
                    }}
                    className="gap-2"
                    disabled={categories.length === 0}
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Item</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiMenuItems.map(item => (
                        <tr key={item.id} className="border-b border-border">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{item.category?.name}</td>
                          <td className="py-3 px-4">₹{item.price}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.is_available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingItem(item);
                                setItemForm({
                                  name: item.name,
                                  description: item.description || '',
                                  price: item.price,
                                  category_id: item.category_id,
                                  isAvailable: item.is_available,
                                  isFeatured: item.is_featured,
                                  imageUrl: item.image_url || ''
                                });
                                setShowItemForm(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteMenuItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Category Form Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-6 border border-border w-full max-w-md">
              <h3 className="font-display text-xl font-bold mb-4">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category Name</label>
                  <Input 
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    placeholder="Enter category name"
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    checked={categoryForm.isActive}
                    onChange={(e) => setCategoryForm({...categoryForm, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm">Active</label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCategoryForm(false);
                      setEditingCategory(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Menu Item Form Modal */}
        {showItemForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-6 border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="font-display text-xl font-bold mb-4">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Item Name</label>
                  <Input 
                    value={itemForm.name}
                    onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    value={itemForm.description}
                    onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                    placeholder="Enter item description"
                    className="w-full p-2 border rounded-md bg-background"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <Input 
                    type="number" 
                    value={itemForm.price}
                    onChange={(e) => setItemForm({...itemForm, price: parseFloat(e.target.value) || 0})}
                    placeholder="Enter price"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <div className="flex gap-2">
                    <select 
                      value={itemForm.category_id || ""}
                      onChange={(e) => setItemForm({...itemForm, category_id: e.target.value})}
                      className="flex-1 p-2 border rounded-md bg-background"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    <Button 
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryForm({ name: '', isActive: true });
                        setShowCategoryForm(true);
                      }}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      New
                    </Button>
                  </div>
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      No categories available. Create one first.
                    </p>
                  )}
                  {!itemForm.category_id && (
                    <p className="text-sm text-destructive mt-1">
                      Category is required
                    </p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="isAvailable" 
                    checked={itemForm.isAvailable}
                    onChange={(e) => setItemForm({...itemForm, isAvailable: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isAvailable" className="text-sm">Available</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="isFeatured" 
                    checked={itemForm.isFeatured}
                    onChange={(e) => setItemForm({...itemForm, isFeatured: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isFeatured" className="text-sm">Featured Item</label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  {itemForm.imageUrl ? (
                    <div className="mb-2">
                      <img 
                        src={itemForm.imageUrl} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  ) : null}
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-2"
                  />
                  <Input 
                    value={itemForm.imageUrl}
                    onChange={(e) => setItemForm({...itemForm, imageUrl: e.target.value})}
                    placeholder="Or enter image URL"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image or enter a URL
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowItemForm(false);
                      setEditingItem(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={editingItem ? handleUpdateMenuItem : handleCreateMenuItem}
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Print Preview Modal */}
        {printPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-6 border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-xl font-bold">
                  Print Preview - {printPreview.type}
                </h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setPrintPreview(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="bg-white p-4 font-mono text-sm whitespace-pre-wrap">
                {printPreview.content}
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPrintPreview(null)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    // In a real implementation, this would send to a print service
                    toast.success(`${printPreview.type} would be sent to printer in production`);
                    setPrintPreview(null);
                  }}
                >
                  Send to Printer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EnhancedAdminPage;
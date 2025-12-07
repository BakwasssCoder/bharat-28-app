import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Download, Check, Trash2, LogOut } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Order {
  id: string;
  timestamp: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  total: number;
  deliveryMode: string;
  customerName?: string;
  customerPhone?: string;
  status: 'pending' | 'fulfilled';
}

const DEV_PASSCODE = 'admin123'; // Replace with env variable in production

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('bharat28-orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === DEV_PASSCODE) {
      setIsAuthenticated(true);
      toast.success('Access granted');
    } else {
      toast.error('Invalid passcode');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
  };

  const markAsFulfilled = (orderId: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: 'fulfilled' as const } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('bharat28-orders', JSON.stringify(updatedOrders));
    toast.success('Order marked as fulfilled');
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('bharat28-orders', JSON.stringify(updatedOrders));
    toast.success('Order deleted');
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Items', 'Total', 'Mode', 'Status'];
    const rows = orders.map(order => [
      order.id,
      new Date(order.timestamp).toLocaleString(),
      order.customerName || 'N/A',
      order.customerPhone || 'N/A',
      order.items.map(i => `${i.name} x${i.quantity}`).join('; '),
      `₹${order.total}`,
      order.deliveryMode,
      order.status,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bharat28-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold">Admin Access</h1>
              <p className="text-muted-foreground mt-2">Enter passcode to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="text-center text-lg"
              />
              <Button type="submit" className="w-full">
                Access Admin
              </Button>
            </form>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold">Order Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Orders placed via WhatsApp will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{order.id}</p>
                    <p className="font-semibold">{order.customerName || 'Unknown Customer'}</p>
                    <p className="text-sm text-muted-foreground">{order.customerPhone || 'No phone'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.timestamp).toLocaleString()}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        order.status === 'fulfilled'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
                    <span>Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => markAsFulfilled(order.id)}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Mark Fulfilled
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteOrder(order.id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminPage;

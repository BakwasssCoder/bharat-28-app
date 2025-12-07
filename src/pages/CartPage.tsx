import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck, Store, MessageCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { openWhatsAppOrder, saveOrderToLocal } from '@/utils/whatsapp';
import { toast } from 'sonner';

function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    deliveryMode,
    setDeliveryMode,
    itemCount,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    const order = {
      items,
      subtotal,
      tax,
      total,
      deliveryMode,
      customerName,
      customerPhone,
      customerAddress,
      specialInstructions,
    };

    // Save to localStorage for admin
    saveOrderToLocal(order);

    // Open WhatsApp
    openWhatsAppOrder(order);

    toast.success('Opening WhatsApp to complete your order!');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything yet
            </p>
            <Link to="/menu">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Browse Menu
              </Button>
            </Link>
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
          <h1 className="font-display text-2xl md:text-3xl font-bold">Your Cart</h1>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="font-display text-xl font-bold">Order Summary</h2>

              {/* Delivery Mode */}
              <div>
                <label className="text-sm font-medium mb-2 block">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={deliveryMode === 'pickup' ? 'default' : 'outline'}
                    onClick={() => setDeliveryMode('pickup')}
                    className="gap-2"
                  >
                    <Store className="h-4 w-4" />
                    Pickup
                  </Button>
                  <Button
                    variant={deliveryMode === 'delivery' ? 'default' : 'outline'}
                    onClick={() => setDeliveryMode('delivery')}
                    className="gap-2"
                  >
                    <Truck className="h-4 w-4" />
                    Delivery
                  </Button>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <Input
                  placeholder="Your Name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                />
                {deliveryMode === 'delivery' && (
                  <Textarea
                    placeholder="Delivery Address"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    rows={2}
                  />
                )}
                <Textarea
                  placeholder="Special Instructions (optional)"
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{tax}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleCheckout}
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your order will be sent via WhatsApp for confirmation
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default CartPage;

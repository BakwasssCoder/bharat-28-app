import { CartItem } from '@/contexts/CartContext';
import menuData from '@/data/menu.json';

interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  deliveryMode: 'pickup' | 'delivery';
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  specialInstructions?: string;
}

export function formatWhatsAppMessage(order: OrderDetails): string {
  const itemsList = order.items
    .map(item => `• ${item.name} x${item.quantity} — ₹${item.price * item.quantity}`)
    .join('\n');

  const message = `
🍽️ *BHARAT 28 — New Order*

*Items:*
${itemsList}

━━━━━━━━━━━━━━━━━━
*Subtotal:* ₹${order.subtotal}
*Tax:* ₹${order.tax}
*Total:* ₹${order.total}
━━━━━━━━━━━━━━━━━━

*Mode:* ${order.deliveryMode === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}

*Name:* ${order.customerName || '___________'}
*Phone:* ${order.customerPhone || '___________'}
${order.deliveryMode === 'delivery' ? `*Address:* ${order.customerAddress || '___________'}` : ''}

*Special Instructions:* ${order.specialInstructions || 'None'}
`.trim();

  return message;
}

export function getWhatsAppURL(message: string): string {
  const phone = menuData.restaurant_phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function openWhatsAppOrder(order: OrderDetails): void {
  const message = formatWhatsAppMessage(order);
  const url = getWhatsAppURL(message);
  window.open(url, '_blank');
}

export function saveOrderToLocal(order: OrderDetails): void {
  const orders = JSON.parse(localStorage.getItem('bharat28-orders') || '[]');
  const newOrder = {
    ...order,
    id: `order-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  orders.push(newOrder);
  localStorage.setItem('bharat28-orders', JSON.stringify(orders));
}

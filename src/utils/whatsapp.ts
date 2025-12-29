import { CartItem } from '@/contexts/CartContext';
import menuData from '@/data/menu.json';
import { getSiteContent } from '@/utils/api';

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
🍽️ *BHARAT²⁸ – TASTE OF TRADITION*
*New Order*

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

*Thank you for ordering with us!*`.trim();

  return message;
}

export async function getWhatsAppURL(message: string): Promise<string> {
  // Use the specific phone number for WhatsApp ordering
  const phone = '+919999173075';
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
}

export async function openWhatsAppOrder(order: OrderDetails): Promise<void> {
  const message = formatWhatsAppMessage(order);
  const url = await getWhatsAppURL(message);
  window.open(url, '_blank');
}
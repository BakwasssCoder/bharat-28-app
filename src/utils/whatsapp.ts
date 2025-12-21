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

export async function getWhatsAppURL(message: string): Promise<string> {
  // Try to get phone number from database first, fallback to menu.json
  let phone = menuData.restaurant_phone;
  
  try {
    const siteContent = await getSiteContent();
    if (siteContent.phone_number) {
      phone = siteContent.phone_number;
    }
  } catch (error) {
    console.warn('Could not fetch phone number from database, using fallback');
  }
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
}

export async function openWhatsAppOrder(order: OrderDetails): Promise<void> {
  const message = formatWhatsAppMessage(order);
  const url = await getWhatsAppURL(message);
  window.open(url, '_blank');
}
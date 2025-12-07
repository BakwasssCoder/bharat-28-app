import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getWhatsAppURL, formatWhatsAppMessage } from '@/utils/whatsapp';

export function FloatingCTA() {
  const { items, subtotal, tax, total, deliveryMode } = useCart();

  const handleWhatsAppClick = () => {
    const message = formatWhatsAppMessage({
      items,
      subtotal,
      tax,
      total,
      deliveryMode,
    });
    const url = getWhatsAppURL(message);
    window.open(url, '_blank');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleWhatsAppClick}
      className="fixed bottom-20 md:bottom-6 right-4 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
      aria-label="Order via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" fill="currentColor" />
    </motion.button>
  );
}

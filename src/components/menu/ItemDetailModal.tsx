import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Leaf, Drumstick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  tags: string[];
  image?: string;
}

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const { addItem, items, updateQuantity } = useCart();
  
  if (!item) return null;

  const cartItem = items.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;
  
  const isVegetarian = item.tags.includes('vegetarian');
  const isNonVeg = item.tags.includes('non-veg') || item.tags.includes('chicken');

  const handleAdd = () => {
    if (quantity === 0) {
      addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
      toast.success(`${item.name} added to cart!`);
    } else {
      updateQuantity(item.id, quantity + 1);
    }
  };

  const handleRemove = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
              {/* Image */}
              <div className="relative h-48 md:h-64 bg-muted">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-3 right-3 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </Button>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  {isVegetarian && (
                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-white" />
                    </span>
                  )}
                  {isNonVeg && (
                    <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                      <Drumstick className="h-4 w-4 text-white" />
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="font-display text-2xl font-bold text-foreground">{item.name}</h2>
                <p className="text-muted-foreground mt-2">{item.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <span className="text-2xl font-bold text-foreground">₹{item.price}</span>
                  
                  {quantity === 0 ? (
                    <Button onClick={handleAdd} className="px-8">
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRemove}
                        className="h-10 w-10 rounded-full"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                      <Button
                        size="icon"
                        onClick={handleAdd}
                        className="h-10 w-10 rounded-full"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

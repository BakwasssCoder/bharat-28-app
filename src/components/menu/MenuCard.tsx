import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Leaf, Drumstick } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MenuItemProps {
  id: string;
  name: string;
  desc: string;
  price: number;
  tags: string[];
  image?: string;
}

export function MenuCard({ id, name, desc, price, tags, image }: MenuItemProps) {
  const { addItem } = useCart();

  const isVegetarian = tags.includes('vegetarian');
  const isNonVeg = tags.includes('non-veg') || tags.includes('chicken');
  const isSignature = tags.includes('signature');
  const isBudget = tags.includes('budget');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id, name, price, image });
    toast.success(`${name} added to cart!`, {
      duration: 2000,
      position: 'bottom-center',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all cursor-pointer border border-border"
    >
      {/* Link wrapper for navigation to item page */}
      <Link to={`/menu/${id}`} className="block">
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-muted">
          <img
            src={image || '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {isVegetarian && (
              <span className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center" title="Vegetarian">
                <Leaf className="h-3.5 w-3.5 text-white" />
              </span>
            )}
            {isNonVeg && (
              <span className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center" title="Non-Veg">
                <Drumstick className="h-3.5 w-3.5 text-white" />
              </span>
            )}
          </div>

          {isSignature && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              Signature
            </Badge>
          )}

          {isBudget && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
              Budget Pick
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{desc}</p>

          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-bold text-foreground">₹{price}</span>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="rounded-full h-9 w-9 p-0 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
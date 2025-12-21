import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Leaf, Drumstick } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { getPublicMenuItems } from '@/utils/api';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  tags: string[];
  image?: string;
  price_single?: number;
  price_small?: number;
  price_medium?: number;
  price_large?: number;
}

function MenuItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, items, updateQuantity } = useCart();
  
  const cartItem = items.find(i => i.id === id);
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getPublicMenuItems();
        
        // Find the item by ID
        let foundItem: MenuItem | null = null;
        for (const category of data.menu) {
          const itemInCategory = category.items.find((i: MenuItem) => i.id === id);
          if (itemInCategory) {
            foundItem = itemInCategory;
            break;
          }
        }
        
        if (foundItem) {
          setItem(foundItem);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        setError('Failed to load item details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleAdd = () => {
    if (item) {
      if (quantity === 0) {
        addItem({ 
          id: item.id, 
          name: item.name, 
          price: item.price, 
          image: item.image 
        });
        toast.success(`${item.name} added to cart!`);
      } else {
        updateQuantity(item.id, quantity + 1);
      }
    }
  };

  const handleRemove = () => {
    if (quantity > 0 && item) {
      updateQuantity(item.id, quantity - 1);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-96 bg-muted rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              <div className="h-12 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-red-500">{error || 'Item not found'}</p>
            <Button 
              onClick={() => window.history.back()} 
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isVegetarian = item.tags.includes('vegetarian');
  const isNonVeg = item.tags.includes('non-veg') || item.tags.includes('chicken');

  // Determine pricing display
  const renderPrice = () => {
    if (item.price_single && item.price_small && item.price_medium && item.price_large) {
      return (
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="text-center">
            <span className="block text-sm text-muted-foreground">Small</span>
            <span className="text-xl font-bold">₹{item.price_small}</span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-muted-foreground">Medium</span>
            <span className="text-xl font-bold">₹{item.price_medium}</span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-muted-foreground">Large</span>
            <span className="text-xl font-bold">₹{item.price_large}</span>
          </div>
        </div>
      );
    } else if (item.price_small && item.price_medium && item.price_large) {
      return (
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="text-center">
            <span className="block text-sm text-muted-foreground">Small</span>
            <span className="text-xl font-bold">₹{item.price_small}</span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-muted-foreground">Medium</span>
            <span className="text-xl font-bold">₹{item.price_medium}</span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-muted-foreground">Large</span>
            <span className="text-xl font-bold">₹{item.price_large}</span>
          </div>
        </div>
      );
    } else if (item.price_single) {
      return <span className="text-3xl font-bold">₹{item.price_single}</span>;
    } else {
      return <span className="text-3xl font-bold">₹{item.price}</span>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button 
          onClick={() => window.history.back()} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Image */}
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-muted mb-8">
            <img
              src={item.image || '/placeholder.svg'}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-4 left-4 flex gap-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {item.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {item.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Order Section */}
            <div className="bg-card rounded-2xl p-6 border border-border h-fit">
              <h2 className="font-display text-xl font-bold mb-4">Order Now</h2>
              
              <div className="mb-6">
                {renderPrice()}
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="font-medium">Quantity</span>
                
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

              <Button 
                onClick={() => window.location.hash = '#cart-section'} 
                variant="outline" 
                className="w-full"
              >
                View Cart
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default MenuItemPage;
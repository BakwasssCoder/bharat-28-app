import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Leaf, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { MenuCard } from '@/components/menu/MenuCard';
import { ItemDetailModal } from '@/components/menu/ItemDetailModal';
import { MenuSkeletonGrid } from '@/components/menu/MenuSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import menuData from '@/data/menu.json';

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  tags: string[];
  image?: string;
}

function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get('category') || null
  );
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const allItems = useMemo(() => {
    return menuData.menu.flatMap(cat =>
      cat.items.map(item => ({ ...item, category: cat.id, categoryTitle: cat.title }))
    );
  }, []);

  const filteredItems = useMemo(() => {
    let items = allItems;

    // Category filter
    if (activeCategory) {
      items = items.filter(item => item.category === activeCategory);
    }

    // Veg filter
    if (showVegOnly) {
      items = items.filter(item => item.tags.includes('vegetarian'));
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return items;
  }, [allItems, activeCategory, showVegOnly, searchQuery]);

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Our Menu</h1>
          <p className="text-muted-foreground">Authentic flavors crafted with love</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-lg py-4 -mx-4 px-4 border-b border-border"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search dishes, ingredients..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Veg Toggle */}
            <Button
              variant={showVegOnly ? 'default' : 'outline'}
              onClick={() => setShowVegOnly(!showVegOnly)}
              className="gap-2"
            >
              <Leaf className="h-4 w-4" />
              Veg Only
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={activeCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryClick(null)}
              className="whitespace-nowrap"
            >
              All
            </Button>
            {menuData.menu.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
                className="whitespace-nowrap"
              >
                {category.title}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between py-4">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </p>
          {(activeCategory || showVegOnly || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveCategory(null);
                setShowVegOnly(false);
                setSearchQuery('');
                setSearchParams({});
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <MenuSkeletonGrid />
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-muted-foreground">No items found</p>
            <Button
              variant="link"
              onClick={() => {
                setActiveCategory(null);
                setShowVegOnly(false);
                setSearchQuery('');
              }}
              className="mt-2"
            >
              Clear all filters
            </Button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <MenuCard
                  key={item.id}
                  {...item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </Layout>
  );
}

export default MenuPage;

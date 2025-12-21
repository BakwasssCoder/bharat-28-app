import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MenuCard } from '@/components/menu/MenuCard';
import { MenuSkeletonGrid } from '@/components/menu/MenuSkeleton';
import { getPublicMenuItems, getSiteContent } from '@/utils/api';

function HomePage() {
  const [menuData, setMenuData] = useState<any>(null);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuResponse, contentResponse] = await Promise.all([
          getPublicMenuItems(),
          getSiteContent()
        ]);
        setMenuData(menuResponse);
        setSiteContent(contentResponse);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredItems = menuData?.menu
    ?.flatMap((cat: any) => cat.items)
    ?.filter((item: any) => item.tags.includes('featured'))
    ?.slice(0, 4) || [];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 gradient-hero opacity-10" />
        
        {/* Animated Background Shapes */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-10 w-72 h-72 rounded-full gradient-hero opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent opacity-20 blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Student Discount Badge */}
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <GraduationCap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Student Discount: 10% OFF</span>
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
            >
              <span className="gradient-text">{siteContent.brand_name || 'BHARAT²⁸'}</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8"
            >
              {siteContent.tagline || 'Food Designed Around You.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/menu">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6">
                  <UtensilsCrossed className="h-5 w-5" />
                  Explore Menu
                </Button>
              </Link>
              <Link to="/cart">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg px-8 py-6">
                  Order Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { value: '100+', label: 'Happy Customers' },
              { value: '50+', label: 'Delicious Dishes' },
              { value: '4.8', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Chef's Picks</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Signature Dishes
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/menu?item=${item.id}`}>
                  <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all border border-border">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-lg font-bold text-primary mt-2">₹{item.price}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/menu">
              <Button variant="outline" size="lg" className="gap-2">
                View Full Menu
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Browse Categories
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {menuData?.menu?.slice(0, 5).map((category: any, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/menu?category=${category.id}`}>
                  <div className="bg-card rounded-xl p-6 text-center shadow-card hover:shadow-lg transition-all border border-border cursor-pointer">
                    <h3 className="font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {category.items?.length || 0} items
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
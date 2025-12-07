import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, GraduationCap, Clock, Percent, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const offers = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student Discount',
    discount: '10% OFF',
    description: 'Show your valid student ID and get 10% off on all orders. Valid for dine-in and takeaway.',
    terms: 'Valid student ID required. Cannot be combined with other offers.',
    color: 'bg-accent',
  },
  {
    id: 'lunch',
    icon: Clock,
    title: 'Lunch Special',
    discount: '15% OFF',
    description: 'Enjoy 15% off on all orders placed between 12 PM - 3 PM on weekdays.',
    terms: 'Monday to Friday only. Dine-in and takeaway.',
    color: 'bg-primary',
  },
  {
    id: 'combo',
    icon: Percent,
    title: 'Combo Deal',
    discount: 'Save ₹50',
    description: 'Order any main course with a drink and save ₹50 on your total bill.',
    terms: 'Valid on selected items. Subject to availability.',
    color: 'bg-coral',
  },
];

function OffersPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <Tag className="h-5 w-5" />
            <span className="font-medium">Special Offers</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Deals & <span className="gradient-text">Discounts</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Save more on your favorite dishes with our exclusive offers
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden border border-border"
              >
                <div className={`${offer.color} p-6 text-white`}>
                  <Icon className="h-10 w-10 mb-4" />
                  <Badge className="bg-white/20 text-white border-0 mb-2">
                    {offer.discount}
                  </Badge>
                  <h3 className="font-display text-2xl font-bold">{offer.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  <p className="text-xs text-muted-foreground border-t border-border pt-4">
                    *{offer.terms}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/menu">
            <Button size="lg" className="gap-2">
              Order Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}

export default OffersPage;

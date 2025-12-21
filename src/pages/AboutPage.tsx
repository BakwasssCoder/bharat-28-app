import { motion } from 'framer-motion';
import { Heart, Award, Users, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const values = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every dish is prepared with passion and care, using traditional recipes passed down through generations.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'We source only the freshest ingredients to ensure every bite delivers authentic flavors.',
  },
  {
    icon: Users,
    title: 'Community Focus',
    description: 'Proudly serving the Karol Bagh community with affordable, delicious meals.',
  },
];

function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Story</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            BHARAT²⁸ was born from a simple idea: authentic Indian food should be accessible, 
            affordable, and absolutely delicious. Located in the heart of Karol Bagh, we bring 
            the rich flavors of Bihar and North India to your table.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-card rounded-2xl border border-border"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-8 md:p-12 border border-border"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We believe that good food brings people together. Our mission is to serve 
              authentic Indian cuisine that reminds you of home, whether you're a student 
              looking for a quick meal or a family celebrating a special occasion.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From our signature Litti Chokha to classic North Indian favorites, every dish 
              is crafted to deliver maximum flavor at prices that won't break the bank.
            </p>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">Find Us</span>
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">Visit Our Restaurant</h2>
          <p className="text-lg text-muted-foreground mb-2">Karol Bagh, New Delhi - 110005</p>
          <p className="text-muted-foreground">Open Daily: 11:00 AM - 11:00 PM</p>
        </motion.div>
      </div>
    </Layout>
  );
}

export default AboutPage;
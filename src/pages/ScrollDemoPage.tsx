import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { scrollToSection } from '@/utils/scrollUtils';

const sections = [
  { id: 'hero', title: 'Hero Section', color: 'bg-blue-500' },
  { id: 'about', title: 'About Section', color: 'bg-green-500' },
  { id: 'services', title: 'Services Section', color: 'bg-yellow-500' },
  { id: 'portfolio', title: 'Portfolio Section', color: 'bg-purple-500' },
  { id: 'contact', title: 'Contact Section', color: 'bg-red-500' },
];

function ScrollDemoPage() {
  const handleScrollToSection = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">Scroll to Section Demo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This page demonstrates smooth scrolling to specific sections. Click on any button below to scroll to that section.
          </p>
          
          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {sections.map((section) => (
              <Button
                key={section.id}
                onClick={() => handleScrollToSection(section.id)}
                variant="outline"
              >
                {section.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <section 
          id="hero" 
          className="min-h-screen flex flex-col items-center justify-center text-center p-8 mb-8 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-5xl font-bold mb-6">Hero Section</h2>
            <p className="text-xl mb-8">
              This is the hero section. It takes up the full viewport height to demonstrate scrolling.
            </p>
            <Button 
              onClick={() => handleScrollToSection('about')}
              variant="secondary"
              size="lg"
            >
              Scroll to About
            </Button>
          </motion.div>
        </section>

        {/* About Section */}
        <section 
          id="about" 
          className="min-h-screen flex flex-col items-center justify-center text-center p-8 mb-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-5xl font-bold mb-6">About Section</h2>
            <p className="text-xl mb-8">
              This is the about section. Notice how smoothly the page scrolls to this section when you click the buttons.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={() => handleScrollToSection('hero')}
                variant="secondary"
              >
                Back to Hero
              </Button>
              <Button 
                onClick={() => handleScrollToSection('services')}
                variant="secondary"
              >
                Scroll to Services
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section 
          id="services" 
          className="min-h-screen flex flex-col items-center justify-center text-center p-8 mb-8 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-5xl font-bold mb-6">Services Section</h2>
            <p className="text-xl mb-8">
              This is the services section. Smooth scrolling works with any element that has an ID.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={() => handleScrollToSection('about')}
                variant="secondary"
              >
                Back to About
              </Button>
              <Button 
                onClick={() => handleScrollToSection('portfolio')}
                variant="secondary"
              >
                Scroll to Portfolio
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Portfolio Section */}
        <section 
          id="portfolio" 
          className="min-h-screen flex flex-col items-center justify-center text-center p-8 mb-8 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-5xl font-bold mb-6">Portfolio Section</h2>
            <p className="text-xl mb-8">
              This is the portfolio section. The scrolling animation is smooth and pleasant to use.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={() => handleScrollToSection('services')}
                variant="secondary"
              >
                Back to Services
              </Button>
              <Button 
                onClick={() => handleScrollToSection('contact')}
                variant="secondary"
              >
                Scroll to Contact
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section 
          id="contact" 
          className="min-h-screen flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-5xl font-bold mb-6">Contact Section</h2>
            <p className="text-xl mb-8">
              This is the contact section. You've reached the end of the demo!
            </p>
            <Button 
              onClick={() => handleScrollToSection('hero')}
              variant="secondary"
              size="lg"
            >
              Back to Top
            </Button>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}

export default ScrollDemoPage;
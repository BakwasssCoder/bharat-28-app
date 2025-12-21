import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { FloatingCTA } from './FloatingCTA';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 md:pt-20 pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Live Map - appears on every page */}
      <div className="w-full py-8 bg-muted">
        <div className="container mx-auto px-4">
          <h3 className="text-center font-semibold mb-4 text-foreground">Find Us</h3>
          <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.098057889473!2d77.185239!3d28.64175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029210927755%3A0x3e0c1b0e1e1e1e1e!2s26%2F1%2C%20Bada%20Bazaar%20Rd%2C%20Old%20Rajender%20Nagar%2C%20Karol%20Bagh%2C%20New%20Delhi%2C%20Delhi%20110060!5e0!3m2!1sen!2sin!4v1678888888888!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bharat 28 Location"
            ></iframe>
          </div>
        </div>
      </div>
      
      <Footer />
      <MobileNav />
      <FloatingCTA />
    </div>
  );
}
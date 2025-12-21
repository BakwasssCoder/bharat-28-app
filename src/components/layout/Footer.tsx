import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            {/* Logo */}
            <Link to="/" className="transition-transform duration-300 hover:scale-110 inline-block mb-4">
              <img 
                src="https://i.postimg.cc/jdhnfLtV/Whats-App-Image-2025-12-21-at-16-56-15-9e47280f.jpg" 
                alt="BHARAT²⁸ Logo" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm">
              Food Designed Around You. Authentic Indian flavors with a modern twist.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>26/1, Bada Bazaar Road, Old rajendra nagar, Karol bagh, 110060</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 9990173075</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>05:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <div className="text-center">
            <p>© {new Date().getFullYear()} BHARAT²⁸. All rights reserved.</p>
            <p className="mt-2">
              Developed By:<br />
              BakwasssCoder<br />
              aka Aniket
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
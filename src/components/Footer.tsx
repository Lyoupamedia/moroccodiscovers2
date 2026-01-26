import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { name: 'Destinations', href: '/#destinations' },
  { name: 'Experiences', href: '/#experiences' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const Footer = () => {
  return (
    <footer className="bg-brown-dark text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="font-heading text-2xl font-bold text-primary">Morocco</span>
              <span className="font-heading text-2xl font-light">Discovers</span>
            </Link>
            <p className="text-primary-foreground/70 max-w-md leading-relaxed">
              Your gateway to authentic Moroccan experiences. From ancient medinas to golden dunes, 
              we craft unforgettable journeys.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link to={link.href} className="text-primary-foreground/70 hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-primary-foreground/70 hover:text-primary transition-colors">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 text-primary" />
                hello@moroccodiscovers.com
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 text-primary" />
                +212 5XX XXX XXX
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-primary" />
                Marrakech, Morocco
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Morocco Discovers. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-primary-foreground/50 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-primary-foreground/50 hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

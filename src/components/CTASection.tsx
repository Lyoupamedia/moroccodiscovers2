import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
export const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-gold">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Discover Morocco?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-10 leading-relaxed">
            Let us craft your perfect Moroccan adventure. Our travel experts are here to help you 
            create memories that last a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              asChild
              className="bg-brown-dark hover:bg-brown-dark/90 text-primary-foreground font-semibold rounded-full px-8 py-6 text-lg"
            >
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
            <Button 
              size="lg" 
              asChild
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-full px-8 py-6 text-lg"
            >
              <a href="https://wa.me/34666003838" target="_blank" rel="noopener noreferrer">
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

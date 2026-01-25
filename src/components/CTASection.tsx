import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

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
              className="bg-brown-dark hover:bg-brown-dark/90 text-primary-foreground font-semibold rounded-full px-8 py-6 text-lg"
            >
              Get a Free Quote
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-8 py-6 text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

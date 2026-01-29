import { motion } from 'framer-motion';
import { MapPin, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-morocco.jpg';

const stats = [
  { icon: MapPin, value: '12+', label: 'Destinations' },
  { icon: Star, value: '4.9', label: 'Rating' },
  { icon: Users, value: '10K+', label: 'Happy Travelers' },
];

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Morocco landscape at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-primary font-medium mb-6 text-sm tracking-wider"
          >
            <span>✦</span>
            <span>Discover the Magic of North Africa</span>
            <span>✦</span>
          </motion.p>

          {/* Heading */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Experience the{' '}
            <span className="text-gradient-gold italic">Enchanting</span>
            <br />
            Kingdom of Morocco
          </h1>

          {/* Subheading */}
          <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            From the golden dunes of the Sahara to the blue streets of Chefchaouen, 
            embark on an unforgettable journey through ancient medinas, majestic mountains, 
            and vibrant souks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-6 text-lg shadow-gold"
              onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Destinations
            </Button>
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-full px-8 py-6 text-lg"
              onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Experiences
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 md:gap-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-bold text-primary-foreground text-xl">{stat.value}</p>
                  <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-primary-foreground/70 text-sm font-medium">Explore Morocco</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

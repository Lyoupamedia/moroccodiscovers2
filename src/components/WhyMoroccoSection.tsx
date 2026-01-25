import { motion } from 'framer-motion';
import { Shield, Sun, Landmark, Plane } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Safe & Welcoming',
    description: "Morocco consistently ranks as one of Africa's safest destinations with legendary hospitality.",
  },
  {
    icon: Sun,
    title: 'Year-Round Destination',
    description: 'Mediterranean climate with 300+ sunny days. Perfect weather for travel any season.',
  },
  {
    icon: Landmark,
    title: 'Rich Heritage',
    description: 'UNESCO World Heritage sites, ancient medinas, and a culture dating back millennia.',
  },
  {
    icon: Plane,
    title: 'Easy Access',
    description: 'Just 3 hours from major European cities with visa-free entry for many nationalities.',
  },
];

export const WhyMoroccoSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium text-sm tracking-wider uppercase">
              Why Morocco?
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6 leading-tight">
              A Land Where Dreams{' '}
              <span className="text-gradient-gold">Become Reality</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Morocco is where the mystical meets the modern, where ancient traditions blend 
              seamlessly with contemporary comforts. From the snow-capped Atlas Mountains to 
              the sun-drenched Sahara, every corner tells a story.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you're seeking adventure, relaxation, cultural immersion, or culinary 
              delights, Morocco offers an experience that will touch your soul and leave you 
              forever changed.
            </p>
          </motion.div>

          {/* Right Content - Features */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

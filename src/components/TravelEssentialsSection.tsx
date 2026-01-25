import { motion } from 'framer-motion';
import { Plane, Coins, Languages, Calendar, Wifi, Car } from 'lucide-react';

const essentials = [
  {
    icon: Plane,
    title: 'Getting There',
    description: 'Major airports in Marrakech, Casablanca, and Fes. Direct flights from most European and many international cities.',
  },
  {
    icon: Coins,
    title: 'Currency',
    description: 'Moroccan Dirham (MAD). ATMs widely available. Cards accepted in hotels and major establishments.',
  },
  {
    icon: Languages,
    title: 'Languages',
    description: 'Arabic and Berber are official. French widely spoken. English common in tourist areas.',
  },
  {
    icon: Calendar,
    title: 'Best Time to Visit',
    description: 'March-May and September-November for ideal temperatures. Summer for coast, winter for desert.',
  },
  {
    icon: Wifi,
    title: 'Connectivity',
    description: 'WiFi available in most hotels and cafés. Local SIM cards affordable and easy to purchase.',
  },
  {
    icon: Car,
    title: 'Getting Around',
    description: 'Trains connect major cities. Private drivers, rental cars, and shared taxis for flexibility.',
  },
];

export const TravelEssentialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Travel Essentials
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            Plan Your Journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to know before embarking on your Moroccan adventure.
          </p>
        </motion.div>

        {/* Essentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {essentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

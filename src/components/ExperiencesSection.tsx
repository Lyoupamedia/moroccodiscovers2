import { motion } from 'framer-motion';
import { ArrowRight, Compass, UtensilsCrossed, Mountain, Camera, Palette, Sparkles } from 'lucide-react';

const experiences = [
  {
    icon: Compass,
    title: 'Desert Adventures',
    description: 'Camel treks across Sahara dunes, overnight camps under stars, and 4x4 desert expeditions.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Culinary Journeys',
    description: 'Cooking classes, street food tours, and traditional tagine experiences with local families.',
  },
  {
    icon: Mountain,
    title: 'Atlas Trekking',
    description: 'Guided hikes through Berber villages, mountain passes, and ancient trade routes.',
  },
  {
    icon: Camera,
    title: 'Photography Tours',
    description: 'Capture the perfect shot in photogenic medinas, kasbahs, and dramatic landscapes.',
  },
  {
    icon: Palette,
    title: 'Artisan Workshops',
    description: 'Learn traditional crafts like pottery, zellige tilework, and carpet weaving.',
  },
  {
    icon: Sparkles,
    title: 'Wellness Retreats',
    description: 'Hammam rituals, yoga sessions, and spa treatments in luxurious riads.',
  },
];

const ExperienceCard = ({ experience, index }: { experience: typeof experiences[0]; index: number }) => {
  const Icon = experience.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover-lift"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-heading text-xl font-bold text-foreground mb-3">
        {experience.title}
      </h3>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        {experience.description}
      </p>
      <a href="#" className="inline-flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
        Learn more
        <ArrowRight className="w-4 h-4" />
      </a>
    </motion.div>
  );
};

export const ExperiencesSection = () => {
  return (
    <section id="experiences" className="py-24 bg-sand">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Curated Experiences
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            Unforgettable Moments
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Immerse yourself in authentic Moroccan experiences crafted to create lasting memories 
            and meaningful connections.
          </p>
        </motion.div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.title} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Import destination images
import marrakech from '@/assets/marrakech.jpg';
import chefchaouen from '@/assets/chefchaouen.jpg';
import fes from '@/assets/fes.jpg';
import sahara from '@/assets/sahara.jpg';
import casablanca from '@/assets/casablanca.jpg';
import essaouira from '@/assets/essaouira.jpg';
import tangier from '@/assets/tangier.jpg';
import rabat from '@/assets/rabat.jpg';
import ouarzazate from '@/assets/ouarzazate.jpg';
import atlasMountains from '@/assets/atlas-mountains.jpg';
import aitBenhaddou from '@/assets/ait-benhaddou.jpg';
import agadir from '@/assets/agadir.jpg';

const destinations = [
  { name: 'Marrakech', subtitle: 'The Red City', image: marrakech },
  { name: 'Chefchaouen', subtitle: 'The Blue Pearl', image: chefchaouen },
  { name: 'Fes', subtitle: 'Ancient Medina', image: fes },
  { name: 'Sahara Desert', subtitle: 'Golden Dunes', image: sahara },
  { name: 'Casablanca', subtitle: 'Modern Marvel', image: casablanca },
  { name: 'Essaouira', subtitle: 'Coastal Charm', image: essaouira },
  { name: 'Tangier', subtitle: 'Gateway to Africa', image: tangier },
  { name: 'Rabat', subtitle: 'Royal Capital', image: rabat },
  { name: 'Ouarzazate', subtitle: 'Desert Gateway', image: ouarzazate },
  { name: 'Atlas Mountains', subtitle: 'Mountain Majesty', image: atlasMountains },
  { name: 'Aït Benhaddou', subtitle: 'UNESCO Heritage', image: aitBenhaddou },
  { name: 'Agadir', subtitle: 'Beach Paradise', image: agadir },
];

const DestinationCard = ({ destination }: { destination: typeof destinations[0] }) => {
  return (
    <div className="card-destination group aspect-[4/5]">
      <img
        src={destination.image}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-card-overlay" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-heading text-xl font-bold text-primary-foreground mb-1">
          {destination.name}
        </h3>
        <p className="text-primary-foreground/80 text-sm mb-3">{destination.subtitle}</p>
        <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export const DestinationsSection = () => {
  return (
    <section id="destinations" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Top Destinations
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            Top Destinations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover the most captivating places Morocco has to offer, from ancient medinas 
            to stunning natural wonders.
          </p>
        </motion.div>

        {/* Destinations Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              slidesToScroll: 4,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {destinations.map((destination) => (
                <CarouselItem 
                  key={destination.name} 
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
                >
                  <DestinationCard destination={destination} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
            <CarouselNext className="hidden md:flex -right-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
          </Carousel>
          
          {/* Mobile navigation hint */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            <span className="text-muted-foreground text-sm">Swipe to explore more</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

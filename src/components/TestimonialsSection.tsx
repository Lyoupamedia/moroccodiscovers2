import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const testimonials = [
  {
    quote: "Marrakech exceeded all my expectations. The riad was stunning, and our guide knew every hidden gem in the medina. The cooking class was a highlight!",
    author: 'Sarah Johnson',
    location: 'United States',
    destination: 'Marrakech',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    title: 'Magical experience in the Red City!',
  },
  {
    quote: "From the moment we arrived, we were captivated. The Bahia Palace was breathtaking, and watching sunset from a rooftop cafe was pure magic.",
    author: 'Pierre Dubois',
    location: 'France',
    destination: 'Marrakech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    title: 'Unforgettable cultural immersion',
  },
  {
    quote: "Our riad was an oasis of calm. The Majorelle Garden is a must-see, and the food tour through the medina was absolutely delicious.",
    author: 'Hans Mueller',
    location: 'Germany',
    destination: 'Marrakech',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    title: 'Perfect blend of history and luxury',
  },
  {
    quote: "Every corner is picture-perfect. The blue streets are even more stunning in person. Peaceful, charming, and absolutely magical.",
    author: 'Lisa Chen',
    location: 'Canada',
    destination: 'Chefchaouen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    title: "A photographer's paradise!",
  },
  {
    quote: "After the bustle of Fes, Chefchaouen was the perfect escape. The mountain air, friendly locals, and endless blue made this unforgettable.",
    author: 'Marco Rossi',
    location: 'Italy',
    destination: 'Chefchaouen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    title: 'Most peaceful place in Morocco',
  },
  {
    quote: "Fes is like stepping back in time. Our guide was essential for navigating the medina. The tanneries are incredible to see!",
    author: 'David Thompson',
    location: 'Australia',
    destination: 'Fes',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    title: 'The real Morocco experience',
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border h-full">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg font-bold text-foreground mb-3">
        {testimonial.title}
      </h3>

      {/* Quote */}
      <p className="text-muted-foreground mb-6 leading-relaxed">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-foreground">{testimonial.author}</p>
          <p className="text-muted-foreground text-sm">{testimonial.location}</p>
        </div>
      </div>

      {/* Destination Tag */}
      <div className="mt-4 pt-4 border-t border-border">
        <a href="#" className="text-primary text-sm font-medium hover:underline">
          {testimonial.destination}
        </a>
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-sand">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Traveler Stories
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover authentic experiences through the eyes of travelers who explored Morocco with us
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
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
              slidesToScroll: 2,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {testimonials.map((testimonial, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-6 basis-full md:basis-1/2"
                >
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
            <CarouselNext className="hidden md:flex -right-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
          </Carousel>
          
          {/* Mobile navigation hint */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            <span className="text-muted-foreground text-sm">Swipe to read more stories</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mt-12"
        >
          Join <span className="text-primary font-semibold">2,500+</span> happy travelers who discovered Morocco with us
        </motion.p>
      </div>
    </section>
  );
};

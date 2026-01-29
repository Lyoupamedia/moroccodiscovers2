import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const blogs = [
  {
    title: '10 Must-Visit Hidden Gems in Marrakech',
    excerpt: 'Discover the secret spots that most tourists miss in the Red City. From hidden riads to local markets, explore Marrakech like a local.',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&h=400&fit=crop',
    date: 'January 15, 2026',
    category: 'Travel Tips',
    readTime: '5 min read',
  },
  {
    title: 'The Ultimate Sahara Desert Experience',
    excerpt: 'Everything you need to know about camping under the stars in the Moroccan Sahara. Tips for an unforgettable desert adventure.',
    image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&h=400&fit=crop',
    date: 'January 10, 2026',
    category: 'Adventures',
    readTime: '7 min read',
  },
  {
    title: 'A Food Lover\'s Guide to Moroccan Cuisine',
    excerpt: 'From tagine to couscous, explore the rich flavors of Morocco. Learn about traditional dishes and the best places to try them.',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop',
    date: 'January 5, 2026',
    category: 'Food & Culture',
    readTime: '6 min read',
  },
  {
    title: 'Exploring the Blue Pearl: Chefchaouen Guide',
    excerpt: 'Why is this mountain town painted blue? Uncover the mysteries and beauty of Morocco\'s most photogenic destination.',
    image: 'https://images.unsplash.com/photo-1553522991-71439aa62779?w=600&h=400&fit=crop',
    date: 'December 28, 2025',
    category: 'Destinations',
    readTime: '4 min read',
  },
  {
    title: 'Best Time to Visit Morocco: Season Guide',
    excerpt: 'Planning your trip? Learn about the best seasons to visit different regions of Morocco for the perfect weather and experiences.',
    image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop',
    date: 'December 20, 2025',
    category: 'Travel Tips',
    readTime: '5 min read',
  },
  {
    title: 'Traditional Moroccan Crafts: A Shopping Guide',
    excerpt: 'From leather goods to ceramics, discover the authentic crafts of Morocco and where to find the best artisan products.',
    image: 'https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=600&h=400&fit=crop',
    date: 'December 15, 2025',
    category: 'Shopping',
    readTime: '6 min read',
  },
];

const BlogCard = ({ blog }: { blog: typeof blogs[0] }) => {
  return (
    <div className="group rounded-2xl overflow-hidden bg-card border border-border h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{blog.date}</span>
          </div>
          <span>•</span>
          <span>{blog.readTime}</span>
        </div>

        <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>

        <p className="text-muted-foreground mb-4 flex-grow">
          {blog.excerpt}
        </p>

        <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
          <span>Read More</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export const BlogsSection = () => {
  return (
    <section id="blogs" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase">
            Travel Blog
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            Stories & Travel Tips
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Get inspired with our latest travel stories, tips, and guides to help you plan your perfect Moroccan adventure
          </p>
        </motion.div>

        {/* Blogs Carousel */}
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
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {blogs.map((blog, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-6 basis-full md:basis-1/2"
                >
                  <BlogCard blog={blog} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
            <CarouselNext className="hidden md:flex -right-12 bg-primary text-primary-foreground hover:bg-primary/90 border-none" />
          </Carousel>
          
          {/* Mobile navigation hint */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            <span className="text-muted-foreground text-sm">Swipe to read more articles</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

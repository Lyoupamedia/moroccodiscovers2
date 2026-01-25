import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Sparkles, Send } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const destinations = [
  'Marrakech',
  'Chefchaouen',
  'Fes',
  'Sahara Desert',
  'Casablanca',
  'Essaouira',
  'Tangier',
  'Rabat',
  'Ouarzazate',
  'Atlas Mountains',
  'Ait Benhaddou',
  'Agadir',
];

const interests = [
  { id: 'culture', label: 'Culture & History' },
  { id: 'adventure', label: 'Adventure & Trekking' },
  { id: 'food', label: 'Food & Cuisine' },
  { id: 'relaxation', label: 'Relaxation & Wellness' },
  { id: 'photography', label: 'Photography' },
  { id: 'shopping', label: 'Shopping & Souks' },
];

const formSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Please enter a valid email').max(255, 'Email must be less than 255 characters'),
  destinations: z.array(z.string()).min(1, 'Please select at least one destination'),
  arrivalDate: z.date({ required_error: 'Please select an arrival date' }),
  departureDate: z.date({ required_error: 'Please select a departure date' }),
  travelers: z.string().min(1, 'Please select number of travelers'),
  budget: z.string().min(1, 'Please select a budget range'),
  interests: z.array(z.string()).optional(),
  specialRequests: z.string().max(1000, 'Special requests must be less than 1000 characters').optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const TripPlannerForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      destinations: [],
      travelers: '',
      budget: '',
      interests: [],
      specialRequests: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Quote Request Submitted!",
      description: "We'll get back to you within 24 hours with your personalized trip quote.",
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  const selectedDestinations = form.watch('destinations');

  const toggleDestination = (destination: string) => {
    const current = form.getValues('destinations');
    if (current.includes(destination)) {
      form.setValue('destinations', current.filter(d => d !== destination), { shouldValidate: true });
    } else {
      form.setValue('destinations', [...current, destination], { shouldValidate: true });
    }
  };

  return (
    <section id="plan-trip" className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Plan Your <span className="text-primary">Dream Trip</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tell us about your ideal Moroccan adventure and we'll create a personalized itinerary just for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-10 border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            {...field} 
                            className="bg-background border-input focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            {...field}
                            className="bg-background border-input focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Destinations */}
                <FormField
                  control={form.control}
                  name="destinations"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Select Destinations
                      </FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        {destinations.map((destination) => (
                          <button
                            key={destination}
                            type="button"
                            onClick={() => toggleDestination(destination)}
                            className={cn(
                              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                              selectedDestinations.includes(destination)
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-background text-foreground border-input hover:border-primary hover:bg-primary/5"
                            )}
                          >
                            {destination}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="arrivalDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Arrival Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-background",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : "Select date"}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Departure Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-background",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : "Select date"}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const arrivalDate = form.getValues('arrivalDate');
                                return date < new Date() || (arrivalDate && date <= arrivalDate);
                              }}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Travelers & Budget */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="travelers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          Number of Travelers
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select travelers" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Solo traveler</SelectItem>
                            <SelectItem value="2">2 travelers</SelectItem>
                            <SelectItem value="3-4">3-4 travelers</SelectItem>
                            <SelectItem value="5-6">5-6 travelers</SelectItem>
                            <SelectItem value="7+">7+ travelers (group)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Budget Range (per person)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="budget">Budget ($50-100/day)</SelectItem>
                            <SelectItem value="mid-range">Mid-range ($100-200/day)</SelectItem>
                            <SelectItem value="comfort">Comfort ($200-350/day)</SelectItem>
                            <SelectItem value="luxury">Luxury ($350+/day)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Interests */}
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Travel Interests (optional)
                      </FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                        {interests.map((interest) => (
                          <FormField
                            key={interest.id}
                            control={form.control}
                            name="interests"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(interest.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, interest.id]);
                                      } else {
                                        field.onChange(current.filter(v => v !== interest.id));
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal text-foreground cursor-pointer">
                                  {interest.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                {/* Special Requests */}
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Special Requests or Questions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about any specific experiences you'd like, dietary requirements, accessibility needs, or any questions..."
                          className="bg-background border-input focus:border-primary min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Get Your Personalized Quote
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  We'll respond within 24 hours with a customized itinerary and quote.
                </p>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Users, Heart, Award, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Morocco',
      description: 'We are deeply passionate about sharing the beauty, culture, and traditions of Morocco with travelers from around the world.'
    },
    {
      icon: Users,
      title: 'Personal Touch',
      description: 'Every trip is crafted with care and attention to detail, ensuring personalized experiences that match your unique preferences.'
    },
    {
      icon: Award,
      title: 'Local Expertise',
      description: 'Our team consists of local experts who know Morocco inside and out, from hidden gems to iconic landmarks.'
    },
    {
      icon: Globe,
      title: 'Sustainable Travel',
      description: 'We are committed to responsible tourism that benefits local communities and preserves Morocco\'s natural and cultural heritage.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Morocco Discovers
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your gateway to authentic Moroccan experiences. We specialize in creating unforgettable journeys 
              through one of the world's most fascinating destinations.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Our Story */}
          <section className="mb-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Morocco Discovers was founded with a simple yet powerful vision: to share the magic of Morocco 
                with travelers seeking authentic, immersive experiences. Born from a deep love for this enchanting 
                North African kingdom, we set out to create journeys that go beyond typical tourism.
              </p>
              <p>
                From the bustling souks of Marrakech to the serene blue streets of Chefchaouen, from the golden 
                dunes of the Sahara to the rugged peaks of the Atlas Mountains, Morocco offers a tapestry of 
                experiences unlike anywhere else on Earth. Our mission is to help you discover each thread 
                of this magnificent tapestry.
              </p>
              <p>
                Today, Morocco Discovers has helped thousands of travelers create lasting memories in Morocco. 
                Whether you're seeking adventure, relaxation, cultural immersion, or all of the above, 
                we're here to make your Moroccan dream a reality.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Why Choose Us</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Expert Local Knowledge:</strong> Our team lives and breathes Morocco. We know the best 
                  times to visit each destination, the hidden restaurants with the most authentic tagine, 
                  and the secret viewpoints for stunning photographs.
                </li>
                <li>
                  <strong>Customized Itineraries:</strong> No two travelers are alike, and neither are our trips. 
                  We work closely with you to design an itinerary that matches your interests, pace, and budget.
                </li>
                <li>
                  <strong>24/7 Support:</strong> From the moment you book until you return home, our team is 
                  available to assist you with any questions or needs that arise during your journey.
                </li>
                <li>
                  <strong>Quality Partnerships:</strong> We've built relationships with the finest hotels, 
                  riads, guides, and drivers across Morocco to ensure you receive exceptional service at every turn.
                </li>
                <li>
                  <strong>Transparent Pricing:</strong> We believe in honest, upfront pricing with no hidden fees. 
                  What we quote is what you pay.
                </li>
              </ul>
            </div>
          </section>

          {/* Our Team */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Our Team</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Our team is composed of passionate travel professionals, many of whom are native Moroccans 
                who have grown up experiencing the country's rich traditions and diverse landscapes. 
                Combined with international team members who fell in love with Morocco and never left, 
                we bring a unique blend of local insight and global perspective to every trip we plan.
              </p>
              <p>
                We speak multiple languages including Arabic, French, English, Spanish, and Berber, 
                ensuring clear communication and cultural connection throughout your journey.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

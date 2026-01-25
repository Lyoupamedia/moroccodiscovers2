import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { DestinationsSection } from '@/components/DestinationsSection';
import { ExperiencesSection } from '@/components/ExperiencesSection';
import { WhyMoroccoSection } from '@/components/WhyMoroccoSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { TravelEssentialsSection } from '@/components/TravelEssentialsSection';
import { TripPlannerForm } from '@/components/TripPlannerForm';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <DestinationsSection />
      <ExperiencesSection />
      <WhyMoroccoSection />
      <TestimonialsSection />
      <TravelEssentialsSection />
      <TripPlannerForm />
      <CTASection />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;

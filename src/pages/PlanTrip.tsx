import { Header } from '@/components/Header';
import { TripPlannerForm } from '@/components/TripPlannerForm';
import { Footer } from '@/components/Footer';

const PlanTrip = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <TripPlannerForm />
      </div>
      <Footer />
    </div>
  );
};

export default PlanTrip;

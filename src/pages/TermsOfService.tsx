import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              <strong>Last updated:</strong> January 26, 2026
            </p>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">1. Agreement to Terms</h2>
              <p>
                By accessing and using the Morocco Discovers website, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">2. Use License</h2>
              <p>
                Permission is granted to temporarily view the materials (information or software) on Morocco Discovers' 
                website for personal, non-commercial transitory viewing only. This is the grant of a license, not a 
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">3. Services Description</h2>
              <p>
                Morocco Discovers provides travel planning and consultation services for trips to Morocco. 
                Our services include but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Trip planning and itinerary creation</li>
                <li>Travel information and destination guides</li>
                <li>Quote requests for customized travel packages</li>
                <li>Travel tips and recommendations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">4. User Responsibilities</h2>
              <p>As a user of our website, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information when making inquiries</li>
                <li>Use the website only for lawful purposes</li>
                <li>Not engage in any activity that interferes with or disrupts the website</li>
                <li>Not attempt to gain unauthorized access to any portion of the website</li>
                <li>Comply with all applicable local, national, and international laws</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">5. Booking and Payments</h2>
              <p>
                When you submit a trip request through our website, you are expressing interest in our services. 
                This does not constitute a binding contract until we confirm your booking and receive the required deposit 
                or payment as specified in our booking confirmation.
              </p>
              <p>
                All prices are subject to change without notice. We reserve the right to modify prices for services 
                not yet booked or confirmed.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">6. Intellectual Property</h2>
              <p>
                The content on this website, including but not limited to text, graphics, images, logos, and software, 
                is the property of Morocco Discovers or its content suppliers and is protected by international copyright laws. 
                The compilation of all content on this site is the exclusive property of Morocco Discovers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">7. Disclaimer</h2>
              <p>
                The materials on Morocco Discovers' website are provided on an 'as is' basis. Morocco Discovers makes 
                no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, 
                without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
                or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">8. Limitations</h2>
              <p>
                In no event shall Morocco Discovers or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use the materials on Morocco Discovers' website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">9. Links to Third-Party Sites</h2>
              <p>
                Our website may contain links to third-party websites or services that are not owned or controlled by 
                Morocco Discovers. We have no control over, and assume no responsibility for, the content, privacy policies, 
                or practices of any third-party websites or services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">10. Modifications</h2>
              <p>
                Morocco Discovers may revise these Terms of Service at any time without notice. By using this website, 
                you are agreeing to be bound by the then current version of these Terms of Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">11. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Morocco, 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">12. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> hello@moroccodiscovers.com</li>
                <li><strong>Address:</strong> Marrakech, Morocco</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;

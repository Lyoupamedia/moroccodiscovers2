import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              <strong>Last updated:</strong> January 26, 2026
            </p>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">1. Introduction</h2>
              <p>
                Welcome to Morocco Discovers. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">2. Information We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> first name, last name, username or similar identifier</li>
                <li><strong>Contact Data:</strong> email address, telephone numbers, billing address</li>
                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, operating system</li>
                <li><strong>Usage Data:</strong> information about how you use our website and services</li>
                <li><strong>Marketing Data:</strong> your preferences in receiving marketing from us</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">3. How We Use Your Information</h2>
              <p>We use your personal data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process your trip requests and bookings</li>
                <li>To communicate with you about your inquiries</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">4. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                Cookies are files with small amounts of data which may include an anonymous unique identifier.
              </p>
              <p>
                We use both session cookies (which expire when you close your browser) and persistent cookies 
                (which remain on your device until deleted). We also use third-party cookies for analytics and advertising purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">5. Third-Party Advertising</h2>
              <p>
                We may use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. 
                These companies may use information about your visits to this and other websites to provide advertisements 
                about goods and services of interest to you.
              </p>
              <p>
                Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie 
                enables it to serve ads based on your visit to our site and other sites on the Internet. 
                You may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">6. Data Security</h2>
              <p>
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
                used, accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those 
                employees, agents, contractors, and other third parties who have a business need to know.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">7. Your Rights</h2>
              <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to request access to your personal data</li>
                <li>The right to request correction of your personal data</li>
                <li>The right to request erasure of your personal data</li>
                <li>The right to object to processing of your personal data</li>
                <li>The right to request restriction of processing your personal data</li>
                <li>The right to data portability</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;

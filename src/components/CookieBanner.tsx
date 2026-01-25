import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-lg z-50"
      >
        <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-heading font-bold text-foreground flex items-center gap-2">
                  We Value Your Privacy 🍪
                </h4>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm mt-2 mb-4 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized ads or content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                Read our <a href="#" className="text-primary hover:underline">Privacy Policy</a> to learn more.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  onClick={() => setIsVisible(false)}
                >
                  Accept All Cookies
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => setIsVisible(false)}
                >
                  Necessary Only
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full"
                  onClick={() => setIsVisible(false)}
                >
                  Cookie Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

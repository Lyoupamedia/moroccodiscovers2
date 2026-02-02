import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CMSSiteProvider } from "@/hooks/useCMSSite";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";

// Public Pages
import Index from "./pages/Index";
import PlanTrip from "./pages/PlanTrip";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";

// Legacy Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTripRequests from "./pages/admin/AdminTripRequests";
import AdminDestinations from "./pages/admin/AdminDestinations";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import AdminSettings from "./pages/admin/AdminSettings";

// CMS Pages
import CMSDashboard from "./pages/cms/CMSDashboard";
import CMSPages from "./pages/cms/CMSPages";
import CMSPageEditor from "./pages/cms/CMSPageEditor";
import CMSPosts from "./pages/cms/CMSPosts";
import CMSPostEditor from "./pages/cms/CMSPostEditor";
import CMSMedia from "./pages/cms/CMSMedia";
import CMSMenus from "./pages/cms/CMSMenus";
import CMSUsers from "./pages/cms/CMSUsers";
import CMSDatabase from "./pages/cms/CMSDatabase";
import CMSSettings from "./pages/cms/CMSSettings";
import CMSNewSite from "./pages/cms/CMSNewSite";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CMSSiteProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AnalyticsScripts />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/plan-trip" element={<PlanTrip />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* CMS Routes */}
              <Route path="/cms" element={<CMSDashboard />} />
              <Route path="/cms/pages" element={<CMSPages />} />
              <Route path="/cms/pages/new" element={<CMSPageEditor />} />
              <Route path="/cms/pages/:id" element={<CMSPageEditor />} />
              <Route path="/cms/posts" element={<CMSPosts />} />
              <Route path="/cms/posts/new" element={<CMSPostEditor />} />
              <Route path="/cms/posts/:id" element={<CMSPostEditor />} />
              <Route path="/cms/media" element={<CMSMedia />} />
              <Route path="/cms/menus" element={<CMSMenus />} />
              <Route path="/cms/users" element={<CMSUsers />} />
              <Route path="/cms/database" element={<CMSDatabase />} />
              <Route path="/cms/settings" element={<CMSSettings />} />
              <Route path="/cms/sites/new" element={<CMSNewSite />} />
              
              {/* Legacy Admin Routes (keeping for backwards compatibility) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/trip-requests" element={<AdminTripRequests />} />
              <Route path="/admin/destinations" element={<AdminDestinations />} />
              <Route path="/admin/blogs" element={<AdminBlogs />} />
              <Route path="/admin/integrations" element={<AdminIntegrations />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CMSSiteProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

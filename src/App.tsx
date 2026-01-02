import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudioHub from "./pages/StudioHub";
import DocumentStudio from "./pages/DocumentStudio";
import ImageStudio from "./pages/ImageStudio";
import DeveloperStudio from "./pages/DeveloperStudio";
import MediaStudio from "./pages/MediaStudio";
import DesktopPage from "./pages/DesktopPage";
import PricingPage from "./pages/PricingPage";
import DocsPage from "./pages/DocsPage";
import SignInPage from "./pages/SignInPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import TermsPage from "./pages/TermsPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Public studio hub - can browse without login */}
            <Route path="/studio" element={<StudioHub />} />
            {/* Studios are now public - download requires login */}
            <Route path="/studio/documents" element={<DocumentStudio />} />
            <Route path="/studio/images" element={<ImageStudio />} />
            <Route path="/studio/developer" element={
              <ProtectedRoute>
                <DeveloperStudio />
              </ProtectedRoute>
            } />
            <Route path="/studio/media" element={
              <ProtectedRoute>
                <MediaStudio />
              </ProtectedRoute>
            } />
            <Route path="/desktop" element={<DesktopPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/refund" element={<RefundPolicyPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

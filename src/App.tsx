import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
            <Route path="/studio" element={<StudioHub />} />
            <Route path="/studio/documents" element={<DocumentStudio />} />
            <Route path="/studio/images" element={<ImageStudio />} />
            <Route path="/studio/developer" element={<DeveloperStudio />} />
            <Route path="/studio/media" element={<MediaStudio />} />
            <Route path="/desktop" element={<DesktopPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

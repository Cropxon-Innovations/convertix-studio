import { Link } from "react-router-dom";
import { ConvertixLogo } from "@/components/ui/ConvertixLogo";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <ConvertixLogo size="md" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              A persistent conversion studio for documents, images, and data. 
              Where work continues, not disappears.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/studio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Studio
              </Link>
              <Link to="/desktop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Desktop App
              </Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Refund Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CropXon. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/refund" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

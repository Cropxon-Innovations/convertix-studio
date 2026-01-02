import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-foreground">Convertix</span>
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase">by CropXon</span>
              </div>
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
            <h4 className="text-sm font-medium text-foreground mb-4">Studios</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/studio/documents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Document Studio
              </Link>
              <Link to="/studio/images" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Image Studio
              </Link>
              <Link to="/studio/developer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Developer Studio
              </Link>
              <Link to="/studio/media" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Media Studio
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CropXon. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

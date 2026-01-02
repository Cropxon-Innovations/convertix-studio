import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Image, Code, Video, ArrowLeft, User } from "lucide-react";

const studioNavItems = [
  { label: "Documents", href: "/studio/documents", icon: FileText },
  { label: "Images", href: "/studio/images", icon: Image },
  { label: "Developer", href: "/studio/developer", icon: Code },
  { label: "Media", href: "/studio/media", icon: Video },
];

interface StudioLayoutProps {
  children: ReactNode;
}

export const StudioLayout = ({ children }: StudioLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Studio Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">Home</span>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <Link to="/studio" className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">
                CONVERTIX
              </span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-accent">
                Studio
              </span>
            </Link>
          </div>

          {/* Studio Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {studioNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/signin" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Studio Navigation */}
        <div className="md:hidden border-t border-border/50 overflow-x-auto">
          <nav className="flex items-center gap-1 px-4 py-2">
            {studioNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-md whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
};

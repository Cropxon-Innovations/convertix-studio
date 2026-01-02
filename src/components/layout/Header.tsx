import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, ChevronDown, FileText, Image, Code, Video } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ConvertixLogo } from "@/components/ui/ConvertixLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// Document Studio tools
const documentTools = [
  { category: "Organize", tools: [
    { label: "Merge PDF", href: "/studio/documents?tool=merge" },
    { label: "Split PDF", href: "/studio/documents?tool=split" },
    { label: "Remove Pages", href: "/studio/documents?tool=remove-pages" },
    { label: "Extract Pages", href: "/studio/documents?tool=extract-pages" },
    { label: "Organize PDF", href: "/studio/documents?tool=organize" },
  ]},
  { category: "Optimize", tools: [
    { label: "Compress PDF", href: "/studio/documents?tool=compress" },
    { label: "Repair PDF", href: "/studio/documents?tool=repair" },
    { label: "OCR PDF", href: "/studio/documents?tool=ocr" },
  ]},
  { category: "Convert to PDF", tools: [
    { label: "JPG to PDF", href: "/studio/documents?tool=jpg-to-pdf" },
    { label: "Word to PDF", href: "/studio/documents?tool=word-to-pdf" },
    { label: "PowerPoint to PDF", href: "/studio/documents?tool=ppt-to-pdf" },
    { label: "Excel to PDF", href: "/studio/documents?tool=excel-to-pdf" },
    { label: "HTML to PDF", href: "/studio/documents?tool=html-to-pdf" },
  ]},
  { category: "Convert from PDF", tools: [
    { label: "PDF to JPG", href: "/studio/documents?tool=pdf-to-jpg" },
    { label: "PDF to Word", href: "/studio/documents?tool=pdf-to-word" },
    { label: "PDF to PowerPoint", href: "/studio/documents?tool=pdf-to-ppt" },
    { label: "PDF to Excel", href: "/studio/documents?tool=pdf-to-excel" },
  ]},
  { category: "Edit", tools: [
    { label: "Rotate PDF", href: "/studio/documents?tool=rotate" },
    { label: "Add Page Numbers", href: "/studio/documents?tool=add-page-numbers" },
    { label: "Add Watermark", href: "/studio/documents?tool=add-watermark" },
    { label: "Crop PDF", href: "/studio/documents?tool=crop" },
    { label: "Edit PDF", href: "/studio/documents?tool=edit-pdf" },
  ]},
  { category: "Security", tools: [
    { label: "Unlock PDF", href: "/studio/documents?tool=unlock" },
    { label: "Protect PDF", href: "/studio/documents?tool=protect" },
    { label: "Sign PDF", href: "/studio/documents?tool=sign" },
    { label: "Redact PDF", href: "/studio/documents?tool=redact" },
    { label: "Compare PDF", href: "/studio/documents?tool=compare" },
  ]},
];

// Image Studio tools
const imageTools = [
  { category: "Optimize", tools: [
    { label: "Compress Image", href: "/studio/images?tool=compress" },
    { label: "Resize Image", href: "/studio/images?tool=resize" },
    { label: "Upscale Image (AI)", href: "/studio/images?tool=upscale" },
  ]},
  { category: "Edit", tools: [
    { label: "Crop Image", href: "/studio/images?tool=crop" },
    { label: "Rotate Image", href: "/studio/images?tool=rotate" },
    { label: "Remove Background", href: "/studio/images?tool=remove-bg" },
    { label: "Add Watermark", href: "/studio/images?tool=watermark" },
    { label: "Blur Faces", href: "/studio/images?tool=blur-face" },
    { label: "Photo Editor", href: "/studio/images?tool=photo-editor" },
  ]},
  { category: "Convert", tools: [
    { label: "Convert to JPG", href: "/studio/images?tool=to-jpg" },
    { label: "Convert from JPG", href: "/studio/images?tool=from-jpg" },
    { label: "Convert to PNG", href: "/studio/images?tool=to-png" },
    { label: "Convert to WebP", href: "/studio/images?tool=to-webp" },
    { label: "HTML to Image", href: "/studio/images?tool=html-to-image" },
  ]},
  { category: "Create", tools: [
    { label: "Meme Generator", href: "/studio/images?tool=meme" },
    { label: "Batch Process", href: "/studio/images?tool=batch" },
  ]},
];

const navItems = [
  { label: "Desktop", href: "/desktop" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <ConvertixLogo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Studio Hub Link */}
          <Link
            to="/studio"
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${
              location.pathname === "/studio"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Studio
          </Link>
          
          {/* Document Studio Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                <FileText className="h-4 w-4" />
                Documents
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-[70vh] overflow-y-auto">
              {documentTools.map((category) => (
                <DropdownMenuGroup key={category.category}>
                  <DropdownMenuLabel className="text-xs text-primary">{category.category}</DropdownMenuLabel>
                  {category.tools.map((tool) => (
                    <DropdownMenuItem key={tool.href} onClick={() => navigate(tool.href)}>
                      {tool.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Image Studio Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                <Image className="h-4 w-4" />
                Images
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-[70vh] overflow-y-auto">
              {imageTools.map((category) => (
                <DropdownMenuGroup key={category.category}>
                  <DropdownMenuLabel className="text-xs text-primary">{category.category}</DropdownMenuLabel>
                  {category.tools.map((tool) => (
                    <DropdownMenuItem key={tool.href} onClick={() => navigate(tool.href)}>
                      {tool.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${
                location.pathname.startsWith(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          ) : user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/studio">Open Studio</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background max-h-[80vh] overflow-y-auto">
          <nav className="container py-4 flex flex-col gap-2">
            <Link
              to="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent"
            >
              Studio Hub
            </Link>
            <Link
              to="/studio/documents"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Document Studio
            </Link>
            <Link
              to="/studio/images"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Image Studio
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent ${
                  location.pathname.startsWith(item.href)
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50 mt-2">
              {loading ? (
                <div className="h-8 w-full bg-muted animate-pulse rounded" />
              ) : user ? (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-start">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-start">
                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/studio" onClick={() => setMobileMenuOpen(false)}>
                      Open Studio
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, LogOut, User, ChevronDown, 
  FileText, Image, Layers, Scissors, FileX, FileSearch, Minimize2, FileCheck, Type,
  FileImage, Presentation, FileSpreadsheet, Code,
  RotateCw, Hash, Droplet, Crop, PenTool, Unlock, Shield, Eye, GitCompare,
  Maximize2, ArrowUpCircle, Wand2, Sparkles, ImagePlus, Clapperboard
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ConvertixLogo } from "@/components/ui/ConvertixLogo";

// Document Studio tools with icons matching reference
const documentCategories = [
  { 
    title: "ORGANIZE PDF", 
    tools: [
      { label: "Merge PDF", href: "/studio/documents?tool=merge", icon: Layers, color: "text-orange-500" },
      { label: "Split PDF", href: "/studio/documents?tool=split", icon: Scissors, color: "text-orange-500" },
      { label: "Remove pages", href: "/studio/documents?tool=remove-pages", icon: FileX, color: "text-orange-500" },
      { label: "Extract pages", href: "/studio/documents?tool=extract-pages", icon: FileSearch, color: "text-orange-500" },
      { label: "Organize PDF", href: "/studio/documents?tool=organize", icon: Layers, color: "text-orange-500" },
    ]
  },
  { 
    title: "OPTIMIZE PDF", 
    tools: [
      { label: "Compress PDF", href: "/studio/documents?tool=compress", icon: Minimize2, color: "text-red-500" },
      { label: "Repair PDF", href: "/studio/documents?tool=repair", icon: FileCheck, color: "text-red-500" },
      { label: "OCR PDF", href: "/studio/documents?tool=ocr", icon: Type, color: "text-red-500" },
    ]
  },
  { 
    title: "CONVERT TO PDF", 
    tools: [
      { label: "JPG to PDF", href: "/studio/documents?tool=jpg-to-pdf", icon: FileImage, color: "text-yellow-500" },
      { label: "WORD to PDF", href: "/studio/documents?tool=word-to-pdf", icon: FileText, color: "text-blue-500" },
      { label: "POWERPOINT to PDF", href: "/studio/documents?tool=ppt-to-pdf", icon: Presentation, color: "text-orange-600" },
      { label: "EXCEL to PDF", href: "/studio/documents?tool=excel-to-pdf", icon: FileSpreadsheet, color: "text-green-600" },
      { label: "HTML to PDF", href: "/studio/documents?tool=html-to-pdf", icon: Code, color: "text-purple-500" },
    ]
  },
  { 
    title: "CONVERT FROM PDF", 
    tools: [
      { label: "PDF to JPG", href: "/studio/documents?tool=pdf-to-jpg", icon: FileImage, color: "text-yellow-500" },
      { label: "PDF to WORD", href: "/studio/documents?tool=pdf-to-word", icon: FileText, color: "text-blue-500" },
      { label: "PDF to POWERPOINT", href: "/studio/documents?tool=pdf-to-ppt", icon: Presentation, color: "text-orange-600" },
      { label: "PDF to EXCEL", href: "/studio/documents?tool=pdf-to-excel", icon: FileSpreadsheet, color: "text-green-600" },
    ]
  },
  { 
    title: "EDIT PDF", 
    tools: [
      { label: "Rotate PDF", href: "/studio/documents?tool=rotate", icon: RotateCw, color: "text-teal-500" },
      { label: "Add page numbers", href: "/studio/documents?tool=add-page-numbers", icon: Hash, color: "text-teal-500" },
      { label: "Add watermark", href: "/studio/documents?tool=add-watermark", icon: Droplet, color: "text-teal-500" },
      { label: "Crop PDF", href: "/studio/documents?tool=crop", icon: Crop, color: "text-teal-500" },
      { label: "Edit PDF", href: "/studio/documents?tool=edit-pdf", icon: PenTool, color: "text-teal-500" },
    ]
  },
  { 
    title: "PDF SECURITY", 
    tools: [
      { label: "Unlock PDF", href: "/studio/documents?tool=unlock", icon: Unlock, color: "text-green-500" },
      { label: "Protect PDF", href: "/studio/documents?tool=protect", icon: Shield, color: "text-green-500" },
      { label: "Sign PDF", href: "/studio/documents?tool=sign", icon: PenTool, color: "text-green-500" },
      { label: "Redact PDF", href: "/studio/documents?tool=redact", icon: Eye, color: "text-green-500" },
      { label: "Compare PDF", href: "/studio/documents?tool=compare", icon: GitCompare, color: "text-green-500" },
    ]
  },
];

// Image Studio tools
const imageCategories = [
  { 
    title: "OPTIMIZE", 
    tools: [
      { label: "Compress Image", href: "/studio/images?tool=compress", icon: Minimize2, color: "text-blue-500" },
      { label: "Resize Image", href: "/studio/images?tool=resize", icon: Maximize2, color: "text-blue-500" },
      { label: "Upscale Image (AI)", href: "/studio/images?tool=upscale", icon: ArrowUpCircle, color: "text-purple-500" },
    ]
  },
  { 
    title: "EDIT", 
    tools: [
      { label: "Crop Image", href: "/studio/images?tool=crop", icon: Crop, color: "text-teal-500" },
      { label: "Rotate Image", href: "/studio/images?tool=rotate", icon: RotateCw, color: "text-teal-500" },
      { label: "Remove Background", href: "/studio/images?tool=remove-bg", icon: Wand2, color: "text-pink-500" },
      { label: "Add Watermark", href: "/studio/images?tool=watermark", icon: Droplet, color: "text-teal-500" },
      { label: "Blur Faces", href: "/studio/images?tool=blur-face", icon: Eye, color: "text-teal-500" },
      { label: "Photo Editor", href: "/studio/images?tool=photo-editor", icon: Sparkles, color: "text-purple-500" },
    ]
  },
  { 
    title: "CONVERT", 
    tools: [
      { label: "Convert to JPG", href: "/studio/images?tool=to-jpg", icon: FileImage, color: "text-yellow-500" },
      { label: "Convert from JPG", href: "/studio/images?tool=from-jpg", icon: FileImage, color: "text-yellow-500" },
      { label: "Convert to PNG", href: "/studio/images?tool=to-png", icon: FileImage, color: "text-blue-400" },
      { label: "Convert to WebP", href: "/studio/images?tool=to-webp", icon: FileImage, color: "text-green-500" },
      { label: "HTML to Image", href: "/studio/images?tool=html-to-image", icon: Code, color: "text-purple-500" },
    ]
  },
  { 
    title: "CREATE", 
    tools: [
      { label: "Meme Generator", href: "/studio/images?tool=meme", icon: ImagePlus, color: "text-orange-500" },
      { label: "Batch Process", href: "/studio/images?tool=batch", icon: Clapperboard, color: "text-indigo-500" },
    ]
  },
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
  const [showDocumentsMenu, setShowDocumentsMenu] = useState(false);
  const [showImagesMenu, setShowImagesMenu] = useState(false);
  const documentsRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const { user, signOut, loading } = useAuth();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (documentsRef.current && !documentsRef.current.contains(e.target as Node)) {
        setShowDocumentsMenu(false);
      }
      if (imagesRef.current && !imagesRef.current.contains(e.target as Node)) {
        setShowImagesMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const handleToolClick = (href: string) => {
    navigate(href);
    setShowDocumentsMenu(false);
    setShowImagesMenu(false);
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
          {/* Documents Mega Menu */}
          <div ref={documentsRef} className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-1"
              onMouseEnter={() => setShowDocumentsMenu(true)}
              onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}
            >
              <FileText className="h-4 w-4 text-red-500" />
              Documents
              <ChevronDown className={`h-3 w-3 transition-transform ${showDocumentsMenu ? "rotate-180" : ""}`} />
            </Button>
            
            {showDocumentsMenu && (
              <div 
                className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl p-6 z-50"
                style={{ width: "min(90vw, 900px)" }}
                onMouseLeave={() => setShowDocumentsMenu(false)}
              >
                <div className="grid grid-cols-6 gap-6">
                  {documentCategories.map((category) => (
                    <div key={category.title}>
                      <h3 className="text-xs font-semibold text-muted-foreground mb-3 tracking-wider">
                        {category.title}
                      </h3>
                      <ul className="space-y-2">
                        {category.tools.map((tool) => (
                          <li key={tool.href}>
                            <button
                              onClick={() => handleToolClick(tool.href)}
                              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors w-full text-left"
                            >
                              <tool.icon className={`h-4 w-4 ${tool.color}`} />
                              <span className="whitespace-nowrap">{tool.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images Mega Menu */}
          <div ref={imagesRef} className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-1"
              onMouseEnter={() => setShowImagesMenu(true)}
              onClick={() => setShowImagesMenu(!showImagesMenu)}
            >
              <Image className="h-4 w-4 text-blue-500" />
              Images
              <ChevronDown className={`h-3 w-3 transition-transform ${showImagesMenu ? "rotate-180" : ""}`} />
            </Button>
            
            {showImagesMenu && (
              <div 
                className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl p-6 z-50"
                style={{ width: "min(90vw, 600px)" }}
                onMouseLeave={() => setShowImagesMenu(false)}
              >
                <div className="grid grid-cols-4 gap-6">
                  {imageCategories.map((category) => (
                    <div key={category.title}>
                      <h3 className="text-xs font-semibold text-muted-foreground mb-3 tracking-wider">
                        {category.title}
                      </h3>
                      <ul className="space-y-2">
                        {category.tools.map((tool) => (
                          <li key={tool.href}>
                            <button
                              onClick={() => handleToolClick(tool.href)}
                              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors w-full text-left"
                            >
                              <tool.icon className={`h-4 w-4 ${tool.color}`} />
                              <span className="whitespace-nowrap">{tool.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
              to="/studio/documents"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-red-500" />
              Document Studio
            </Link>
            <Link
              to="/studio/images"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent flex items-center gap-2"
            >
              <Image className="h-4 w-4 text-blue-500" />
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

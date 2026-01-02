import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, LogOut, User, ChevronDown, ChevronRight,
  FileText, Image, Layers, Scissors, FileX, FileSearch, Minimize2, FileCheck, Type,
  FileImage, Presentation, FileSpreadsheet, Code,
  RotateCw, Hash, Droplet, Crop, PenTool, Unlock, Shield, Eye, GitCompare,
  Maximize2, ArrowUpCircle, Wand2, Sparkles, ImagePlus, Clapperboard, SplitSquareHorizontal
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ConvertixLogo } from "@/components/ui/ConvertixLogo";

// Document Studio tools with icons matching reference
const documentCategories = [
  { 
    title: "Organize PDF", 
    color: "bg-orange-500/10",
    iconColor: "text-orange-500",
    borderColor: "border-orange-500/20",
    tools: [
      { label: "Merge PDF", href: "/studio/documents?tool=merge", icon: Layers, description: "Combine multiple PDFs" },
      { label: "Split PDF", href: "/studio/documents?tool=split", icon: SplitSquareHorizontal, description: "Separate PDF pages" },
      { label: "Remove pages", href: "/studio/documents?tool=remove-pages", icon: FileX, description: "Delete specific pages" },
      { label: "Extract pages", href: "/studio/documents?tool=extract-pages", icon: FileSearch, description: "Extract as new PDF" },
      { label: "Organize PDF", href: "/studio/documents?tool=organize", icon: Layers, description: "Reorder & rotate" },
    ]
  },
  { 
    title: "Optimize PDF", 
    color: "bg-red-500/10",
    iconColor: "text-red-500",
    borderColor: "border-red-500/20",
    tools: [
      { label: "Compress PDF", href: "/studio/documents?tool=compress", icon: Minimize2, description: "Reduce file size" },
      { label: "Repair PDF", href: "/studio/documents?tool=repair", icon: FileCheck, description: "Fix corrupted files" },
      { label: "OCR PDF", href: "/studio/documents?tool=ocr", icon: Type, description: "Make searchable" },
    ]
  },
  { 
    title: "Convert to PDF", 
    color: "bg-amber-500/10",
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/20",
    tools: [
      { label: "JPG to PDF", href: "/studio/documents?tool=jpg-to-pdf", icon: FileImage, description: "Images to PDF" },
      { label: "Word to PDF", href: "/studio/documents?tool=word-to-pdf", icon: FileText, description: "DOCX to PDF" },
      { label: "PowerPoint to PDF", href: "/studio/documents?tool=ppt-to-pdf", icon: Presentation, description: "PPTX to PDF" },
      { label: "Excel to PDF", href: "/studio/documents?tool=excel-to-pdf", icon: FileSpreadsheet, description: "XLSX to PDF" },
      { label: "HTML to PDF", href: "/studio/documents?tool=html-to-pdf", icon: Code, description: "Webpage to PDF" },
    ]
  },
  { 
    title: "Convert from PDF", 
    color: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/20",
    tools: [
      { label: "PDF to JPG", href: "/studio/documents?tool=pdf-to-jpg", icon: FileImage, description: "PDF to images" },
      { label: "PDF to Word", href: "/studio/documents?tool=pdf-to-word", icon: FileText, description: "PDF to DOCX" },
      { label: "PDF to PowerPoint", href: "/studio/documents?tool=pdf-to-ppt", icon: Presentation, description: "PDF to PPTX" },
      { label: "PDF to Excel", href: "/studio/documents?tool=pdf-to-excel", icon: FileSpreadsheet, description: "PDF to XLSX" },
    ]
  },
  { 
    title: "Edit PDF", 
    color: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
    borderColor: "border-cyan-500/20",
    tools: [
      { label: "Rotate PDF", href: "/studio/documents?tool=rotate", icon: RotateCw, description: "Rotate pages" },
      { label: "Add page numbers", href: "/studio/documents?tool=add-page-numbers", icon: Hash, description: "Number pages" },
      { label: "Add watermark", href: "/studio/documents?tool=add-watermark", icon: Droplet, description: "Text/image watermark" },
      { label: "Crop PDF", href: "/studio/documents?tool=crop", icon: Crop, description: "Crop margins" },
      { label: "Edit PDF", href: "/studio/documents?tool=edit-pdf", icon: PenTool, description: "Edit text & images" },
    ]
  },
  { 
    title: "PDF Security", 
    color: "bg-violet-500/10",
    iconColor: "text-violet-500",
    borderColor: "border-violet-500/20",
    tools: [
      { label: "Unlock PDF", href: "/studio/documents?tool=unlock", icon: Unlock, description: "Remove password" },
      { label: "Protect PDF", href: "/studio/documents?tool=protect", icon: Shield, description: "Add password" },
      { label: "Sign PDF", href: "/studio/documents?tool=sign", icon: PenTool, description: "Digital signature" },
      { label: "Redact PDF", href: "/studio/documents?tool=redact", icon: Eye, description: "Black out info" },
      { label: "Compare PDF", href: "/studio/documents?tool=compare", icon: GitCompare, description: "Compare files" },
    ]
  },
];

// Image Studio tools
const imageCategories = [
  { 
    title: "Optimize", 
    color: "bg-blue-500/10",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/20",
    tools: [
      { label: "Compress Image", href: "/studio/images?tool=compress", icon: Minimize2, description: "Reduce file size" },
      { label: "Resize Image", href: "/studio/images?tool=resize", icon: Maximize2, description: "Change dimensions" },
      { label: "Upscale (AI)", href: "/studio/images?tool=upscale", icon: ArrowUpCircle, description: "AI enlargement" },
    ]
  },
  { 
    title: "Edit", 
    color: "bg-teal-500/10",
    iconColor: "text-teal-500",
    borderColor: "border-teal-500/20",
    tools: [
      { label: "Crop Image", href: "/studio/images?tool=crop", icon: Crop, description: "Custom dimensions" },
      { label: "Rotate Image", href: "/studio/images?tool=rotate", icon: RotateCw, description: "Rotate at any angle" },
      { label: "Remove Background", href: "/studio/images?tool=remove-bg", icon: Wand2, description: "AI background removal" },
      { label: "Add Watermark", href: "/studio/images?tool=watermark", icon: Droplet, description: "Text/image watermark" },
      { label: "Blur Faces", href: "/studio/images?tool=blur-face", icon: Eye, description: "Privacy blur" },
      { label: "Photo Editor", href: "/studio/images?tool=photo-editor", icon: Sparkles, description: "Effects & frames" },
    ]
  },
  { 
    title: "Convert", 
    color: "bg-amber-500/10",
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/20",
    tools: [
      { label: "Convert to JPG", href: "/studio/images?tool=to-jpg", icon: FileImage, description: "Any format to JPG" },
      { label: "Convert from JPG", href: "/studio/images?tool=from-jpg", icon: FileImage, description: "JPG to other formats" },
      { label: "Convert to PNG", href: "/studio/images?tool=to-png", icon: FileImage, description: "Any format to PNG" },
      { label: "Convert to WebP", href: "/studio/images?tool=to-webp", icon: FileImage, description: "Optimize for web" },
      { label: "HTML to Image", href: "/studio/images?tool=html-to-image", icon: Code, description: "Screenshot webpage" },
    ]
  },
  { 
    title: "Create", 
    color: "bg-purple-500/10",
    iconColor: "text-purple-500",
    borderColor: "border-purple-500/20",
    tools: [
      { label: "Meme Generator", href: "/studio/images?tool=meme", icon: ImagePlus, description: "Create memes" },
      { label: "Batch Process", href: "/studio/images?tool=batch", icon: Clapperboard, description: "Process multiple" },
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
  const [mobileDocExpanded, setMobileDocExpanded] = useState(false);
  const [mobileImgExpanded, setMobileImgExpanded] = useState(false);
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
        <nav className="hidden lg:flex items-center gap-1">
          {/* Documents Mega Menu */}
          <div ref={documentsRef} className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-1.5"
              onMouseEnter={() => setShowDocumentsMenu(true)}
              onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}
            >
              <FileText className="h-4 w-4 text-red-500" />
              Documents
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showDocumentsMenu ? "rotate-180" : ""}`} />
            </Button>
            
            {showDocumentsMenu && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-popover border border-border rounded-xl shadow-xl p-5 z-[100] animate-in fade-in-0 slide-in-from-top-2 duration-200"
                style={{ width: "min(95vw, 920px)" }}
                onMouseLeave={() => setShowDocumentsMenu(false)}
              >
                <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
                  {documentCategories.map((category) => (
                    <div key={category.title} className={`p-3 rounded-lg ${category.color} border ${category.borderColor}`}>
                      <h3 className={`text-xs font-semibold mb-3 tracking-wide uppercase ${category.iconColor}`}>
                        {category.title}
                      </h3>
                      <ul className="space-y-1">
                        {category.tools.map((tool) => (
                          <li key={tool.href}>
                            <button
                              onClick={() => handleToolClick(tool.href)}
                              className="group flex items-start gap-2 p-1.5 rounded-md hover:bg-background/80 transition-colors w-full text-left"
                            >
                              <tool.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${category.iconColor}`} />
                              <div className="min-w-0">
                                <span className="text-sm font-medium text-foreground block truncate group-hover:text-primary transition-colors">
                                  {tool.label}
                                </span>
                                <span className="text-xs text-muted-foreground truncate block">
                                  {tool.description}
                                </span>
                              </div>
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
              className="text-muted-foreground hover:text-foreground gap-1.5"
              onMouseEnter={() => setShowImagesMenu(true)}
              onClick={() => setShowImagesMenu(!showImagesMenu)}
            >
              <Image className="h-4 w-4 text-blue-500" />
              Images
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showImagesMenu ? "rotate-180" : ""}`} />
            </Button>
            
            {showImagesMenu && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-popover border border-border rounded-xl shadow-xl p-5 z-[100] animate-in fade-in-0 slide-in-from-top-2 duration-200"
                style={{ width: "min(95vw, 680px)" }}
                onMouseLeave={() => setShowImagesMenu(false)}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageCategories.map((category) => (
                    <div key={category.title} className={`p-3 rounded-lg ${category.color} border ${category.borderColor}`}>
                      <h3 className={`text-xs font-semibold mb-3 tracking-wide uppercase ${category.iconColor}`}>
                        {category.title}
                      </h3>
                      <ul className="space-y-1">
                        {category.tools.map((tool) => (
                          <li key={tool.href}>
                            <button
                              onClick={() => handleToolClick(tool.href)}
                              className="group flex items-start gap-2 p-1.5 rounded-md hover:bg-background/80 transition-colors w-full text-left"
                            >
                              <tool.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${category.iconColor}`} />
                              <div className="min-w-0">
                                <span className="text-sm font-medium text-foreground block truncate group-hover:text-primary transition-colors">
                                  {tool.label}
                                </span>
                                <span className="text-xs text-muted-foreground truncate block">
                                  {tool.description}
                                </span>
                              </div>
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

        <div className="hidden lg:flex items-center gap-3">
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
          className="lg:hidden p-2 rounded-md hover:bg-accent"
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
        <div className="lg:hidden border-t border-border/50 bg-background max-h-[80vh] overflow-y-auto">
          <nav className="container py-4 flex flex-col gap-1">
            {/* Documents Accordion */}
            <div className="rounded-lg overflow-hidden">
              <button
                onClick={() => setMobileDocExpanded(!mobileDocExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Documents</span>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${mobileDocExpanded ? "rotate-90" : ""}`} />
              </button>
              {mobileDocExpanded && (
                <div className="px-2 pb-2 space-y-2">
                  {documentCategories.map((category) => (
                    <div key={category.title} className={`p-3 rounded-lg ${category.color}`}>
                      <h4 className={`text-xs font-semibold mb-2 ${category.iconColor}`}>{category.title}</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {category.tools.map((tool) => (
                          <button
                            key={tool.href}
                            onClick={() => handleToolClick(tool.href)}
                            className="flex items-center gap-2 p-2 rounded text-left hover:bg-background/50 transition-colors"
                          >
                            <tool.icon className={`h-3.5 w-3.5 ${category.iconColor}`} />
                            <span className="text-xs">{tool.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Images Accordion */}
            <div className="rounded-lg overflow-hidden">
              <button
                onClick={() => setMobileImgExpanded(!mobileImgExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Images</span>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${mobileImgExpanded ? "rotate-90" : ""}`} />
              </button>
              {mobileImgExpanded && (
                <div className="px-2 pb-2 space-y-2">
                  {imageCategories.map((category) => (
                    <div key={category.title} className={`p-3 rounded-lg ${category.color}`}>
                      <h4 className={`text-xs font-semibold mb-2 ${category.iconColor}`}>{category.title}</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {category.tools.map((tool) => (
                          <button
                            key={tool.href}
                            onClick={() => handleToolClick(tool.href)}
                            className="flex items-center gap-2 p-2 rounded text-left hover:bg-background/50 transition-colors"
                          >
                            <tool.icon className={`h-3.5 w-3.5 ${category.iconColor}`} />
                            <span className="text-xs">{tool.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-colors rounded-lg hover:bg-accent ${
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
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
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

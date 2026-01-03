import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, LogOut, User, ChevronRight, Monitor,
  FileText, Image, Layers, Scissors, FileX, FileSearch, Minimize2, FileCheck, Type,
  FileImage, Presentation, FileSpreadsheet, Code,
  RotateCw, Hash, Droplet, Crop, PenTool, Unlock, Shield, Eye, GitCompare,
  Maximize2, ArrowUpCircle, Wand2, Sparkles, ImagePlus, Clapperboard, SplitSquareHorizontal
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ConvertixLogo } from "@/components/ui/ConvertixLogo";

// Document Studio categories and tools
const documentCategories = [
  { 
    id: "organize",
    title: "Organize PDF", 
    icon: Layers,
    toolCount: 5,
    tools: [
      { label: "Merge PDF", href: "/studio/documents?tool=merge", icon: Layers, description: "Combine multiple PDFs into one" },
      { label: "Split PDF", href: "/studio/documents?tool=split", icon: SplitSquareHorizontal, description: "Separate PDF into multiple files" },
      { label: "Remove Pages", href: "/studio/documents?tool=remove-pages", icon: FileX, description: "Delete specific pages from PDF" },
      { label: "Extract Pages", href: "/studio/documents?tool=extract-pages", icon: FileSearch, description: "Extract pages as new PDF" },
      { label: "Organize PDF", href: "/studio/documents?tool=organize", icon: Layers, description: "Reorder and rotate pages" },
    ]
  },
  { 
    id: "optimize",
    title: "Optimize PDF", 
    icon: Zap,
    toolCount: 3,
    tools: [
      { label: "Compress PDF", href: "/studio/documents?tool=compress", icon: Minimize2, description: "Reduce PDF file size" },
      { label: "Repair PDF", href: "/studio/documents?tool=repair", icon: FileCheck, description: "Fix corrupted PDF files" },
      { label: "OCR PDF", href: "/studio/documents?tool=ocr", icon: Type, description: "Make PDFs searchable" },
    ]
  },
  { 
    id: "convert-to",
    title: "Convert to PDF", 
    icon: FileText,
    toolCount: 5,
    tools: [
      { label: "JPG to PDF", href: "/studio/documents?tool=jpg-to-pdf", icon: FileImage, description: "Convert images to PDF" },
      { label: "Word to PDF", href: "/studio/documents?tool=word-to-pdf", icon: FileText, description: "Convert DOCX to PDF" },
      { label: "PowerPoint to PDF", href: "/studio/documents?tool=ppt-to-pdf", icon: Presentation, description: "Convert PPTX to PDF" },
      { label: "Excel to PDF", href: "/studio/documents?tool=excel-to-pdf", icon: FileSpreadsheet, description: "Convert XLSX to PDF" },
      { label: "HTML to PDF", href: "/studio/documents?tool=html-to-pdf", icon: Code, description: "Convert webpage to PDF" },
    ]
  },
  { 
    id: "convert-from",
    title: "Convert from PDF", 
    icon: FileImage,
    toolCount: 4,
    tools: [
      { label: "PDF to JPG", href: "/studio/documents?tool=pdf-to-jpg", icon: FileImage, description: "Convert PDF to images" },
      { label: "PDF to Word", href: "/studio/documents?tool=pdf-to-word", icon: FileText, description: "Convert PDF to DOCX" },
      { label: "PDF to PowerPoint", href: "/studio/documents?tool=pdf-to-ppt", icon: Presentation, description: "Convert PDF to PPTX" },
      { label: "PDF to Excel", href: "/studio/documents?tool=pdf-to-excel", icon: FileSpreadsheet, description: "Convert PDF to XLSX" },
    ]
  },
  { 
    id: "edit",
    title: "Edit PDF", 
    icon: PenTool,
    toolCount: 5,
    tools: [
      { label: "Rotate PDF", href: "/studio/documents?tool=rotate", icon: RotateCw, description: "Rotate PDF pages" },
      { label: "Add Page Numbers", href: "/studio/documents?tool=add-page-numbers", icon: Hash, description: "Number your pages" },
      { label: "Add Watermark", href: "/studio/documents?tool=add-watermark", icon: Droplet, description: "Add text or image watermark" },
      { label: "Crop PDF", href: "/studio/documents?tool=crop", icon: Crop, description: "Crop PDF margins" },
      { label: "Edit PDF", href: "/studio/documents?tool=edit-pdf", icon: PenTool, description: "Edit text and images" },
    ]
  },
  { 
    id: "security",
    title: "PDF Security", 
    icon: Shield,
    toolCount: 5,
    tools: [
      { label: "Unlock PDF", href: "/studio/documents?tool=unlock", icon: Unlock, description: "Remove PDF password" },
      { label: "Protect PDF", href: "/studio/documents?tool=protect", icon: Shield, description: "Add password protection" },
      { label: "Sign PDF", href: "/studio/documents?tool=sign", icon: PenTool, description: "Add digital signature" },
      { label: "Redact PDF", href: "/studio/documents?tool=redact", icon: Eye, description: "Black out sensitive info" },
      { label: "Compare PDF", href: "/studio/documents?tool=compare", icon: GitCompare, description: "Compare two PDFs" },
    ]
  },
];

// Image Studio categories and tools
const imageCategories = [
  { 
    id: "optimize",
    title: "Optimize", 
    icon: Minimize2,
    toolCount: 3,
    tools: [
      { label: "Compress Image", href: "/studio/images?tool=compress", icon: Minimize2, description: "Reduce image file size" },
      { label: "Resize Image", href: "/studio/images?tool=resize", icon: Maximize2, description: "Change image dimensions" },
      { label: "Upscale (AI)", href: "/studio/images?tool=upscale", icon: ArrowUpCircle, description: "AI-powered enlargement" },
    ]
  },
  { 
    id: "edit",
    title: "Edit", 
    icon: Crop,
    toolCount: 6,
    tools: [
      { label: "Crop Image", href: "/studio/images?tool=crop", icon: Crop, description: "Crop to custom dimensions" },
      { label: "Rotate Image", href: "/studio/images?tool=rotate", icon: RotateCw, description: "Rotate at any angle" },
      { label: "Remove Background", href: "/studio/images?tool=remove-bg", icon: Wand2, description: "AI background removal" },
      { label: "Add Watermark", href: "/studio/images?tool=watermark", icon: Droplet, description: "Add text or image watermark" },
      { label: "Blur Faces", href: "/studio/images?tool=blur-face", icon: Eye, description: "Privacy blur for faces" },
      { label: "Photo Editor", href: "/studio/images?tool=photo-editor", icon: Sparkles, description: "Effects, filters & frames" },
    ]
  },
  { 
    id: "convert",
    title: "Convert", 
    icon: FileImage,
    toolCount: 5,
    tools: [
      { label: "Convert to JPG", href: "/studio/images?tool=to-jpg", icon: FileImage, description: "Any format to JPG" },
      { label: "Convert from JPG", href: "/studio/images?tool=from-jpg", icon: FileImage, description: "JPG to other formats" },
      { label: "Convert to PNG", href: "/studio/images?tool=to-png", icon: FileImage, description: "Any format to PNG" },
      { label: "Convert to WebP", href: "/studio/images?tool=to-webp", icon: FileImage, description: "Optimize for web" },
      { label: "HTML to Image", href: "/studio/images?tool=html-to-image", icon: Code, description: "Screenshot webpage" },
    ]
  },
  { 
    id: "create",
    title: "Create", 
    icon: ImagePlus,
    toolCount: 2,
    tools: [
      { label: "Meme Generator", href: "/studio/images?tool=meme", icon: ImagePlus, description: "Create custom memes" },
      { label: "Batch Process", href: "/studio/images?tool=batch", icon: Clapperboard, description: "Process multiple images" },
    ]
  },
];

// Missing import for Zap icon
import { Zap } from "lucide-react";

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
  const [selectedDocCategory, setSelectedDocCategory] = useState(documentCategories[0].id);
  const [selectedImgCategory, setSelectedImgCategory] = useState(imageCategories[0].id);
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

  const selectedDocTools = documentCategories.find(c => c.id === selectedDocCategory)?.tools || [];
  const selectedImgTools = imageCategories.find(c => c.id === selectedImgCategory)?.tools || [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <ConvertixLogo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Documents Mega Menu - Sidebar Layout */}
          <div ref={documentsRef} className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-1.5 px-3"
              onMouseEnter={() => setShowDocumentsMenu(true)}
              onClick={() => setShowDocumentsMenu(!showDocumentsMenu)}
            >
              <FileText className="h-4 w-4 text-red-500" />
              Documents
              <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${showDocumentsMenu ? "rotate-90" : ""}`} />
            </Button>
            
            {showDocumentsMenu && (
              <div 
                className="absolute top-full left-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200 z-[100]"
                style={{ width: "680px" }}
                onMouseLeave={() => setShowDocumentsMenu(false)}
              >
                <div className="flex">
                  {/* Left Sidebar - Categories */}
                  <div className="w-56 bg-muted/30 border-r border-border/50 p-3">
                    <div className="flex items-center gap-2 px-3 py-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Documents</p>
                        <p className="text-xs text-muted-foreground">{documentCategories.length} Categories</p>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      {documentCategories.map((category) => {
                        const isActive = selectedDocCategory === category.id;
                        return (
                          <button
                            key={category.id}
                            onMouseEnter={() => setSelectedDocCategory(category.id)}
                            onClick={() => setSelectedDocCategory(category.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                              isActive 
                                ? 'bg-background shadow-sm text-foreground' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                              <span className="text-sm font-medium">{category.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground">{category.toolCount} tools</span>
                              {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Panel - Tools */}
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-primary rounded-full" />
                        <h3 className="text-base font-semibold text-foreground">
                          {documentCategories.find(c => c.id === selectedDocCategory)?.title}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {selectedDocTools.length} TOOLS
                      </span>
                    </div>
                    <div className="space-y-1">
                      {selectedDocTools.map((tool) => (
                        <button
                          key={tool.href}
                          onClick={() => handleToolClick(tool.href)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all group text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-muted/80 border border-border/50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                            <tool.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {tool.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {tool.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Images Mega Menu - Sidebar Layout */}
          <div ref={imagesRef} className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-1.5 px-3"
              onMouseEnter={() => setShowImagesMenu(true)}
              onClick={() => setShowImagesMenu(!showImagesMenu)}
            >
              <Image className="h-4 w-4 text-blue-500" />
              Images
              <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${showImagesMenu ? "rotate-90" : ""}`} />
            </Button>
            
            {showImagesMenu && (
              <div 
                className="absolute top-full left-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200 z-[100]"
                style={{ width: "620px" }}
                onMouseLeave={() => setShowImagesMenu(false)}
              >
                <div className="flex">
                  {/* Left Sidebar - Categories */}
                  <div className="w-52 bg-muted/30 border-r border-border/50 p-3">
                    <div className="flex items-center gap-2 px-3 py-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Image className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Images</p>
                        <p className="text-xs text-muted-foreground">{imageCategories.length} Categories</p>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      {imageCategories.map((category) => {
                        const isActive = selectedImgCategory === category.id;
                        return (
                          <button
                            key={category.id}
                            onMouseEnter={() => setSelectedImgCategory(category.id)}
                            onClick={() => setSelectedImgCategory(category.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                              isActive 
                                ? 'bg-background shadow-sm text-foreground' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                              <span className="text-sm font-medium">{category.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground">{category.toolCount} tools</span>
                              {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Panel - Tools */}
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-primary rounded-full" />
                        <h3 className="text-base font-semibold text-foreground">
                          {imageCategories.find(c => c.id === selectedImgCategory)?.title}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {selectedImgTools.length} TOOLS
                      </span>
                    </div>
                    <div className="space-y-1">
                      {selectedImgTools.map((tool) => (
                        <button
                          key={tool.href}
                          onClick={() => handleToolClick(tool.href)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all group text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-muted/80 border border-border/50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                            <tool.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {tool.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {tool.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
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
                  <span className="text-xs text-muted-foreground">({documentCategories.length} categories)</span>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${mobileDocExpanded ? "rotate-90" : ""}`} />
              </button>
              {mobileDocExpanded && (
                <div className="px-2 pb-2 space-y-2">
                  {documentCategories.map((category) => (
                    <div key={category.id} className="bg-muted/30 rounded-lg p-3">
                      <h4 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-2">
                        <category.icon className="h-3.5 w-3.5 text-primary" />
                        {category.title}
                        <span className="text-muted-foreground font-normal">· {category.toolCount} tools</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-1">
                        {category.tools.map((tool) => (
                          <button
                            key={tool.href}
                            onClick={() => handleToolClick(tool.href)}
                            className="flex items-center gap-2 p-2 rounded-md text-left hover:bg-background/80 transition-colors"
                          >
                            <tool.icon className="h-3.5 w-3.5 text-muted-foreground" />
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
                  <span className="text-xs text-muted-foreground">({imageCategories.length} categories)</span>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${mobileImgExpanded ? "rotate-90" : ""}`} />
              </button>
              {mobileImgExpanded && (
                <div className="px-2 pb-2 space-y-2">
                  {imageCategories.map((category) => (
                    <div key={category.id} className="bg-muted/30 rounded-lg p-3">
                      <h4 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-2">
                        <category.icon className="h-3.5 w-3.5 text-primary" />
                        {category.title}
                        <span className="text-muted-foreground font-normal">· {category.toolCount} tools</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-1">
                        {category.tools.map((tool) => (
                          <button
                            key={tool.href}
                            onClick={() => handleToolClick(tool.href)}
                            className="flex items-center gap-2 p-2 rounded-md text-left hover:bg-background/80 transition-colors"
                          >
                            <tool.icon className="h-3.5 w-3.5 text-muted-foreground" />
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

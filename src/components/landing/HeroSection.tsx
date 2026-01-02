import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download, ArrowRight, FileText, Image, Sparkles, Check, Zap, RefreshCw, Crop, Palette, Type } from "lucide-react";
import { useState, useEffect } from "react";

const demoSteps = [
  {
    title: "Upload Document",
    description: "Invoice.pdf uploaded",
    type: "document",
    action: "Analyzing...",
  },
  {
    title: "OCR Processing",
    description: "Extracting text from PDF",
    type: "process",
    action: "Reading content...",
  },
  {
    title: "Convert Format",
    description: "PDF → DOCX",
    type: "convert",
    action: "Converting...",
  },
  {
    title: "Image Optimization",
    description: "Banner.png optimizing",
    type: "image",
    action: "Compressing...",
  },
  {
    title: "Apply Edits",
    description: "Resize & enhance",
    type: "edit",
    action: "Processing...",
  },
];

export const HeroSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showReal, setShowReal] = useState(false);
  const [sketchProgress, setSketchProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Start sketch animation after a delay
    const sketchTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setSketchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }, 800);

    // Transition to real UI
    const realTimer = setTimeout(() => {
      setShowReal(true);
    }, 2500);

    return () => {
      clearTimeout(sketchTimer);
      clearTimeout(realTimer);
    };
  }, []);

  // Cycle through demo steps
  useEffect(() => {
    if (!showReal || !isPlaying) return;
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % demoSteps.length);
    }, 2500);

    return () => clearInterval(stepInterval);
  }, [showReal, isPlaying]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case "document": return FileText;
      case "process": return Type;
      case "convert": return RefreshCw;
      case "image": return Image;
      case "edit": return Crop;
      default: return Zap;
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Unified Conversion Studio</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            CONVERTIX
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A conversion studio where work continues.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" asChild className="min-w-[160px]">
              <Link to="/studio">
                Open Studio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="min-w-[160px]">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
            <Button size="lg" variant="ghost" asChild className="min-w-[160px]">
              <Link to="/desktop">
                <Download className="mr-2 h-4 w-4" />
                Download Desktop
              </Link>
            </Button>
          </div>

          {/* Interactive Live Demo Preview */}
          <div className="relative max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="aspect-[16/9] rounded-xl border border-border bg-card/80 backdrop-blur shadow-xl overflow-hidden relative">
              
              {/* Sketch Layer */}
              <div 
                className={`absolute inset-0 transition-opacity duration-1000 ${showReal ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <svg viewBox="0 0 960 540" className="w-full h-full" fill="none">
                  {/* Header sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${100 - sketchProgress}%` }}>
                    <rect x="0" y="0" width="960" height="48" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                    <circle cx="24" cy="24" r="6" className="stroke-destructive/40" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="44" cy="24" r="6" className="stroke-chart-4/40" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="64" cy="24" r="6" className="stroke-primary/40" strokeWidth="1.5" strokeDasharray="3 2" />
                  </g>

                  {/* Sidebar sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.2)}%` }}>
                    <rect x="0" y="48" width="200" height="492" className="stroke-muted-foreground/20" strokeWidth="1" strokeDasharray="6 3" />
                    <rect x="16" y="70" width="168" height="36" rx="6" className="stroke-primary/40" strokeWidth="1" strokeDasharray="4 2" />
                    <rect x="16" y="120" width="140" height="24" rx="4" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                  </g>

                  {/* Canvas area sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.5)}%` }}>
                    <rect x="220" y="70" width="500" height="400" rx="12" className="stroke-muted-foreground/20" strokeWidth="2" strokeDasharray="8 4" />
                    <rect x="300" y="150" width="340" height="240" rx="8" className="stroke-primary/30" strokeWidth="1.5" strokeDasharray="6 3" />
                  </g>

                  {/* Tools panel sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.8)}%` }}>
                    <rect x="740" y="48" width="220" height="492" className="stroke-muted-foreground/20" strokeWidth="1" strokeDasharray="6 3" />
                    <rect x="756" y="70" width="100" height="20" rx="4" className="stroke-muted-foreground/40" strokeWidth="1" strokeDasharray="3 2" />
                  </g>
                </svg>
              </div>

              {/* Real Interactive UI Layer */}
              <div 
                className={`h-full flex flex-col transition-all duration-1000 ${showReal ? 'opacity-100' : 'opacity-0'}`}
              >
                {/* Header */}
                <div className="h-12 border-b border-border/50 bg-card flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/50 animate-dot-pulse" style={{ animationDelay: '0s' }} />
                    <div className="w-3 h-3 rounded-full bg-chart-4/50 animate-dot-pulse" style={{ animationDelay: '0.15s' }} />
                    <div className="w-3 h-3 rounded-full bg-primary/50 animate-dot-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1.5 rounded-full bg-primary/10 text-xs text-primary font-medium flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Live Demo
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 flex">
                  {/* Sidebar - File List */}
                  <div className="w-52 border-r border-border/50 p-3 space-y-2 hidden sm:block bg-card/50">
                    <p className="text-xs font-medium text-muted-foreground mb-3 px-2">Workspace</p>
                    {[
                      { name: 'Invoice.pdf', type: 'pdf', size: '2.4 MB' },
                      { name: 'Banner.png', type: 'image', size: '1.8 MB' },
                      { name: 'Report.docx', type: 'doc', size: '890 KB' },
                    ].map((file, i) => (
                      <div 
                        key={i}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-300 ${
                          (currentStep === 0 && file.type === 'pdf') || 
                          (currentStep === 3 && file.type === 'image') ||
                          (currentStep === 2 && file.type === 'doc')
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'text-muted-foreground hover:bg-accent/50'
                        }`}
                      >
                        {file.type === 'pdf' ? (
                          <FileText className="h-4 w-4" />
                        ) : file.type === 'image' ? (
                          <Image className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{file.name}</p>
                          <p className="text-[10px] opacity-60">{file.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Canvas - Live Preview */}
                  <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                      backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }} />
                    
                    {/* Active Step Display */}
                    <div className="relative w-full max-w-sm">
                      {/* Step Indicator */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {demoSteps.map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              i === currentStep 
                                ? 'bg-primary w-6' 
                                : i < currentStep 
                                  ? 'bg-primary/40' 
                                  : 'bg-border'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Current Step Card */}
                      <div 
                        key={currentStep}
                        className="bg-card rounded-xl border border-border p-6 shadow-lg animate-scale-in"
                      >
                        {/* Step Icon */}
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                              {(() => {
                                const Icon = getStepIcon(demoSteps[currentStep].type);
                                return <Icon className="h-8 w-8 text-primary" />;
                              })()}
                            </div>
                            {/* Processing ring */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping" />
                          </div>
                        </div>

                        {/* Step Info */}
                        <div className="text-center">
                          <h3 className="font-semibold text-foreground mb-1">
                            {demoSteps[currentStep].title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {demoSteps[currentStep].description}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="h-2 rounded-full bg-border overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-[2500ms] ease-linear"
                              style={{ 
                                width: '100%',
                                animation: 'progress-fill 2.5s linear infinite'
                              }}
                            />
                          </div>
                          
                          {/* Action Text */}
                          <p className="text-xs text-primary mt-2 flex items-center justify-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {demoSteps[currentStep].action}
                          </p>
                        </div>
                      </div>

                      {/* Completed Badge */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary" />
                        <span>{currentStep + 1} of {demoSteps.length} steps</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tools Panel */}
                  <div className="w-56 border-l border-border/50 p-4 hidden md:flex flex-col bg-card/50">
                    <p className="text-xs font-medium text-muted-foreground mb-4">Quick Actions</p>
                    <div className="space-y-2">
                      {[
                        { icon: RefreshCw, label: 'Convert Format', active: currentStep === 2 },
                        { icon: Zap, label: 'Compress', active: currentStep === 3 },
                        { icon: Type, label: 'OCR Extract', active: currentStep === 1 },
                        { icon: Crop, label: 'Resize & Crop', active: currentStep === 4 },
                        { icon: Palette, label: 'Enhance', active: false },
                      ].map((tool, i) => (
                        <div 
                          key={i}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-300 cursor-default ${
                            tool.active 
                              ? 'bg-primary/10 text-primary border border-primary/20' 
                              : 'text-muted-foreground hover:bg-accent/50'
                          }`}
                        >
                          <tool.icon className={`h-4 w-4 ${tool.active ? 'animate-pulse' : ''}`} />
                          <span className="font-medium">{tool.label}</span>
                          {tool.active && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Output Preview */}
                    <div className="mt-auto pt-4 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-3">Output</p>
                      <div className="rounded-lg bg-accent/30 p-3 text-xs">
                        <div className="flex items-center gap-2 text-foreground">
                          <Check className="h-3 w-3 text-primary" />
                          <span>Ready to download</span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-[10px]">
                          Sign in to save & download
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="h-12 border-t border-border/50 bg-card/50 flex items-center px-4 gap-3">
                  <span className="text-xs text-muted-foreground">Timeline</span>
                  <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                    <div 
                      className="h-full bg-primary/40 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-primary font-medium">{currentStep + 1} actions</span>
                </div>
              </div>
            </div>
            
            {/* Floating Decorations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-chart-2/5 rounded-full blur-3xl animate-float-delayed" />
          </div>
        </div>
      </div>

      {/* CSS for progress animation */}
      <style>{`
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
};

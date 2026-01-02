import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download, ArrowRight, FileText, Image, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export const HeroSection = () => {
  const [showReal, setShowReal] = useState(false);
  const [sketchProgress, setSketchProgress] = useState(0);

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

          {/* Animated Demo Preview - Sketch to Real */}
          <div className="relative max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="aspect-[16/10] rounded-xl border border-border bg-card/80 backdrop-blur shadow-xl overflow-hidden relative">
              
              {/* Sketch Layer */}
              <div 
                className={`absolute inset-0 transition-opacity duration-1000 ${showReal ? 'opacity-0' : 'opacity-100'}`}
              >
                <svg viewBox="0 0 800 500" className="w-full h-full" fill="none">
                  {/* Header sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${100 - sketchProgress}%` }}>
                    <rect x="0" y="0" width="800" height="40" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                    <circle cx="20" cy="20" r="6" className="stroke-destructive/40" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="40" cy="20" r="6" className="stroke-chart-4/40" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="60" cy="20" r="6" className="stroke-primary/40" strokeWidth="1.5" strokeDasharray="3 2" />
                    <rect x="300" y="12" width="200" height="16" rx="8" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                  </g>

                  {/* Sidebar sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.2)}%` }}>
                    <rect x="0" y="40" width="160" height="420" className="stroke-muted-foreground/20" strokeWidth="1" strokeDasharray="6 3" />
                    <rect x="16" y="60" width="128" height="28" rx="6" className="stroke-primary/40" strokeWidth="1" strokeDasharray="4 2" />
                    <rect x="16" y="100" width="100" height="20" rx="4" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                    <rect x="16" y="130" width="110" height="20" rx="4" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                  </g>

                  {/* Canvas area sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.5)}%` }}>
                    <rect x="200" y="80" width="360" height="320" rx="12" className="stroke-muted-foreground/20" strokeWidth="2" strokeDasharray="8 4" />
                    <rect x="280" y="160" width="200" height="160" rx="8" className="stroke-primary/30" strokeWidth="1.5" strokeDasharray="6 3" />
                    {/* File icon sketch */}
                    <path d="M340 200 L340 280 L420 280 L420 220 L400 200 Z" className="stroke-muted-foreground/40" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M400 200 L400 220 L420 220" className="stroke-muted-foreground/40" strokeWidth="1.5" strokeDasharray="4 2" />
                  </g>

                  {/* Tools panel sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.8)}%` }}>
                    <rect x="600" y="40" width="200" height="420" className="stroke-muted-foreground/20" strokeWidth="1" strokeDasharray="6 3" />
                    <rect x="616" y="60" width="80" height="16" rx="4" className="stroke-muted-foreground/40" strokeWidth="1" strokeDasharray="3 2" />
                    <rect x="616" y="90" width="168" height="32" rx="6" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                    <rect x="616" y="130" width="168" height="32" rx="6" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                    <rect x="616" y="170" width="168" height="32" rx="6" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                  </g>

                  {/* Timeline sketch */}
                  <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 2)}%` }}>
                    <rect x="0" y="460" width="800" height="40" className="stroke-muted-foreground/20" strokeWidth="1" strokeDasharray="6 3" />
                    <rect x="100" y="474" width="600" height="12" rx="6" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                    <rect x="100" y="474" width="200" height="12" rx="6" className="stroke-primary/40" strokeWidth="1.5" strokeDasharray="4 2" />
                  </g>
                </svg>
              </div>

              {/* Real UI Layer */}
              <div 
                className={`h-full flex flex-col transition-opacity duration-1000 ${showReal ? 'opacity-100' : 'opacity-0'}`}
              >
                {/* Mock Header */}
                <div className="h-10 border-b border-border/50 bg-card flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/50 animate-dot-pulse" style={{ animationDelay: '0s' }} />
                    <div className="w-3 h-3 rounded-full bg-chart-4/50 animate-dot-pulse" style={{ animationDelay: '0.15s' }} />
                    <div className="w-3 h-3 rounded-full bg-primary/50 animate-dot-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-3 py-1 rounded bg-accent/50 text-xs text-muted-foreground">
                      Document Studio
                    </div>
                  </div>
                </div>
                
                {/* Mock Content */}
                <div className="flex-1 flex">
                  {/* Sidebar */}
                  <div className="w-48 border-r border-border/50 p-3 space-y-2 hidden sm:block">
                    <div 
                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-primary/10 text-primary text-xs animate-slide-in-stagger"
                      style={{ animationDelay: showReal ? '0.2s' : '0s' }}
                    >
                      <FileText className="h-3 w-3" />
                      <span>Invoice.pdf</span>
                    </div>
                    <div 
                      className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-xs animate-slide-in-stagger"
                      style={{ animationDelay: showReal ? '0.3s' : '0s' }}
                    >
                      <Image className="h-3 w-3" />
                      <span>Logo.png</span>
                    </div>
                  </div>
                  
                  {/* Canvas */}
                  <div className="flex-1 p-6 flex items-center justify-center">
                    <div 
                      className={`w-full max-w-xs aspect-[3/4] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground transition-all duration-500 ${showReal ? 'animate-scale-in' : ''}`}
                    >
                      <FileText className="h-12 w-12 mb-4 opacity-40" />
                      <p className="text-sm">Drop files here</p>
                      <p className="text-xs mt-1 opacity-60">or click to browse</p>
                    </div>
                  </div>
                  
                  {/* Tools Panel */}
                  <div className="w-48 border-l border-border/50 p-3 hidden md:block">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Tools</p>
                    <div className="space-y-2">
                      {['Convert', 'Compress', 'OCR', 'Merge'].map((tool, i) => (
                        <div 
                          key={tool} 
                          className="px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-accent/50 cursor-default animate-slide-in-stagger"
                          style={{ animationDelay: showReal ? `${0.4 + i * 0.1}s` : '0s' }}
                        >
                          {tool}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="h-12 border-t border-border/50 bg-card/50 flex items-center px-4 gap-3">
                  <span className="text-xs text-muted-foreground">Timeline</span>
                  <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                    <div 
                      className={`h-full bg-primary/40 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: showReal ? '33%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Decorations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-chart-2/5 rounded-full blur-3xl animate-float-delayed" />
          </div>
        </div>
      </div>
    </section>
  );
};

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download, ArrowRight, FileText, Image, Sparkles } from "lucide-react";

export const HeroSection = () => {
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

          {/* Animated Demo Preview */}
          <div className="relative max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="aspect-[16/10] rounded-xl border border-border bg-card/80 backdrop-blur shadow-xl overflow-hidden">
              {/* Mock Studio Interface */}
              <div className="h-full flex flex-col">
                {/* Mock Header */}
                <div className="h-10 border-b border-border/50 bg-card flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-chart-4/50" />
                    <div className="w-3 h-3 rounded-full bg-primary/50" />
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
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-primary/10 text-primary text-xs">
                      <FileText className="h-3 w-3" />
                      <span>Invoice.pdf</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-xs">
                      <Image className="h-3 w-3" />
                      <span>Logo.png</span>
                    </div>
                  </div>
                  
                  {/* Canvas */}
                  <div className="flex-1 p-6 flex items-center justify-center">
                    <div className="w-full max-w-xs aspect-[3/4] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-12 w-12 mb-4 opacity-40" />
                      <p className="text-sm">Drop files here</p>
                      <p className="text-xs mt-1 opacity-60">or click to browse</p>
                    </div>
                  </div>
                  
                  {/* Tools Panel */}
                  <div className="w-48 border-l border-border/50 p-3 hidden md:block">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Tools</p>
                    <div className="space-y-2">
                      {['Convert', 'Compress', 'OCR', 'Merge'].map((tool) => (
                        <div key={tool} className="px-2 py-1.5 rounded text-xs text-muted-foreground hover:bg-accent/50 cursor-default">
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
                    <div className="h-full w-1/3 bg-primary/40 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Decorations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-chart-2/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

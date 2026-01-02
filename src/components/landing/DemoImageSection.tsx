import { useState, useEffect } from "react";
import { FileText, Image, Code, Smartphone, Tablet, Monitor, Check, RefreshCw, Zap } from "lucide-react";

const demoFeatures = [
  { title: "Permanent Workspace", desc: "Every action builds upon the last", icon: RefreshCw },
  { title: "Unified Interface", desc: "Documents, images, and data in one place", icon: Zap },
  { title: "Visible Timeline", desc: "Track and revisit every action", icon: Check },
];

export const DemoImageSection = () => {
  const [activeDevice, setActiveDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-card/50 overflow-hidden">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            The Convertix Demo
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            A Story of Persistent Continuity
          </p>
        </div>

        {/* Interactive Device Preview */}
        <div className="relative max-w-6xl mx-auto">
          {/* Device Selector */}
          <div className="flex justify-center gap-4 mb-8">
            {[
              { id: "mobile", icon: Smartphone, label: "Mobile" },
              { id: "tablet", icon: Tablet, label: "Tablet" },
              { id: "desktop", icon: Monitor, label: "Desktop" },
            ].map((device) => (
              <button
                key={device.id}
                onClick={() => setActiveDevice(device.id as "mobile" | "tablet" | "desktop")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeDevice === device.id
                    ? "bg-primary text-primary-foreground scale-105"
                    : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <device.icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{device.label}</span>
              </button>
            ))}
          </div>

          {/* Three Device Display - Mobile | Desktop | Tablet */}
          <div className="flex items-end justify-center gap-4 md:gap-8 px-4">
            {/* Mobile Preview - Left */}
            <div className={`transition-all duration-500 ${activeDevice === "mobile" ? "scale-110 z-10" : "scale-90 opacity-70"}`}>
              <div className="w-[80px] sm:w-[100px] md:w-[140px] aspect-[9/19] bg-card rounded-[20px] border-4 border-foreground/20 shadow-2xl overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-foreground/20 rounded-full" />
                
                {/* Screen Content */}
                <div className="absolute inset-2 top-5 bg-background rounded-lg overflow-hidden">
                  {/* Mini App UI */}
                  <div className="h-6 bg-card border-b border-border/50 flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div className="p-2 space-y-1">
                    <div className={`h-8 rounded bg-primary/20 flex items-center justify-center transition-all duration-500 ${animationStep === 0 ? 'ring-2 ring-primary' : ''}`}>
                      <FileText className="h-3 w-3 text-primary" />
                    </div>
                    <div className={`h-6 rounded bg-accent/50 transition-all duration-500 ${animationStep === 1 ? 'bg-primary/30' : ''}`} />
                    <div className={`h-6 rounded bg-accent/50 transition-all duration-500 ${animationStep === 2 ? 'bg-primary/30' : ''}`} />
                    <div className={`h-4 rounded bg-primary transition-all duration-500 ${animationStep === 3 ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3 hidden sm:block">Mobile</p>
            </div>

            {/* Desktop Preview - Center (Larger) */}
            <div className={`transition-all duration-500 ${activeDevice === "desktop" ? "scale-105 z-10" : "scale-95 opacity-80"}`}>
              <div className="w-[200px] sm:w-[280px] md:w-[400px] lg:w-[500px] aspect-[16/10] bg-card rounded-xl border-4 border-foreground/20 shadow-2xl overflow-hidden relative">
                {/* Screen Content */}
                <div className="absolute inset-1 bg-background rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="h-6 md:h-8 bg-card border-b border-border/50 flex items-center px-2 md:px-4 gap-1 md:gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive/50" />
                    <div className="w-2 h-2 rounded-full bg-chart-4/50" />
                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                    <div className="flex-1 flex justify-center">
                      <div className="px-2 py-0.5 rounded-full bg-primary/10 text-[8px] md:text-xs text-primary">
                        Convertix Studio
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Layout */}
                  <div className="flex h-[calc(100%-1.5rem)] md:h-[calc(100%-2rem)]">
                    {/* Sidebar */}
                    <div className="w-1/4 border-r border-border/50 p-1 md:p-2 space-y-1">
                      {[FileText, Image, Code].map((Icon, i) => (
                        <div 
                          key={i} 
                          className={`flex items-center gap-1 p-1 md:p-1.5 rounded text-[6px] md:text-[8px] transition-all duration-500 ${
                            animationStep === i ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-2 w-2 md:h-3 md:w-3 shrink-0" />
                          <span className="hidden md:inline truncate">File {i + 1}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Canvas */}
                    <div className="flex-1 p-2 md:p-4 flex items-center justify-center">
                      <div className={`w-full max-w-[80%] aspect-square rounded-lg border-2 border-dashed transition-all duration-500 ${
                        animationStep === 3 ? 'border-primary bg-primary/10' : 'border-border'
                      } flex items-center justify-center`}>
                        <div className={`transition-all duration-500 ${animationStep === 3 ? 'scale-110' : ''}`}>
                          {animationStep === 0 && <FileText className="h-6 w-6 md:h-10 md:w-10 text-primary" />}
                          {animationStep === 1 && <RefreshCw className="h-6 w-6 md:h-10 md:w-10 text-primary animate-spin" />}
                          {animationStep === 2 && <Zap className="h-6 w-6 md:h-10 md:w-10 text-primary" />}
                          {animationStep === 3 && <Check className="h-6 w-6 md:h-10 md:w-10 text-primary" />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Tools Panel */}
                    <div className="w-1/4 border-l border-border/50 p-1 md:p-2 space-y-1 hidden sm:block">
                      {["Convert", "Compress", "OCR"].map((tool, i) => (
                        <div 
                          key={i}
                          className={`p-1 md:p-1.5 rounded text-[6px] md:text-[8px] text-center transition-all duration-500 ${
                            animationStep === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-accent/50 text-muted-foreground'
                          }`}
                        >
                          {tool}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Stand */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 md:w-24 h-4 bg-foreground/20 rounded-b-xl" />
              </div>
              <p className="text-center text-xs text-muted-foreground mt-6 hidden sm:block">Desktop</p>
            </div>

            {/* Tablet Preview - Right */}
            <div className={`transition-all duration-500 ${activeDevice === "tablet" ? "scale-110 z-10" : "scale-90 opacity-70"}`}>
              <div className="w-[100px] sm:w-[130px] md:w-[180px] aspect-[3/4] bg-card rounded-[16px] border-4 border-foreground/20 shadow-2xl overflow-hidden relative">
                {/* Camera */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/30 rounded-full" />
                
                {/* Screen Content */}
                <div className="absolute inset-2 top-5 bg-background rounded-lg overflow-hidden">
                  {/* Mini App UI */}
                  <div className="h-5 bg-card border-b border-border/50 flex items-center px-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-chart-4/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    </div>
                  </div>
                  <div className="flex h-[calc(100%-1.25rem)]">
                    <div className="w-1/3 border-r border-border/50 p-1 space-y-1">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i}
                          className={`h-4 rounded transition-all duration-500 ${
                            animationStep === i ? 'bg-primary/30' : 'bg-accent/50'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 p-2 flex items-center justify-center">
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg bg-primary/20 flex items-center justify-center transition-all duration-500 ${
                        animationStep === 3 ? 'bg-primary/40 scale-110' : ''
                      }`}>
                        {animationStep === 3 ? (
                          <Check className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3 hidden sm:block">Tablet</p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Key features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-16 max-w-4xl mx-auto">
          {demoFeatures.map((feature, i) => (
            <div 
              key={i}
              className="p-4 md:p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in text-center"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <feature.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">{feature.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

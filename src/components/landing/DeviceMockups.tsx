import { useState, useEffect } from "react";
import { 
  FileText, Image, Sparkles, Check, Zap, RefreshCw, Crop, Type, 
  Upload, Download, Maximize2, Wand2, Layers, Droplet, Eye, Shield
} from "lucide-react";

const demoSteps = [
  { title: "Upload Document", description: "Invoice.pdf uploaded", type: "document", action: "Analyzing..." },
  { title: "OCR Processing", description: "Extracting text from PDF", type: "process", action: "Reading content..." },
  { title: "Convert Format", description: "PDF → DOCX", type: "convert", action: "Converting..." },
  { title: "Image Optimization", description: "Banner.png optimizing", type: "image", action: "Compressing..." },
  { title: "Apply Edits", description: "Resize & enhance", type: "edit", action: "Processing..." },
];

export const DeviceMockups = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showReal, setShowReal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const realTimer = setTimeout(() => {
      setShowReal(true);
    }, 800);
    return () => clearTimeout(realTimer);
  }, []);

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

  // Enhanced Mac Desktop Preview
  const MacContent = () => (
    <div className={`h-full flex flex-col transition-all duration-700 ${showReal ? 'opacity-100' : 'opacity-0'}`}>
      {/* Mac Header with traffic lights */}
      <div className="h-6 md:h-7 border-b border-border/30 bg-card/80 flex items-center px-2 md:px-3 gap-1.5">
        <div className="flex gap-1">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-destructive/80" />
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-chart-4/80" />
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-2 py-0.5 rounded-full bg-primary/10 text-[9px] md:text-[10px] text-primary font-medium flex items-center gap-1">
            <Sparkles className="h-2 w-2 md:h-2.5 md:w-2.5" />
            <span className="hidden sm:inline">CONVERTIX Studio</span>
          </div>
        </div>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[9px] md:text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>
      
      {/* Main Content with animated workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File list */}
        <div className="w-20 sm:w-24 md:w-28 border-r border-border/30 p-1.5 space-y-1 bg-muted/30 hidden sm:block">
          <p className="text-[8px] md:text-[9px] font-semibold text-muted-foreground mb-1.5 px-1 uppercase tracking-wide">Files</p>
          {[
            { name: 'Invoice.pdf', type: 'pdf', size: '2.4 MB', color: 'text-red-500', bg: 'bg-red-500/10' },
            { name: 'Banner.png', type: 'image', size: '1.8 MB', color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { name: 'Report.docx', type: 'doc', size: '890 KB', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          ].map((file, i) => {
            const isActive = (currentStep === 0 && file.type === 'pdf') || 
                            (currentStep === 3 && file.type === 'image') ||
                            (currentStep === 2 && file.type === 'doc');
            return (
              <div 
                key={i}
                className={`flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-[8px] md:text-[9px] transition-all duration-300 ${
                  isActive ? `${file.bg} ring-1 ring-primary/30` : 'hover:bg-muted/50'
                }`}
              >
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md ${file.bg} flex items-center justify-center flex-shrink-0`}>
                  {file.type === 'image' ? <Image className={`h-2.5 w-2.5 md:h-3 md:w-3 ${file.color}`} /> : <FileText className={`h-2.5 w-2.5 md:h-3 md:w-3 ${file.color}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`truncate font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{file.name}</p>
                  <p className="text-[7px] opacity-50 hidden md:block">{file.size}</p>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </div>
            );
          })}
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 p-2 md:p-3 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-muted/10 via-transparent to-primary/5">
          <div className="relative w-full max-w-[160px] md:max-w-[200px]">
            {/* Step dots */}
            <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
              {demoSteps.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'bg-primary w-4' : i < currentStep ? 'bg-primary/40 w-1.5' : 'bg-border w-1.5'
                  }`}
                />
              ))}
            </div>

            {/* Current Step Card with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-xl animate-pulse" />
              <div className="relative bg-card rounded-xl border border-border/50 p-3 md:p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      {(() => {
                        const Icon = getStepIcon(demoSteps[currentStep].type);
                        return <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />;
                      })()}
                    </div>
                    <div className="absolute -inset-1 rounded-xl border-2 border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground text-[10px] md:text-xs mb-0.5">{demoSteps[currentStep].title}</h3>
                  <p className="text-[8px] md:text-[10px] text-muted-foreground mb-2">{demoSteps[currentStep].description}</p>
                  <div className="h-1 rounded-full bg-border overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all" 
                      style={{ 
                        width: '100%',
                        animation: 'progress-fill 2.5s ease-in-out infinite'
                      }} 
                    />
                  </div>
                  <p className="text-[7px] md:text-[9px] text-primary mt-1.5 flex items-center justify-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-primary animate-pulse" />
                    {demoSteps[currentStep].action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Tools Panel */}
        <div className="w-24 md:w-32 border-l border-border/30 p-1.5 hidden md:flex flex-col bg-muted/30">
          <p className="text-[8px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Tools</p>
          <div className="space-y-1">
            {[
              { icon: RefreshCw, label: 'Convert', active: currentStep === 2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { icon: Zap, label: 'Compress', active: currentStep === 3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { icon: Type, label: 'OCR', active: currentStep === 1, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: Crop, label: 'Crop', active: currentStep === 4, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            ].map((tool, i) => (
              <div key={i} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[8px] transition-all duration-300 ${tool.active ? `${tool.bg} ring-1 ring-inset ring-current/20` : 'hover:bg-muted/50'}`}>
                <div className={`w-5 h-5 rounded-md ${tool.bg} flex items-center justify-center`}>
                  <tool.icon className={`h-2.5 w-2.5 ${tool.active ? tool.color : 'text-muted-foreground'} ${tool.active ? 'animate-pulse' : ''}`} />
                </div>
                <span className={`font-medium ${tool.active ? tool.color : 'text-muted-foreground'}`}>{tool.label}</span>
                {tool.active && <div className="ml-auto w-1 h-1 rounded-full bg-current animate-pulse" />}
              </div>
            ))}
          </div>
          <div className="mt-auto pt-2">
            <div className="rounded-lg bg-primary/10 p-2 text-[8px]">
              <div className="flex items-center gap-1 text-primary font-medium">
                <Check className="h-2.5 w-2.5" />
                <span>Ready to export</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Timeline */}
      <div className="h-5 md:h-6 border-t border-border/30 bg-card/80 flex items-center px-2 md:px-3 gap-2">
        <span className="text-[8px] md:text-[9px] text-muted-foreground">Timeline</span>
        <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/50 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }} />
        </div>
        <span className="text-[8px] md:text-[9px] text-primary font-medium">{currentStep + 1}/{demoSteps.length}</span>
      </div>
    </div>
  );

  // iPhone Preview - Compact mobile version
  const IPhoneContent = () => (
    <div className={`h-full flex flex-col transition-all duration-700 ${showReal ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-4 bg-card/50 flex items-center justify-center">
        <div className="w-10 h-1 rounded-full bg-foreground/20" />
      </div>
      <div className="flex-1 p-1.5 flex flex-col items-center justify-center bg-gradient-to-b from-muted/20 to-transparent">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-1.5 relative">
          {(() => {
            const Icon = getStepIcon(demoSteps[currentStep].type);
            return <Icon className="h-4 w-4 text-primary" />;
          })()}
          <div className="absolute inset-0 rounded-lg border border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <p className="text-[7px] font-semibold text-foreground text-center leading-tight">{demoSteps[currentStep].title}</p>
        <p className="text-[6px] text-muted-foreground text-center mt-0.5">{demoSteps[currentStep].action}</p>
        <div className="w-full h-0.5 rounded-full bg-border mt-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }} />
        </div>
      </div>
      <div className="h-6 bg-card/80 border-t border-border/30 flex items-center justify-around px-1.5">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/50">
          <Upload className="h-2 w-2 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
          <RefreshCw className="h-2.5 w-2.5 text-primary" />
        </div>
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/50">
          <Download className="h-2 w-2 text-muted-foreground" />
        </div>
      </div>
    </div>
  );

  // iPad Preview - Tablet version  
  const IPadContent = () => (
    <div className={`h-full flex flex-col transition-all duration-700 ${showReal ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-5 border-b border-border/30 bg-card/80 flex items-center px-2 gap-1">
        <div className="flex gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-destructive/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-chart-4/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-1.5 py-0.5 rounded-full bg-primary/10 text-[7px] text-primary font-medium flex items-center gap-0.5">
            <Sparkles className="h-1.5 w-1.5" />
            iPad
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* iPad Sidebar */}
        <div className="w-16 border-r border-border/30 p-1.5 space-y-1 bg-muted/30">
          <p className="text-[6px] font-semibold text-muted-foreground mb-1 uppercase">Files</p>
          {['Invoice.pdf', 'Banner.png'].map((file, i) => {
            const isActive = i === (currentStep >= 3 ? 1 : 0);
            return (
              <div key={i} className={`px-1 py-1 rounded text-[6px] flex items-center gap-1 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <FileText className="h-2 w-2" />
                <span className="truncate">{file.split('.')[0]}</span>
              </div>
            );
          })}
        </div>
        {/* iPad Main */}
        <div className="flex-1 p-2 flex items-center justify-center bg-gradient-to-br from-muted/10 to-primary/5">
          <div className="bg-card rounded-lg border border-border/50 p-2 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-1 relative">
              {(() => {
                const Icon = getStepIcon(demoSteps[currentStep].type);
                return <Icon className="h-3.5 w-3.5 text-primary" />;
              })()}
            </div>
            <p className="text-[7px] font-semibold text-foreground text-center">{demoSteps[currentStep].title}</p>
            <p className="text-[6px] text-primary text-center">{demoSteps[currentStep].action}</p>
          </div>
        </div>
        {/* iPad Tools */}
        <div className="w-20 border-l border-border/30 p-1.5 bg-muted/30">
          <p className="text-[6px] font-semibold text-muted-foreground mb-1.5 uppercase">Tools</p>
          <div className="space-y-0.5">
            {[
              { icon: Layers, label: 'Merge', active: false },
              { icon: RefreshCw, label: 'Convert', active: currentStep === 2 },
              { icon: Maximize2, label: 'Resize', active: currentStep === 4 },
              { icon: Wand2, label: 'Enhance', active: false },
            ].map((tool, i) => (
              <div key={i} className={`flex items-center gap-1 px-1.5 py-1 rounded text-[6px] transition-all ${tool.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <tool.icon className="h-2 w-2" />
                <span>{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      <style>{`
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
      
      {/* Devices Container */}
      <div className="flex items-end justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        
        {/* iPhone Left */}
        <div className="relative hidden sm:block flex-shrink-0 transform -rotate-6 translate-y-6 hover:rotate-0 hover:translate-y-0 transition-all duration-500 hover:scale-105">
          <div className="relative w-[70px] md:w-[85px] lg:w-[100px]">
            {/* iPhone Frame */}
            <div className="relative bg-gradient-to-b from-foreground/90 to-foreground/80 rounded-[14px] md:rounded-[18px] lg:rounded-[22px] p-[2px] md:p-[3px] shadow-2xl">
              <div className="bg-card rounded-[12px] md:rounded-[16px] lg:rounded-[20px] overflow-hidden">
                <div className="aspect-[9/19.5] relative">
                  {/* Dynamic Island */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1/3 h-3 md:h-4 bg-foreground/90 rounded-full z-10" />
                  <IPhoneContent />
                </div>
              </div>
            </div>
            {/* Label */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-medium whitespace-nowrap bg-background/80 px-2 py-0.5 rounded-full">
              iPhone
            </div>
          </div>
        </div>

        {/* Mac Desktop Center - Main focus */}
        <div className="relative flex-shrink-0 z-10">
          <div className="relative w-[260px] sm:w-[340px] md:w-[420px] lg:w-[520px]">
            {/* Mac Frame */}
            <div className="relative bg-gradient-to-b from-foreground/95 to-foreground/85 rounded-t-lg p-[2px] md:p-[3px] shadow-2xl">
              <div className="bg-card rounded-t-md overflow-hidden">
                <div className="aspect-[16/10] relative">
                  <MacContent />
                </div>
              </div>
            </div>
            {/* Mac Stand */}
            <div className="relative mx-auto">
              <div className="w-24 sm:w-28 md:w-32 h-3 md:h-4 mx-auto bg-gradient-to-b from-foreground/80 to-foreground/70" />
              <div className="w-32 sm:w-40 md:w-48 h-1.5 md:h-2 mx-auto bg-gradient-to-b from-foreground/70 to-foreground/60 rounded-b-lg" />
            </div>
            {/* Label */}
            <div className="text-center mt-3 md:mt-4">
              <span className="text-xs md:text-sm text-muted-foreground font-medium bg-background/80 px-3 py-1 rounded-full">MacBook Pro</span>
            </div>
          </div>
        </div>

        {/* iPad Right */}
        <div className="relative hidden sm:block flex-shrink-0 transform rotate-6 translate-y-6 hover:rotate-0 hover:translate-y-0 transition-all duration-500 hover:scale-105">
          <div className="relative w-[90px] md:w-[110px] lg:w-[130px]">
            {/* iPad Frame */}
            <div className="relative bg-gradient-to-b from-foreground/90 to-foreground/80 rounded-[8px] md:rounded-[10px] lg:rounded-[12px] p-[2px] md:p-[3px] shadow-2xl">
              <div className="bg-card rounded-[6px] md:rounded-[8px] lg:rounded-[10px] overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <IPadContent />
                </div>
              </div>
            </div>
            {/* Label */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-medium whitespace-nowrap bg-background/80 px-2 py-0.5 rounded-full">
              iPad Pro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

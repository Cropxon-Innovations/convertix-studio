import { useState, useEffect } from "react";
import { 
  FileText, Image, Sparkles, Check, Zap, RefreshCw, Crop, Type, 
  Upload, Download, Maximize2, Wand2
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
  const [sketchProgress, setSketchProgress] = useState(0);
  const [showReal, setShowReal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
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

    const realTimer = setTimeout(() => {
      setShowReal(true);
    }, 2500);

    return () => {
      clearTimeout(sketchTimer);
      clearTimeout(realTimer);
    };
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

  // Mac Desktop Preview Content
  const MacContent = () => (
    <div className={`h-full flex flex-col transition-all duration-1000 ${showReal ? 'opacity-100' : 'opacity-0'}`}>
      {/* Mac Header */}
      <div className="h-6 md:h-8 border-b border-border/50 bg-card flex items-center px-2 md:px-4 gap-1.5">
        <div className="flex gap-1">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-destructive/60" />
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-chart-4/60" />
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-primary/10 text-[10px] md:text-xs text-primary font-medium flex items-center gap-1">
            <Sparkles className="h-2 w-2 md:h-3 md:w-3" />
            <span className="hidden sm:inline">Live Demo</span>
          </div>
        </div>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[10px] md:text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>
      
      {/* Mac Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-24 md:w-36 border-r border-border/50 p-1.5 md:p-2 space-y-1 hidden sm:block bg-card/50">
          <p className="text-[9px] md:text-[10px] font-medium text-muted-foreground mb-1.5 px-1">Workspace</p>
          {[
            { name: 'Invoice.pdf', type: 'pdf', size: '2.4 MB' },
            { name: 'Banner.png', type: 'image', size: '1.8 MB' },
            { name: 'Report.docx', type: 'doc', size: '890 KB' },
          ].map((file, i) => (
            <div 
              key={i}
              className={`flex items-center gap-1 px-1.5 py-1 rounded text-[9px] md:text-[10px] transition-all duration-300 ${
                (currentStep === 0 && file.type === 'pdf') || 
                (currentStep === 3 && file.type === 'image') ||
                (currentStep === 2 && file.type === 'doc')
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground'
              }`}
            >
              {file.type === 'pdf' ? <FileText className="h-2.5 w-2.5 md:h-3 md:w-3" /> : 
               file.type === 'image' ? <Image className="h-2.5 w-2.5 md:h-3 md:w-3" /> : 
               <FileText className="h-2.5 w-2.5 md:h-3 md:w-3" />}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-[8px] opacity-60 hidden md:block">{file.size}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Canvas */}
        <div className="flex-1 p-2 md:p-4 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-muted/20 to-transparent">
          <div className="relative w-full max-w-[180px] md:max-w-[220px]">
            {/* Step Indicator */}
            <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 flex items-center gap-1">
              {demoSteps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'bg-primary w-3 md:w-4' : i < currentStep ? 'bg-primary/40' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            {/* Current Step Card */}
            <div className="bg-card rounded-lg border border-border p-3 md:p-4 shadow-lg animate-scale-in">
              <div className="flex items-center justify-center mb-2 md:mb-3">
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const Icon = getStepIcon(demoSteps[currentStep].type);
                      return <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />;
                    })()}
                  </div>
                  <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-ping" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground text-[11px] md:text-sm mb-0.5">{demoSteps[currentStep].title}</h3>
                <p className="text-[9px] md:text-xs text-muted-foreground mb-2">{demoSteps[currentStep].description}</p>
                <div className="h-1 md:h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-[2500ms] ease-linear" style={{ width: '100%', animation: 'progress-fill 2.5s linear infinite' }} />
                </div>
                <p className="text-[8px] md:text-[10px] text-primary mt-1 flex items-center justify-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-primary animate-pulse" />
                  {demoSteps[currentStep].action}
                </p>
              </div>
            </div>

            <div className="absolute -bottom-4 md:-bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[8px] md:text-[10px] text-muted-foreground">
              <Check className="h-2 w-2 md:h-3 md:w-3 text-primary" />
              <span>{currentStep + 1} of {demoSteps.length}</span>
            </div>
          </div>
        </div>
        
        {/* Tools Panel */}
        <div className="w-28 md:w-40 border-l border-border/50 p-1.5 md:p-2 hidden md:flex flex-col bg-card/50">
          <p className="text-[9px] md:text-[10px] font-medium text-muted-foreground mb-2">Quick Actions</p>
          <div className="space-y-1">
            {[
              { icon: RefreshCw, label: 'Convert', active: currentStep === 2 },
              { icon: Zap, label: 'Compress', active: currentStep === 3 },
              { icon: Type, label: 'OCR', active: currentStep === 1 },
              { icon: Crop, label: 'Crop', active: currentStep === 4 },
            ].map((tool, i) => (
              <div key={i} className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[9px] md:text-[10px] transition-all ${tool.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <tool.icon className={`h-2.5 w-2.5 md:h-3 md:w-3 ${tool.active ? 'animate-pulse' : ''}`} />
                <span className="font-medium">{tool.label}</span>
                {tool.active && <div className="ml-auto w-1 h-1 rounded-full bg-primary animate-pulse" />}
              </div>
            ))}
          </div>
          <div className="mt-auto pt-2 border-t border-border/50">
            <div className="rounded bg-accent/30 p-1.5 text-[9px] md:text-[10px]">
              <div className="flex items-center gap-1 text-foreground">
                <Check className="h-2 w-2 md:h-3 md:w-3 text-primary" />
                <span>Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="h-6 md:h-8 border-t border-border/50 bg-card/80 flex items-center px-2 md:px-4 gap-2 md:gap-4">
        <span className="text-[9px] md:text-xs text-muted-foreground">Timeline</span>
        <div className="flex-1 h-1.5 md:h-2 rounded-full bg-border overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }} />
        </div>
        <span className="text-[9px] md:text-xs text-primary font-medium">{currentStep + 1} actions</span>
      </div>
    </div>
  );

  // iPhone Preview Content
  const IPhoneContent = () => (
    <div className={`h-full flex flex-col transition-all duration-1000 ${showReal ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-5 bg-card flex items-center justify-center">
        <div className="w-12 h-1.5 rounded-full bg-muted" />
      </div>
      <div className="flex-1 p-2 flex flex-col items-center justify-center bg-gradient-to-b from-muted/20 to-transparent">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
          {(() => {
            const Icon = getStepIcon(demoSteps[currentStep].type);
            return <Icon className="h-5 w-5 text-primary" />;
          })()}
        </div>
        <p className="text-[8px] font-semibold text-foreground text-center">{demoSteps[currentStep].title}</p>
        <div className="w-full h-1 rounded-full bg-border mt-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '65%', animation: 'progress-fill 2.5s linear infinite' }} />
        </div>
      </div>
      <div className="h-8 bg-card border-t border-border/50 flex items-center justify-around px-2">
        <Upload className="h-3 w-3 text-muted-foreground" />
        <RefreshCw className="h-3 w-3 text-primary" />
        <Download className="h-3 w-3 text-muted-foreground" />
      </div>
    </div>
  );

  // iPad Preview Content  
  const IPadContent = () => (
    <div className={`h-full flex flex-col transition-all duration-1000 ${showReal ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-6 border-b border-border/50 bg-card flex items-center px-3 gap-1.5">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-chart-4/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-2 py-0.5 rounded-full bg-primary/10 text-[8px] text-primary font-medium flex items-center gap-1">
            <Sparkles className="h-2 w-2" />
            Preview
          </div>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className="w-20 border-r border-border/50 p-1.5 space-y-1 bg-card/50">
          <p className="text-[7px] font-medium text-muted-foreground mb-1">Files</p>
          {['Invoice.pdf', 'Banner.png'].map((file, i) => (
            <div key={i} className={`px-1 py-0.5 rounded text-[7px] ${i === (currentStep === 3 ? 1 : 0) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
              {file}
            </div>
          ))}
        </div>
        <div className="flex-1 p-3 flex items-center justify-center bg-gradient-to-b from-muted/20 to-transparent">
          <div className="bg-card rounded-lg border border-border p-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
              {(() => {
                const Icon = getStepIcon(demoSteps[currentStep].type);
                return <Icon className="h-4 w-4 text-primary" />;
              })()}
            </div>
            <p className="text-[8px] font-semibold text-foreground text-center">{demoSteps[currentStep].title}</p>
            <p className="text-[7px] text-muted-foreground text-center">{demoSteps[currentStep].action}</p>
          </div>
        </div>
        <div className="w-24 border-l border-border/50 p-1.5 bg-card/50">
          <p className="text-[7px] font-medium text-muted-foreground mb-1.5">Tools</p>
          <div className="space-y-0.5">
            {[
              { icon: RefreshCw, label: 'Convert', active: currentStep === 2 },
              { icon: Maximize2, label: 'Resize', active: currentStep === 4 },
              { icon: Wand2, label: 'Enhance', active: false },
            ].map((tool, i) => (
              <div key={i} className={`flex items-center gap-1 px-1 py-0.5 rounded text-[7px] ${tool.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
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
      {/* Container with perspective */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        
        {/* iPhone Left */}
        <div className="relative hidden sm:block flex-shrink-0 transform -rotate-3 translate-y-4 hover:rotate-0 hover:translate-y-0 transition-transform duration-300">
          <div className="relative w-[80px] md:w-[100px] lg:w-[120px]">
            {/* iPhone Frame */}
            <div className="relative bg-foreground/90 rounded-[16px] md:rounded-[20px] lg:rounded-[24px] p-[3px] md:p-[4px] shadow-2xl">
              <div className="bg-card rounded-[14px] md:rounded-[18px] lg:rounded-[22px] overflow-hidden">
                <div className="aspect-[9/19.5] relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 md:h-5 bg-foreground/90 rounded-b-lg z-10" />
                  <IPhoneContent />
                </div>
              </div>
            </div>
            {/* iPhone label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
              iPhone
            </div>
          </div>
        </div>

        {/* Mac Desktop Center */}
        <div className="relative flex-shrink-0 z-10">
          <div className="relative w-[280px] sm:w-[380px] md:w-[480px] lg:w-[580px]">
            {/* Mac Frame */}
            <div className="relative bg-foreground/90 rounded-t-lg p-[2px] md:p-[3px] shadow-2xl">
              <div className="bg-card rounded-t-md overflow-hidden">
                <div className="aspect-[16/10] relative">
                  {/* Sketch Layer */}
                  <div className={`absolute inset-0 transition-opacity duration-1000 ${showReal ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <svg viewBox="0 0 960 600" className="w-full h-full" fill="none">
                      <g className="sketch-draw" style={{ strokeDashoffset: `${100 - sketchProgress}%` }}>
                        <rect x="0" y="0" width="960" height="40" className="stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 2" />
                        <circle cx="20" cy="20" r="5" className="stroke-destructive/40" strokeWidth="1.5" />
                        <circle cx="36" cy="20" r="5" className="stroke-chart-4/40" strokeWidth="1.5" />
                        <circle cx="52" cy="20" r="5" className="stroke-primary/40" strokeWidth="1.5" />
                      </g>
                      <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.2)}%` }}>
                        <rect x="0" y="40" width="180" height="560" className="stroke-muted-foreground/20" strokeWidth="1" strokeDasharray="6 3" />
                        <rect x="12" y="60" width="156" height="28" rx="4" className="stroke-primary/40" strokeWidth="1" />
                      </g>
                      <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.5)}%` }}>
                        <rect x="200" y="60" width="560" height="440" rx="8" className="stroke-muted-foreground/20" strokeWidth="2" strokeDasharray="8 4" />
                        <rect x="280" y="140" width="400" height="280" rx="6" className="stroke-primary/30" strokeWidth="1.5" />
                      </g>
                      <g className="sketch-draw" style={{ strokeDashoffset: `${Math.max(0, 100 - sketchProgress * 1.8)}%` }}>
                        <rect x="780" y="40" width="180" height="560" className="stroke-muted-foreground/20" strokeWidth="1" strokeDasharray="6 3" />
                      </g>
                    </svg>
                  </div>
                  <MacContent />
                </div>
              </div>
            </div>
            {/* Mac Stand */}
            <div className="relative">
              <div className="h-2 md:h-3 bg-foreground/90 rounded-b-sm" />
              <div className="mx-auto w-1/3 h-10 md:h-14 bg-gradient-to-b from-foreground/90 to-foreground/70 rounded-b-lg" />
              <div className="mx-auto w-2/5 h-1 md:h-1.5 bg-foreground/60 rounded-b-full shadow-lg" />
            </div>
            {/* Mac label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium whitespace-nowrap">
              Mac Desktop
            </div>
          </div>
        </div>

        {/* iPad Right */}
        <div className="relative hidden sm:block flex-shrink-0 transform rotate-3 translate-y-6 hover:rotate-0 hover:translate-y-0 transition-transform duration-300">
          <div className="relative w-[110px] md:w-[140px] lg:w-[170px]">
            {/* iPad Frame */}
            <div className="relative bg-foreground/90 rounded-[12px] md:rounded-[16px] lg:rounded-[20px] p-[3px] md:p-[4px] shadow-2xl">
              <div className="bg-card rounded-[10px] md:rounded-[14px] lg:rounded-[18px] overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <IPadContent />
                </div>
              </div>
            </div>
            {/* iPad label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
              iPad
            </div>
          </div>
        </div>
      </div>

      {/* Seamless sync indicator */}
      <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="flex -space-x-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <span className="text-xs text-primary font-medium">Seamlessly synced across all devices</span>
        </div>
      </div>
    </div>
  );
};

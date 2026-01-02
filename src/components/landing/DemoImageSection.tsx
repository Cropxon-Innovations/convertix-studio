import { useState, useEffect } from "react";
import demoWorkflow from "@/assets/demo-workflow.png";

export const DemoImageSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-card/50 overflow-hidden">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            The Convertix Workflow
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            See how Convertix streamlines your document and image processing
          </p>
        </div>

        {/* Workflow Image */}
        <div className={`relative max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            <img 
              src={demoWorkflow} 
              alt="Convertix Workflow Demo" 
              className="w-full h-auto"
            />
            
            {/* Overlay to hide NotebookLM text in top-left */}
            <div className="absolute top-0 left-0 w-48 h-12 bg-gradient-to-r from-background via-background/95 to-transparent" />
            
            {/* Animated overlay highlight */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Key benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { title: "Unified Workspace", desc: "All your tools in one place" },
            { title: "Drag & Drop", desc: "Simply drop files to start" },
            { title: "Instant Results", desc: "Fast processing, quick downloads" },
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-4 md:p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in text-center"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">{feature.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import convertixDemo from "@/assets/convertix-demo.png";

export const DemoImageSection = () => {
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

        {/* Demo Image with animations */}
        <div className="relative max-w-6xl mx-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-3xl opacity-50" />
          
          {/* Image container with responsive sizing and animations */}
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl animate-fade-in group" style={{ animationDelay: '0.2s' }}>
            <img 
              src={convertixDemo} 
              alt="Convertix Demo - A unified conversion studio showing persistent workflow from fleeting tools to permanent studio" 
              className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
            />
            
            {/* Overlay gradient for better text readability on edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Key points below image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 max-w-5xl mx-auto">
          {[
            { title: "Permanent Workspace", desc: "Every action builds upon the last" },
            { title: "Unified Interface", desc: "Documents, images, and data in one place" },
            { title: "Visible Timeline", desc: "Track and revisit every action" },
            { title: "Always Available", desc: "Web and desktop, online or offline" },
          ].map((point, i) => (
            <div 
              key={i}
              className="p-4 md:p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-fade-in text-center"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">{point.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

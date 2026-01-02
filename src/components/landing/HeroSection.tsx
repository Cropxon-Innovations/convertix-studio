import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Download, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { VideoDialog } from "@/components/ui/VideoDialog";
import { DeviceMockups } from "./DeviceMockups";

export const HeroSection = () => {
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  
  const videoUrl = "https://cnxhrplbzrmfaihizpjd.supabase.co/storage/v1/object/public/convertix/CONVERTIX.mp4";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 md:mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Unified Conversion Studio</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4 md:mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            CONVERTIX
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            A conversion studio where work continues.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-fade-in px-4" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" asChild className="min-w-[160px] w-full sm:w-auto">
              <Link to="/studio">
                Open Studio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="min-w-[160px] w-full sm:w-auto" onClick={() => setShowVideoDialog(true)}>
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
            <Button size="lg" variant="ghost" asChild className="min-w-[160px] w-full sm:w-auto">
              <Link to="/desktop">
                <Download className="mr-2 h-4 w-4" />
                Download Desktop
              </Link>
            </Button>
          </div>
        </div>

        {/* Device Mockups - Mac, iPhone, iPad */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <DeviceMockups />
        </div>
      </div>

      {/* Video Dialog */}
      <VideoDialog
        open={showVideoDialog}
        onOpenChange={setShowVideoDialog}
        videoUrl={videoUrl}
      />
    </section>
  );
};

import { Link } from "react-router-dom";
import { StudioLayout } from "@/components/layout/StudioLayout";
import { Button } from "@/components/ui/button";
import { Video, Music, Film, Mic, ArrowRight, Bell } from "lucide-react";

const upcomingFeatures = [
  { icon: Video, label: "Video Compression", description: "Reduce video file sizes without quality loss" },
  { icon: Music, label: "Audio Extraction", description: "Extract audio from video files" },
  { icon: Film, label: "Format Conversion", description: "Convert between all major video formats" },
  { icon: Mic, label: "Transcoding", description: "Professional-grade transcoding options" },
];

const MediaStudio = () => {
  return (
    <StudioLayout>
      <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Bell className="h-4 w-4" />
            <span>Coming Soon</span>
          </div>

          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Video className="h-12 w-12 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Media Studio
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto">
            Audio and video conversion, compression, and extraction. 
            Your unified media processing workspace is on its way.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {upcomingFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  className="p-4 rounded-xl bg-card border border-border/50 text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground">{feature.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground pl-11">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/studio">
                Explore Other Studios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Footer */}
          <p className="mt-12 text-sm text-muted-foreground">
            Want early access? <Link to="/signin" className="text-primary hover:underline">Create an account</Link> and we'll notify you when it launches.
          </p>
        </div>
      </div>
    </StudioLayout>
  );
};

export default MediaStudio;

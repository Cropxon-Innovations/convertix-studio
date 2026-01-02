import { Link } from "react-router-dom";
import { FileText, Image, Code, Video, ArrowRight, Sparkles } from "lucide-react";
import { StudioLayout } from "@/components/layout/StudioLayout";

const studios = [
  {
    id: "documents",
    name: "Document Studio",
    description: "Convert, compress, OCR, and edit documents. Your complete workspace for PDFs, Word files, spreadsheets, and more.",
    icon: FileText,
    href: "/studio/documents",
    available: true,
    features: ["PDF Conversion", "OCR Text Extraction", "Document Merge", "Compression"]
  },
  {
    id: "images",
    name: "Image Studio",
    description: "Resize, compress, convert, and batch process images. All formats supported with persistent history.",
    icon: Image,
    href: "/studio/images",
    available: true,
    features: ["Format Conversion", "Batch Resize", "Compression", "Background Removal"]
  },
  {
    id: "developer",
    name: "Developer Studio",
    description: "Professional tools for developers and QA. JSON, YAML, Base64, regex, and data transformation utilities.",
    icon: Code,
    href: "/studio/developer",
    available: true,
    features: ["JSON ↔ YAML", "Base64 Encode/Decode", "Regex Testing", "Data Validation"]
  },
  {
    id: "media",
    name: "Media Studio",
    description: "Audio and video conversion, compression, and extraction. Your unified media processing workspace.",
    icon: Video,
    href: "/studio/media",
    available: false,
    features: ["Video Compression", "Audio Extraction", "Format Conversion", "Transcoding"]
  }
];

const StudioHub = () => {
  return (
    <StudioLayout>
      <div className="min-h-[calc(100vh-7rem)] py-12">
        <div className="container">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Choose Your Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Studio Hub
            </h1>
            <p className="text-lg text-muted-foreground">
              Select a studio to begin. Your work will be saved and available across all sessions.
            </p>
          </div>

          {/* Studio Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {studios.map((studio) => {
              const Icon = studio.icon;
              return (
                <Link
                  key={studio.id}
                  to={studio.available ? studio.href : "#"}
                  className={`group relative p-8 rounded-2xl bg-card border border-border/50 transition-all duration-300 ${
                    studio.available 
                      ? 'hover:border-primary/30 hover:shadow-xl cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-foreground">
                      {studio.name}
                    </h2>
                    {!studio.available && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {studio.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {studio.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Arrow */}
                  {studio.available && (
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span>Open Studio</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              All studios share the same workspace. Your files and history are automatically synced.
            </p>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
};

export default StudioHub;

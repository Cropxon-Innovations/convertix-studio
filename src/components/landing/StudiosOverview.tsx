import { Link } from "react-router-dom";
import { FileText, Image, Code, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const studios = [
  {
    id: "documents",
    name: "Document Studio",
    description: "Convert, compress, OCR, and edit documents. PDFs, Word files, spreadsheets, and more.",
    icon: FileText,
    href: "/studio/documents",
    available: true
  },
  {
    id: "images",
    name: "Image Studio",
    description: "Resize, compress, convert, and batch process images. All formats supported.",
    icon: Image,
    href: "/studio/images",
    available: true
  },
  {
    id: "developer",
    name: "Developer Studio",
    description: "JSON, YAML, Base64, regex, and more. Professional tools for developers and QA.",
    icon: Code,
    href: "/studio/developer",
    available: true
  },
  {
    id: "media",
    name: "Media Studio",
    description: "Audio and video conversion, compression, and extraction. Coming soon.",
    icon: Video,
    href: "/studio/media",
    available: false
  }
];

export const StudiosOverview = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-4">Studio Modules</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Four studios, one workspace
          </h2>
          <p className="text-lg text-muted-foreground">
            Each studio is designed for a specific type of work, but they all share the same persistent timeline and workspace philosophy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {studios.map((studio) => {
            const Icon = studio.icon;
            return (
              <Link
                key={studio.id}
                to={studio.href}
                className={`group relative p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 ${
                  !studio.available ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {studio.name}
                      </h3>
                      {!studio.available && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {studio.description}
                    </p>
                  </div>
                </div>
                {studio.available && (
                  <ArrowRight className="absolute top-6 right-6 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/studio">
              Open Studio Hub
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

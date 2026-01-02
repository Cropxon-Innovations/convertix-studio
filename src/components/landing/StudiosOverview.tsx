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
    <section className="py-16 md:py-24 bg-card/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <p className="text-sm font-medium text-primary mb-3 md:mb-4">Studio Modules</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
            Four studios, one workspace
          </h2>
          <p className="text-base md:text-lg text-muted-foreground px-4 md:px-0">
            Each studio is designed for a specific type of work, but they all share the same persistent timeline and workspace philosophy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {studios.map((studio, index) => {
            const Icon = studio.icon;
            return (
              <Link
                key={studio.id}
                to={studio.href}
                className={`group relative p-5 md:p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  !studio.available ? 'opacity-60 pointer-events-none' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 md:w-14 h-12 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-6 md:h-7 w-6 md:w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 md:mb-2 flex-wrap">
                      <h3 className="text-base md:text-lg font-semibold text-foreground">
                        {studio.name}
                      </h3>
                      {!studio.available && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {studio.description}
                    </p>
                  </div>
                </div>
                {studio.available && (
                  <ArrowRight className="absolute top-5 md:top-6 right-5 md:right-6 h-4 md:h-5 w-4 md:w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Button size="lg" asChild className="transition-all duration-200 hover:scale-105">
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

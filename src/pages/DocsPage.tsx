import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Book, FileText, Code, Rocket, ArrowRight, ExternalLink } from "lucide-react";

const sections = [
  {
    icon: Rocket,
    title: "Getting Started",
    description: "Learn the basics of CONVERTIX and set up your first workspace.",
    links: [
      { label: "Quick Start Guide", href: "#" },
      { label: "Understanding the Studio", href: "#" },
      { label: "Account Setup", href: "#" }
    ]
  },
  {
    icon: FileText,
    title: "Document Studio",
    description: "Convert, compress, OCR, and merge documents.",
    links: [
      { label: "Supported Formats", href: "#" },
      { label: "OCR & Text Extraction", href: "#" },
      { label: "Batch Processing", href: "#" }
    ]
  },
  {
    icon: Code,
    title: "Developer Studio",
    description: "JSON, YAML, Base64, and data transformation tools.",
    links: [
      { label: "Data Transformation", href: "#" },
      { label: "Regex Testing", href: "#" },
      { label: "API Reference", href: "#" }
    ]
  },
  {
    icon: Book,
    title: "FAQ",
    description: "Frequently asked questions about CONVERTIX.",
    links: [
      { label: "Pricing & Plans", href: "#" },
      { label: "Privacy & Security", href: "#" },
      { label: "Desktop App", href: "#" }
    ]
  }
];

const DocsPage = () => {
  return (
    <MainLayout>
      <section className="py-24">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about CONVERTIX.
            </p>
          </div>

          {/* Doc Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className="p-6 rounded-xl bg-card border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {section.description}
                  </p>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                        >
                          <ArrowRight className="h-3 w-3" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="max-w-2xl mx-auto mt-16 p-8 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Need more help?
            </h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:support@convertix.io">
                  Contact Support
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild>
                <Link to="/studio">
                  Open Studio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DocsPage;

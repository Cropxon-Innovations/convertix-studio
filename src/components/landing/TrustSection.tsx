import { Shield, Eye, Server, Lock } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your files are processed securely and never shared with third parties."
  },
  {
    icon: Eye,
    title: "No Hidden Costs",
    description: "Transparent pricing. No surprise charges or aggressive upsells."
  },
  {
    icon: Server,
    title: "Your Data, Your Control",
    description: "Export everything anytime. We never lock you in."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-level encryption for all file transfers and storage."
  }
];

export const TrustSection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-4">Trust & Privacy</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Built on trust
          </h2>
          <p className="text-lg text-muted-foreground">
            CONVERTIX is designed by CropXon with privacy and transparency at its core.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-card border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CropXon Branding */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">CONVERTIX</span> by CropXon
          </p>
        </div>
      </div>
    </section>
  );
};

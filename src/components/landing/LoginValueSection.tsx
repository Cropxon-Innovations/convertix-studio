import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Eye, Lock, Download, Cloud, Smartphone } from "lucide-react";

const guestFeatures = [
  { icon: Eye, label: "Full preview & editing" },
  { icon: Check, label: "Try all tools" },
  { icon: Lock, label: "No data collection" }
];

const memberFeatures = [
  { icon: Download, label: "Download files" },
  { icon: Cloud, label: "Auto-save & sync" },
  { icon: Smartphone, label: "Cross-device access" }
];

export const LoginValueSection = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-4">Login Value</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Try first, commit later
          </h2>
          <p className="text-lg text-muted-foreground">
            No signup walls. No forced accounts. Use CONVERTIX freely, and sign in only when you want to save your work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Guest */}
          <div className="p-8 rounded-xl bg-background border border-border">
            <p className="text-sm text-muted-foreground mb-2">Without account</p>
            <h3 className="text-xl font-semibold text-foreground mb-6">Guest Access</h3>
            <ul className="space-y-4 mb-8">
              {guestFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-foreground">{feature.label}</span>
                  </li>
                );
              })}
            </ul>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/studio">Try as Guest</Link>
            </Button>
          </div>

          {/* Member */}
          <div className="p-8 rounded-xl bg-card border-2 border-primary/20 relative">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              Recommended
            </div>
            <p className="text-sm text-primary mb-2">With free account</p>
            <h3 className="text-xl font-semibold text-foreground mb-6">Full Access</h3>
            <ul className="space-y-4 mb-8">
              {memberFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feature.label}</span>
                  </li>
                );
              })}
            </ul>
            <Button className="w-full" asChild>
              <Link to="/signin">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

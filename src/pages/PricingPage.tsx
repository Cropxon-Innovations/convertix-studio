import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "For personal projects and trying out CONVERTIX",
    price: "$0",
    period: "forever",
    features: [
      "Unlimited conversions",
      "All file formats",
      "Full preview before download",
      "Temporary workspace (24h)",
      "Community support"
    ],
    cta: "Start Free",
    href: "/studio",
    highlighted: false
  },
  {
    name: "Pro",
    description: "For professionals who need persistent workspaces",
    price: "$12",
    period: "per month",
    features: [
      "Everything in Free",
      "Persistent workspace",
      "Unlimited history & versions",
      "Download all formats",
      "Cross-device sync",
      "Priority processing",
      "Email support"
    ],
    cta: "Get Started",
    href: "/signin",
    highlighted: true
  },
  {
    name: "Team",
    description: "For teams that collaborate on documents and assets",
    price: "$29",
    period: "per seat / month",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Shared history",
      "Admin controls",
      "SSO integration",
      "API access",
      "Dedicated support"
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false
  }
];

const PricingPage = () => {
  return (
    <MainLayout>
      <section className="py-24 md:py-32">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Try everything for free. Upgrade when you need persistent workspaces.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl ${
                  plan.highlighted
                    ? 'bg-card border-2 border-primary shadow-xl'
                    : 'bg-card border border-border/50'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link to={plan.href}>
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Link */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              Have questions? <Link to="/docs" className="text-primary hover:underline">Read our FAQ</Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PricingPage;

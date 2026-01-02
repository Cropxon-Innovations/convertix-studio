import { Clock, GitBranch, History, Layers } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Persistent Timeline",
    description: "Every action is recorded. Scroll through your work history and revisit any state."
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Create branches, compare versions, and never lose a previous iteration."
  },
  {
    icon: History,
    title: "Work History",
    description: "All your projects are saved automatically. Pick up exactly where you left off."
  },
  {
    icon: Layers,
    title: "Cross-Session Context",
    description: "Your workspace remembers. Files, settings, and preferences persist across sessions."
  }
];

export const ContinuitySection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-4">Work Continuity</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Your work evolves over time
          </h2>
          <p className="text-lg text-muted-foreground">
            Unlike disposable tools, CONVERTIX maintains a complete history of your work. Every conversion, every edit, every version.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border/50 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

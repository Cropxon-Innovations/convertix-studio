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
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <p className="text-sm font-medium text-primary mb-3 md:mb-4">Work Continuity</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
            Your work evolves over time
          </h2>
          <p className="text-base md:text-lg text-muted-foreground px-4 md:px-0">
            Unlike disposable tools, CONVERTIX maintains a complete history of your work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-5 md:p-6 rounded-xl bg-card border border-border/50 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
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

import { AlertCircle, Layers, RefreshCw } from "lucide-react";

const problems = [
  {
    icon: Layers,
    title: "Scattered Tools",
    description: "You juggle between 10 different websites to convert, compress, and edit your files."
  },
  {
    icon: RefreshCw,
    title: "Repetitive Work",
    description: "Every conversion starts from zero. No history, no context, no continuity."
  },
  {
    icon: AlertCircle,
    title: "Lost Downloads",
    description: "Files vanish into your downloads folder, never to be found again."
  }
];

export const ProblemSection = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-4">The Problem</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Conversion tools are fragmented and forgetful
          </h2>
          <p className="text-lg text-muted-foreground">
            The current landscape of file conversion is broken. You waste time, lose work, and start over constantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className="relative p-6 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

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
    <section className="py-16 md:py-24 bg-card/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <p className="text-sm font-medium text-primary mb-3 md:mb-4">The Problem</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
            Conversion tools are fragmented and forgetful
          </h2>
          <p className="text-base md:text-lg text-muted-foreground px-4 md:px-0">
            The current landscape of file conversion is broken. You waste time, lose work, and start over constantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className="relative p-5 md:p-6 rounded-xl bg-card border border-border/50 hover:border-destructive/30 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-5 md:h-6 w-5 md:w-6 text-destructive" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
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

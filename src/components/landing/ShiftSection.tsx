import { ArrowRight, Wrench, LayoutDashboard, Download, FolderOpen } from "lucide-react";

const shifts = [
  {
    from: { icon: Wrench, label: "Isolated Tools" },
    to: { icon: LayoutDashboard, label: "Unified Studio" }
  },
  {
    from: { icon: Download, label: "One-Time Downloads" },
    to: { icon: FolderOpen, label: "Persistent Workspace" }
  }
];

export const ShiftSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <p className="text-sm font-medium text-primary mb-3 md:mb-4">The Shift</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
            From tools to a studio
          </h2>
          <p className="text-base md:text-lg text-muted-foreground px-4 md:px-0">
            CONVERTIX reimagines file conversion as a continuous workspace.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 md:space-y-8">
          {shifts.map((shift, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8 p-4 md:p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg bg-muted/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <shift.from.icon className="h-4 md:h-5 w-4 md:w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">From</p>
                  <p className="text-sm md:text-base font-medium text-foreground">{shift.from.label}</p>
                </div>
              </div>
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-primary/10 flex items-center justify-center rotate-90 sm:rotate-0">
                <ArrowRight className="h-4 md:h-5 w-4 md:w-5 text-primary" />
              </div>
              <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <shift.to.icon className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-primary mb-0.5">To</p>
                  <p className="text-sm md:text-base font-medium text-foreground">{shift.to.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

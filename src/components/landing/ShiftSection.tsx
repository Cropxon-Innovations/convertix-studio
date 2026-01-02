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
    <section className="py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary mb-4">The Shift</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            From tools to a studio
          </h2>
          <p className="text-lg text-muted-foreground">
            CONVERTIX reimagines file conversion as a continuous workspace, not a collection of disconnected utilities.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {shifts.map((shift, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-6 rounded-xl bg-card border border-border/50"
            >
              {/* From */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                  <shift.from.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">From</p>
                  <p className="font-medium text-foreground">{shift.from.label}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>

              {/* To */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <shift.to.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-primary mb-1">To</p>
                  <p className="font-medium text-foreground">{shift.to.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

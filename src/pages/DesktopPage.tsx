import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Download, Monitor, Wifi, WifiOff, RefreshCw, 
  Shield, Zap, HardDrive, ArrowRight, Apple, 
  Chrome
} from "lucide-react";

const features = [
  {
    icon: WifiOff,
    title: "Offline First",
    description: "Work without internet. Your files are processed locally on your machine."
  },
  {
    icon: HardDrive,
    title: "Local Cache",
    description: "Fast access to recent files. No re-uploading needed."
  },
  {
    icon: Zap,
    title: "Background Processing",
    description: "Large files process in the background. Keep working while we handle the rest."
  },
  {
    icon: RefreshCw,
    title: "Auto-Sync",
    description: "When online, your workspace syncs automatically with the cloud."
  }
];

const DesktopPage = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Monitor className="h-4 w-4" />
              <span>Desktop Application</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              CONVERTIX Desktop
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              The full power of CONVERTIX, running locally on your machine. 
              Work offline, process faster, sync when ready.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="min-w-[200px]">
                <Download className="mr-2 h-5 w-5" />
                Download for macOS
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px]">
                <Download className="mr-2 h-5 w-5" />
                Download for Windows
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Also available for Linux. <Link to="#" className="text-primary hover:underline">View all downloads</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Desktop?
            </h2>
            <p className="text-lg text-muted-foreground">
              Some work is better done locally. Desktop gives you speed, privacy, and freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl bg-card border border-border/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Same Workspace */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Same workspace, everywhere
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Your projects, history, and settings sync seamlessly between web and desktop. 
                  Start on your laptop, continue on the web, finish on another machine.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wifi className="h-3 w-3 text-primary" />
                    </div>
                    Automatic cloud sync when online
                  </li>
                  <li className="flex items-center gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-3 w-3 text-primary" />
                    </div>
                    Secure, encrypted file transfer
                  </li>
                  <li className="flex items-center gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <RefreshCw className="h-3 w-3 text-primary" />
                    </div>
                    Conflict-free merge resolution
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-card border border-border/50 p-8 flex items-center justify-center">
                  <div className="relative">
                    {/* Desktop Icon */}
                    <div className="w-32 h-32 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Monitor className="h-16 w-16 text-primary" />
                    </div>
                    {/* Sync Arrow */}
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                      <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                    {/* Web Icon */}
                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-16 h-16 rounded-xl bg-accent flex items-center justify-center">
                      <Chrome className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to go native?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Download CONVERTIX Desktop and experience the full power of local processing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <a href="#">
                  <Apple className="mr-2 h-5 w-5" />
                  macOS
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#">
                  <Monitor className="mr-2 h-5 w-5" />
                  Windows
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DesktopPage;

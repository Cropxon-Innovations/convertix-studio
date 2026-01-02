import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Upload, Download, Sparkles, LucideIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ToolLandingPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  features: string[];
  steps: Step[];
  acceptedFormats: string;
  onStartClick: () => void;
}

export const ToolLandingPage = ({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
  features,
  steps,
  acceptedFormats,
  onStartClick,
}: ToolLandingPageProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStartClick();
    }, 300);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-muted/30 ${isAnimating ? "animate-out fade-out-0 duration-300" : "animate-in fade-in-0 duration-500"}`}>
      {/* Hero Section */}
      <div className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl ${bgColor} mb-6 animate-in zoom-in-50 duration-500`}>
            <Icon className={`w-10 h-10 md:w-12 md:h-12 ${iconColor}`} />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500 delay-200">
            {description}
          </p>

          <Button 
            size="lg" 
            onClick={handleStart}
            className="gap-2 text-lg px-8 py-6 animate-in slide-in-from-bottom-4 duration-500 delay-300"
          >
            Start Now
            <ArrowRight className="w-5 h-5" />
          </Button>

          <p className="text-sm text-muted-foreground mt-4 animate-in fade-in-0 duration-500 delay-500">
            Supports: {acceptedFormats}
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className={`relative bg-card border border-border rounded-xl p-6 text-center animate-in slide-in-from-bottom-4 duration-500`}
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              {/* Step Number */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
                <span className={`text-sm font-bold ${iconColor}`}>{step.number}</span>
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center mx-auto mb-4 mt-2`}>
                <step.icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={feature}
                className={`flex items-start gap-3 p-4 rounded-lg bg-card border border-border animate-in slide-in-from-left-4 duration-500`}
                style={{ animationDelay: `${600 + index * 50}ms` }}
              >
                <CheckCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Preview Section */}
      <div className="container py-12 md:py-16">
        <div className={`max-w-4xl mx-auto rounded-2xl ${bgColor} border border-border p-8 md:p-12`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Animated file preview */}
            <div className="flex-1 flex items-center justify-center gap-4">
              <div className="relative">
                {/* File dropping animation */}
                <div className="w-20 h-24 md:w-24 md:h-28 bg-card rounded-lg border-2 border-dashed border-border flex items-center justify-center animate-pulse">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              
              <ArrowRight className="w-8 h-8 text-muted-foreground animate-pulse" />
              
              <div className="relative">
                <div className="w-20 h-24 md:w-24 md:h-28 bg-card rounded-lg border-2 border-primary/50 flex items-center justify-center">
                  <Download className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-muted-foreground mb-4">
                No registration required. Your files are processed securely and deleted after conversion.
              </p>
              <Button onClick={handleStart} size="lg" className="gap-2">
                Try It Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

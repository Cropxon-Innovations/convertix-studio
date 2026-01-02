import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Lock, User, Loader2, FileText, Image, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const SignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/studio');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign up failed",
            description: error.message
          });
        } else {
          toast({
            title: "Account created!",
            description: "Welcome to CONVERTIX. You're now signed in."
          });
          navigate('/studio');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: error.message
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You're now signed in."
          });
          navigate('/studio');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 overflow-hidden">
        <div className="w-full max-w-5xl flex gap-12 items-center">
          {/* Left side - Animated Studio Preview */}
          <div className="hidden lg:block flex-1 relative">
            {/* Floating elements with smooth animations */}
            <div className="relative h-[500px] flex items-center justify-center">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent animate-pulse-slow" />
              
              {/* Main preview card */}
              <div className="relative w-full max-w-md">
                {/* Sketch layer that fades out */}
                <div className="absolute inset-0 opacity-30 animate-sketch-fade">
                  <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4">
                    <rect x="10" y="10" width="380" height="280" rx="12" className="text-primary/40" />
                    <rect x="20" y="50" width="100" height="20" rx="4" className="text-muted-foreground" />
                    <rect x="20" y="80" width="80" height="16" rx="4" className="text-muted-foreground" />
                    <rect x="20" y="105" width="90" height="16" rx="4" className="text-muted-foreground" />
                    <circle cx="350" cy="30" r="10" className="text-primary/40" />
                  </svg>
                </div>
                
                {/* Real UI that fades in */}
                <div className="relative rounded-xl border border-border bg-card/90 backdrop-blur shadow-2xl overflow-hidden animate-real-fade-in">
                  {/* Header */}
                  <div className="h-12 border-b border-border/50 bg-background/50 flex items-center px-4 gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60 animate-dot-pulse" style={{ animationDelay: '0s' }} />
                      <div className="w-3 h-3 rounded-full bg-chart-4/60 animate-dot-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-3 h-3 rounded-full bg-primary/60 animate-dot-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-xs text-primary font-medium flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        Your Workspace
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Animated file items */}
                    {[
                      { icon: FileText, name: 'Report.pdf', status: 'Converted', delay: '0.6s' },
                      { icon: Image, name: 'Banner.png', status: 'Optimized', delay: '0.8s' },
                      { icon: FileText, name: 'Invoice.docx', status: 'Processing', delay: '1s' }
                    ].map((item, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 animate-slide-in-stagger"
                        style={{ animationDelay: item.delay }}
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.status}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Processing' ? 'bg-chart-4 animate-pulse' : 'bg-primary'}`} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Timeline bar */}
                  <div className="h-10 border-t border-border/50 bg-background/30 flex items-center px-4 gap-3">
                    <span className="text-xs text-muted-foreground">History</span>
                    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full animate-timeline-fill" />
                    </div>
                    <span className="text-xs text-primary font-medium">3 versions</span>
                  </div>
                </div>
              </div>
              
              {/* Floating decorations */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-20 left-10 w-16 h-16 bg-chart-2/10 rounded-full blur-2xl animate-float-delayed" />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Header */}
            <div className="text-center lg:text-left mb-8 animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp 
                  ? "Start using CONVERTIX with a free account" 
                  : "Sign in to access your workspace"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              <div className="animate-fade-in" style={{ animationDelay: isSignUp ? '0.2s' : '0.1s' }}>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                  />
                </div>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: isSignUp ? '0.3s' : '0.2s' }}>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full animate-fade-in transition-all duration-200 hover:shadow-lg" 
                size="lg"
                disabled={isLoading}
                style={{ animationDelay: isSignUp ? '0.4s' : '0.3s' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignUp ? "Creating..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Create one
                  </button>
                </>
              )}
            </p>

            {/* Back to Studio */}
            <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Link to="/studio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Continue without signing in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignInPage;

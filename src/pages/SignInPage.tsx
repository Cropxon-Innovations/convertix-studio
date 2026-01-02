import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination or default to /studio
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/studio';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

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
          navigate(from, { replace: true });
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
          navigate(from, { replace: true });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: error.message
      });
      setIsGoogleLoading(false);
    }
    // Don't set loading to false on success - the redirect will happen
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

            {/* Google Sign In Button */}
            <Button 
              variant="outline" 
              className="w-full mb-6 animate-fade-in" 
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
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

              <div className="animate-fade-in" style={{ animationDelay: isSignUp ? '0.2s' : '0.15s' }}>
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

              <div className="animate-fade-in" style={{ animationDelay: isSignUp ? '0.25s' : '0.2s' }}>
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
                style={{ animationDelay: isSignUp ? '0.3s' : '0.25s' }}
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
            <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: '0.35s' }}>
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
            <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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

import { Button } from "@/components/ui/button";
import { Sparkles, Eye, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/auth/auth-context";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/login-dialog";
import { RegisterDialog } from "@/components/auth/register-dialog";

export function HeroSection() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      setLocation("/dashboard");
    } else {
      setShowRegister(true);
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center subtle-bg">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight">
            <span className="text-foreground">Unveil the</span><br />
            <span className="text-gradient">
              Cosmic Mysteries
            </span><br />
            <span className="text-foreground text-3xl md:text-4xl lg:text-5xl">within You</span>
          </h1>
          
          <p className="text-lg md:text-xl text-secondary-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover the secrets of your destiny through ancient wisdom powered by AI. 
            Explore palmistry, astrology, Vastu, numerology, and tarot readings with unprecedented accuracy and insight.
          </p>
          
          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="accent-gradient text-white px-8 py-4 text-lg font-medium hover:opacity-90 transition-all hover-lift"
              data-testid="button-get-started"
            >
              {user ? (
                <>
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Your Reading
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-border text-foreground hover:bg-muted px-8 py-4 text-lg font-medium hover-lift"
              data-testid="button-learn-more"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Eye className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
          
          {/* Clean Stats or Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient mb-2">5</div>
              <div className="text-sm text-muted-foreground">Mystical Arts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient mb-2">AI</div>
              <div className="text-sm text-muted-foreground">Powered Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Dialogs */}
      <LoginDialog
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterDialog
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </section>
  );
}

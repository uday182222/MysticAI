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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mystical Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Mystical Runes */}
          <div className="flex justify-center space-x-8 mb-8 opacity-70">
            <span className="rune text-2xl">ᚱ</span>
            <span className="rune text-3xl">ᚢ</span>
            <span className="rune text-2xl">ᚾ</span>
            <span className="rune text-3xl">ᚨ</span>
            <span className="rune text-2xl">ᚱ</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-mystical font-bold mb-8 leading-tight">
            <span className="glow">Unveil the</span><br />
            <span className="text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text">
              Cosmic Mysteries
            </span><br />
            <span className="glow text-4xl md:text-5xl lg:text-6xl">within You</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-ethereal text-secondary mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Journey through the ethereal realms of 
            <span className="text-purple-400 glow"> palmistry</span>,
            <span className="text-violet-400 glow"> astrology</span>, and
            <span className="text-indigo-400 glow"> mystical arts</span>. 
            Guided by ancient wisdom and cosmic AI precision, discover the secrets of your soul's blueprint.
          </p>
          {/* Mystical Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="mystical-btn px-12 py-6 text-xl font-mystical tracking-wide relative overflow-hidden group"
              data-testid="button-get-started"
            >
              <span className="relative z-10 flex items-center">
                {user ? (
                  <>
                    <ArrowRight className="mr-3 h-6 w-6" />
                    Enter the Realm
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-6 w-6" />
                    Begin Your Journey
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="glow-border px-12 py-6 text-xl font-ethereal bg-transparent text-purple-300 hover:text-purple-100 border-purple-400/50 hover:border-purple-300 transition-all duration-300 hover:bg-purple-900/20"
              data-testid="button-learn-more"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Eye className="mr-3 h-6 w-6" />
              Explore the Arts
            </Button>
          </div>
          
          {/* Mystical Separator */}
          <div className="flex justify-center items-center space-x-4 opacity-60">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-400"></div>
            <span className="rune text-lg">✦</span>
            <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-transparent"></div>
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

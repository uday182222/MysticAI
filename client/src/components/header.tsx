import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthHeader } from "@/components/auth/auth-header";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full accent-gradient flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground group-hover:text-accent transition-colors duration-300">
              MysticRead<span className="text-accent"> AI</span>
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-card-foreground hover:text-accent transition-colors duration-300">
              Features
            </a>
            <a href="#how-it-works" className="text-card-foreground hover:text-accent transition-colors duration-300">
              How It Works
            </a>
            <a href="#about" className="text-card-foreground hover:text-accent transition-colors duration-300">
              About
            </a>
          </div>
          
          <div className="hidden md:flex">
            <AuthHeader />
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
        
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-2 pt-4">
              <a href="#features" className="text-card-foreground hover:text-accent transition-colors py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-card-foreground hover:text-accent transition-colors py-2">
                How It Works
              </a>
              <a href="#about" className="text-card-foreground hover:text-accent transition-colors py-2">
                About
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

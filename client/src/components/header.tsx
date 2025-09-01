import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthHeader } from "@/components/auth/auth-header";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <h1 className="text-2xl font-mystical font-bold text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
              MysticRead<span className="text-purple-400"> AI</span>
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="font-ethereal text-purple-300 hover:text-purple-100 transition-colors duration-300 hover:glow">
              Sacred Arts
            </a>
            <a href="#how-it-works" className="font-ethereal text-purple-300 hover:text-purple-100 transition-colors duration-300 hover:glow">
              The Ritual
            </a>
            <a href="#about" className="font-ethereal text-purple-300 hover:text-purple-100 transition-colors duration-300 hover:glow">
              Mysteries
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
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2 pt-4">
              <a href="#features" className="text-secondary hover:text-primary transition-colors py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-secondary hover:text-primary transition-colors py-2">
                How It Works
              </a>
              <a href="#about" className="text-secondary hover:text-primary transition-colors py-2">
                About
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

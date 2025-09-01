import { Link } from "wouter";
import { Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthHeader } from "@/components/auth/auth-header";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Hand className="text-white text-sm" />
            </div>
            <h1 className="text-xl font-bold text-primary">MysticRead AI</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-secondary hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-secondary hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-secondary hover:text-primary transition-colors">
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

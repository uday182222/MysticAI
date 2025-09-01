import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "./auth-context";
import { LoginDialog } from "./login-dialog";
import { RegisterDialog } from "./register-dialog";
import { User, LogOut, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthHeader() {
  const { user, logout, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => setShowLogin(true)}
            data-testid="button-header-login"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => setShowRegister(true)}
            data-testid="button-header-register"
          >
            Get Started
          </Button>
        </div>

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
      </>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Badge variant="secondary" className="flex items-center space-x-1">
        <CreditCard className="h-3 w-3" />
        <span data-testid="text-user-credits">{user.credits} Credits</span>
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-user-menu">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user.firstName || user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            <div className="flex flex-col">
              <span className="font-medium">{user.firstName} {user.lastName}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
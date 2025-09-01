import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth-context";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginDialog({ isOpen, onClose, onSwitchToRegister }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      onClose();
      setEmail("");
      setPassword("");
      // Navigate to dashboard after successful login with a small delay to ensure user state is updated
      setTimeout(() => {
        setLocation("/dashboard");
      }, 100);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome Back</DialogTitle>
          <DialogDescription>
            Sign in to your account to continue your mystical journey
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              data-testid="input-login-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              data-testid="input-login-password"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="button-login-submit"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onSwitchToRegister}
              data-testid="button-switch-to-register"
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
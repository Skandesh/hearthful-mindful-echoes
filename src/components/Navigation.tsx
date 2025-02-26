
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { ChevronRight, LogOut, Menu, X } from "lucide-react";
import { AuthContext } from "../App";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const isHomePage = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <header className="py-4 px-4 md:px-6 border-b border-[#DEDBD980] bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
          <span className="font-bold">Hearth</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/app"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            App
          </Link>
          {isHomePage && (
            <>
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#studies"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Studies
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </>
          )}
          
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">
                Sign in
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 p-4 bg-background border-t border-[#DEDBD980]">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/app"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              App
            </Link>
            {isHomePage && (
              <>
                <a
                  href="#features"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#studies"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Studies
                </a>
                <a
                  href="#pricing"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </a>
              </>
            )}
            
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            ) : (
              <Button asChild size="sm" onClick={() => setIsMenuOpen(false)}>
                <Link to="/auth">
                  Sign in
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

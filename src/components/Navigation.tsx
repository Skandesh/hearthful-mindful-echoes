
import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { AuthContext } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Close mobile menu when route changes
    setOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
      });
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-[#9b87f5]/10 h-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold text-primary-foreground">Hearth</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-[#9b87f5] transition-colors px-3 py-2">
              Home
            </Link>
            <Link to="/app" className="text-gray-600 hover:text-[#9b87f5] transition-colors px-3 py-2">
              App
            </Link>
            {user ? (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-[#9b87f5]/20 text-[#9b87f5] hover:bg-[#9b87f5]/5"
              >
                Logout
              </Button>
            ) : (
              <Button 
                asChild
                className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:opacity-90 text-white"
              >
                <Link to="/auth">
                  Login
                </Link>
              </Button>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {open ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {open && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/95 backdrop-blur-md"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md hover:bg-[#9b87f5]/5 text-gray-600 hover:text-[#9b87f5]"
            >
              Home
            </Link>
            <Link 
              to="/app" 
              className="block px-3 py-2 rounded-md hover:bg-[#9b87f5]/5 text-gray-600 hover:text-[#9b87f5]"
            >
              App
            </Link>
            {user ? (
              <button 
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md hover:bg-[#9b87f5]/5 text-gray-600 hover:text-[#9b87f5]"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/auth" 
                className="block px-3 py-2 rounded-md bg-[#9b87f5]/10 text-[#9b87f5]"
              >
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;

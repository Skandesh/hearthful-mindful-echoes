
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from "./types";

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setAuthState(prev => ({ ...prev, loading: true }));
      const { data: { session } } = await supabase.auth.getSession();
      
      setAuthState({
        user: session?.user || null,
        isAuthenticated: !!session?.user,
        loading: false
      });
      
      // Redirect to auth page if not authenticated
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access all features",
        });
        navigate("/auth");
      }
    };

    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          loading: false
        });
        
        if (event === 'SIGNED_OUT') {
          navigate("/auth");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const requireAuth = (featureName?: string) => {
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: featureName 
          ? `Please sign in to use ${featureName}` 
          : "Please sign in to access this feature",
        duration: 3000
      });
      navigate("/auth");
      return false;
    }
    return true;
  };

  return {
    ...authState,
    requireAuth
  };
}

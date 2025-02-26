
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { WavyBackground } from "@/components/chat/WavyBackground";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both email and password",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Check your email for a confirmation link",
      });
      
      // For demo purposes, we'll automatically sign in the user
      await handleSignIn(e);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both email and password",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Redirect to app on successful login
      navigate("/app");
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <WavyBackground />
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl shadow-xl border-primary/20">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {view === "sign-in" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-gray-600">
            {view === "sign-in" 
              ? "Sign in to continue your healing journey" 
              : "Start your transformation with personalized affirmations"}
          </p>
        </div>
        
        <form onSubmit={view === "sign-in" ? handleSignIn : handleSignUp}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#9b87f5] to-[#543ab7] text-white"
              disabled={loading}
            >
              {loading 
                ? "Processing..." 
                : view === "sign-in" 
                  ? "Sign In" 
                  : "Sign Up"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {view === "sign-in" 
              ? "Don't have an account?" 
              : "Already have an account?"}
            {" "}
            <button
              type="button"
              className="text-primary font-medium"
              onClick={() => setView(view === "sign-in" ? "sign-up" : "sign-in")}
            >
              {view === "sign-in" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}

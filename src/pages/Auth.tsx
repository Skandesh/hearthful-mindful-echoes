
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (isSignUp: boolean) => {
    try {
      setLoading(true);
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: 'https://preview--hearthful-mindful-echoes.lovable.app/app'
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      
      toast({
        title: isSignUp ? "Welcome!" : "Welcome back!",
        description: isSignUp 
          ? "Please check your email to confirm your account."
          : "You've successfully signed in.",
      });

      if (!isSignUp) navigate("/app");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://preview--hearthful-mindful-echoes.lovable.app/app'
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-light to-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white/80 backdrop-blur">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to Hearth</h1>
          <p className="text-muted-foreground">Sign in or create an account to continue</p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => handleAuth(false)}
              disabled={loading}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAuth(true)}
              disabled={loading}
            >
              Sign Up
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
      </Card>
    </div>
  );
}

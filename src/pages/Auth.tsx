
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { WavyBackground } from "@/components/chat/WavyBackground";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, User, Mail, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/app");
      }
    };
    
    checkUserSession();
  }, [navigate]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      setSuccessMessage("Account created successfully! You can now sign in.");
      setView("sign-in");
      
    } catch (error: any) {
      if (error.message.includes("User already registered")) {
        setError("This email is already registered. Please sign in instead.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Show success message and redirect to app
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      navigate("/app");
      
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignInWithGoogle() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <WavyBackground />
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl shadow-xl border-primary/20">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            <span>Personalized Healing</span>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-[#543ab7] to-[#00acc1] text-transparent bg-clip-text mb-2">
            Welcome to Hearth
          </h1>
          <p className="text-gray-600">
            Your journey to better self-talk begins here
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue={view} onValueChange={(v) => setView(v as "sign-in" | "sign-up")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email-signin" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-1.5 text-gray-500" />
                    Email Address
                  </label>
                  <Input
                    id="email-signin"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password-signin" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Lock className="h-4 w-4 mr-1.5 text-gray-500" />
                    Password
                  </label>
                  <Input
                    id="password-signin"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#9b87f5] to-[#543ab7] text-white transition-all hover:opacity-90"
                  disabled={loading}
                >
                  {loading 
                    ? "Signing in..." 
                    : "Sign In"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-1.5 text-gray-500" />
                    Email Address
                  </label>
                  <Input
                    id="email-signup"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Lock className="h-4 w-4 mr-1.5 text-gray-500" />
                    Password
                  </label>
                  <Input
                    id="password-signup"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#9b87f5] to-[#543ab7] text-white transition-all hover:opacity-90"
                  disabled={loading}
                >
                  {loading 
                    ? "Creating account..." 
                    : "Create Account"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSignInWithGoogle}
              disabled={loading}
              className="w-full border-gray-300 hover:bg-gray-50 flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            By signing up, you agree to our 
            <a href="#" className="text-primary font-medium mx-1">Terms of Service</a>
            and
            <a href="#" className="text-primary font-medium ml-1">Privacy Policy</a>
          </p>
        </div>
      </Card>
    </div>
  );
}

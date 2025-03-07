
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, HelpCircle, Mail, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { SocialAuth } from "./SocialAuth";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      
      // Create a default plan for the new user
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_plans').insert({
            user_id: user.id,
            plan_type: 'free',
            affirmations_limit: 10,
            affirmations_used: 0
          });
        }
      } catch (planError) {
        console.error("Could not create default plan:", planError);
      }
      
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
    <div className="w-full max-w-md p-10 bg-white/80 backdrop-blur-xl shadow-xl border-primary/20">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
          <Sparkles className="w-4 h-4 mr-2" />
          <span>Personalized Healing</span>
        </div>
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-[#543ab7] to-[#00acc1] text-transparent bg-clip-text mb-3">
          Welcome to Hearth
        </h1>
        <p className="text-gray-600">
          Your journey to better self-talk begins here
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-7">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="mb-7 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue={view} onValueChange={(v) => setView(v as "sign-in" | "sign-up")}>
        <TabsList className="grid w-full grid-cols-2 mb-7">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Create Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sign-in">
          <SignInForm 
            email={email}
            setEmail={setEmail}
            password={password} 
            setPassword={setPassword}
            loading={loading}
            handleSignIn={handleSignIn}
          />
        </TabsContent>
        
        <TabsContent value="sign-up">
          <SignUpForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleSignUp={handleSignUp}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-7">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white/80 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <SocialAuth loading={loading} handleSignInWithGoogle={handleSignInWithGoogle} />
      </div>
      
      <div className="mt-7 pt-5 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          By signing up, you agree to our 
          <a href="#" className="text-primary font-medium mx-1.5">Terms of Service</a>
          and
          <a href="#" className="text-primary font-medium ml-1.5">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

import { Sparkles } from "lucide-react";

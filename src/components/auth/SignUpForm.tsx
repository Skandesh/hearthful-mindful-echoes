
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlanFeatures } from "./PlanFeatures";

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  handleSignUp: (e: React.FormEvent) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleSignUp
}) => {
  return (
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
        
        <div className="my-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Plan Information</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    All accounts start with a free plan. You can upgrade anytime after registration.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <PlanFeatures planType="free" />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#9b87f5] to-[#543ab7] text-white transition-all hover:opacity-90"
          disabled={loading}
        >
          {loading 
            ? "Creating account..." 
            : "Create Free Account"}
        </Button>
      </div>
    </form>
  );
};

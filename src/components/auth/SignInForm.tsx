
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AtSign, KeyRound } from "lucide-react";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  handleSignIn: (e: React.FormEvent) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleSignIn
}) => {
  return (
    <form onSubmit={handleSignIn}>
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email-signin" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            <AtSign className="h-4 w-4 mr-2 text-gray-500" />
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
        
        <div className="space-y-2">
          <label htmlFor="password-signin" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            <KeyRound className="h-4 w-4 mr-2 text-gray-500" />
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
          className="w-full bg-gradient-to-r from-[#9b87f5] to-[#543ab7] text-white transition-all hover:opacity-90 mt-2"
          disabled={loading}
        >
          {loading 
            ? "Signing in..." 
            : "Sign In"}
        </Button>
      </div>
    </form>
  );
};

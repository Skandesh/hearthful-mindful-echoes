
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WavyBackground } from "@/components/chat/WavyBackground";
import { AuthForm } from "@/components/auth/AuthForm";

export default function Auth() {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <WavyBackground />
      <Card className="w-full max-w-md">
        <AuthForm />
      </Card>
    </div>
  );
}

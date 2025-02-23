
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AffirmationSession, Message } from "./types";

export function useAffirmations() {
  const [affirmationSession, setAffirmationSession] = useState<AffirmationSession>({
    isActive: false,
    currentAffirmation: "",
    affirmations: [],
    index: 0
  });

  const startAffirmationSession = async (mood: string) => {
    const affirmations = await generateAffirmations(mood);
    setAffirmationSession({
      isActive: true,
      currentAffirmation: affirmations[0],
      affirmations,
      index: 0
    });
    return affirmations[0];
  };

  const generateAffirmations = async (mood: string) => {
    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: { 
        message: `Generate 5 short, powerful affirmations for someone feeling ${mood}. 
                 Make them personal and empowering. Just return the affirmations separated by |`,
      }
    });

    if (error) throw error;
    return data.response.split('|').map((a: string) => a.trim());
  };

  const handleAffirmationComplete = async () => {
    const nextIndex = affirmationSession.index + 1;
    if (nextIndex < affirmationSession.affirmations.length) {
      const nextAffirmation = affirmationSession.affirmations[nextIndex];
      setAffirmationSession(prev => ({
        ...prev,
        currentAffirmation: nextAffirmation,
        index: nextIndex
      }));
      return nextAffirmation;
    } else {
      setAffirmationSession({
        isActive: false,
        currentAffirmation: "",
        affirmations: [],
        index: 0
      });
      return null;
    }
  };

  return {
    affirmationSession,
    startAffirmationSession,
    handleAffirmationComplete
  };
}

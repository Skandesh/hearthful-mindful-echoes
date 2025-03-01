import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AffirmationSession, Message } from "./types";

export function useAffirmations() {
  const [affirmationSession, setAffirmationSession] = useState<AffirmationSession>({
    isActive: false,
    currentAffirmation: "",
    affirmations: [],
    index: 0,
    isFullscreen: false
  });

  const startAffirmationSession = async (mood: string) => {
    const affirmations = await generateAffirmations(mood);
    setAffirmationSession({
      isActive: true,
      currentAffirmation: affirmations[0],
      affirmations,
      index: 0,
      isFullscreen: false
    });
    return affirmations[0];
  };

  const toggleFullscreen = () => {
    setAffirmationSession(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen
    }));
  };

  const generateAffirmations = async (mood: string) => {
    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: { 
        message: `Create 5 transformative, deeply resonant affirmations for someone feeling ${mood}.
                 Each affirmation should:
                 - Begin with powerful "I" statements that feel personally meaningful
                 - Create immediate emotional shifts with vivid, sensory language
                 - Address both conscious and subconscious beliefs
                 - Balance aspirational quality with believability
                 - Feel emotionally satisfying to speak aloud
                 - Build progressively in emotional intensity
                 - Use rhythm and cadence for memorability
                 
                 Make the affirmations concise (under 10 words when possible), emotionally impactful, and focused on present-moment empowerment.
                 Each should plant a seed for long-term positive change in self-perception.
                 
                 Just return the affirmations separated by |`,
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
      // Session complete - generate a deeply affirming completion message
      const completeMessage = await generateCompletionMessage();
      setAffirmationSession({
        isActive: false,
        currentAffirmation: "",
        affirmations: [],
        index: 0,
        isFullscreen: false
      });
      return completeMessage;
    }
  };

  const generateCompletionMessage = async () => {
    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: { 
        message: `The user has just completed a full affirmation session. Create a deeply affirming, emotionally resonant message that:
                 1. Celebrates their commitment to self-growth
                 2. Reinforces the positive neural pathways they've just created
                 3. Helps them integrate this experience into their identity
                 4. Plants seeds for continued positive self-talk
                 5. Creates a sense of accomplishment and emotional uplift
                 
                 Make them feel genuinely proud of themselves while encouraging continued practice.`,
      }
    });

    if (error) throw error;
    return data.response;
  };

  return {
    affirmationSession,
    startAffirmationSession,
    handleAffirmationComplete,
    toggleFullscreen
  };
}

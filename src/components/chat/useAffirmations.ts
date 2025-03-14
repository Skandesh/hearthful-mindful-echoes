
import { useState } from "react";
import { AffirmationSession } from "./types";
import { generateAIResponse } from "./ChatService";
import { useToast } from "@/hooks/use-toast";

export function useAffirmations() {
  const initialSession: AffirmationSession = {
    isActive: false,
    isFullscreen: false,
    affirmations: [],
    currentAffirmation: "",
    index: 0
  };

  const [affirmationSession, setAffirmationSession] = useState<AffirmationSession>(initialSession);
  const { toast } = useToast();

  const resetAffirmationSession = () => {
    setAffirmationSession(initialSession);
  };

  const startAffirmationSession = async (mood: string): Promise<string> => {
    // Generate affirmations based on mood
    try {
      const basePrompt = "Generate 5 positive daily affirmations";
      const moodPrompt = mood ? ` for someone feeling ${mood}` : "";
      const prompt = `${basePrompt}${moodPrompt}. Format as a simple numbered list.`;
      
      console.log("Generating affirmations with prompt:", prompt);
      const response = await generateAIResponse(prompt);
      console.log("AI response:", response);
      
      // Extract the affirmations from the response
      const affirmations = response
        .split(/\d+\./) // Split by numbered list
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      console.log("Extracted affirmations:", affirmations);
      
      // Ensure we have at least one affirmation
      if (affirmations.length === 0) {
        throw new Error("Could not generate affirmations");
      }
      
      // Start the session
      const firstAffirmation = affirmations[0];
      console.log("Starting session with first affirmation:", firstAffirmation);
      
      setAffirmationSession({
        isActive: true,
        isFullscreen: false,
        affirmations,
        currentAffirmation: firstAffirmation,
        index: 0
      });
      
      toast({
        title: "Affirmation Session Started",
        description: "Repeat each affirmation to complete the session",
      });
      
      return firstAffirmation;
    } catch (error) {
      console.error("Failed to start affirmation session:", error);
      throw error;
    }
  };

  const handleAffirmationComplete = async (): Promise<string | null> => {
    if (!affirmationSession.isActive) return null;
    
    const nextIndex = affirmationSession.index + 1;
    
    // Check if this was the last affirmation
    if (nextIndex >= affirmationSession.affirmations.length) {
      // Session complete
      toast({
        title: "Session Complete",
        description: "You've completed all your affirmations!",
      });
      resetAffirmationSession();
      return null;
    }
    
    // Move to next affirmation
    const nextAffirmation = affirmationSession.affirmations[nextIndex];
    console.log("Moving to next affirmation:", nextAffirmation, "Index:", nextIndex);
    
    setAffirmationSession({
      ...affirmationSession,
      currentAffirmation: nextAffirmation,
      index: nextIndex
    });
    
    return nextAffirmation;
  };

  const toggleFullscreen = () => {
    if (affirmationSession.isActive) {
      setAffirmationSession({
        ...affirmationSession,
        isFullscreen: !affirmationSession.isFullscreen
      });
    }
  };

  return {
    affirmationSession,
    startAffirmationSession,
    handleAffirmationComplete,
    toggleFullscreen,
    resetAffirmationSession
  };
}

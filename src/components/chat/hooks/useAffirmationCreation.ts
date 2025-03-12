
import { useState } from "react";
import { generateAIResponse } from "../ChatService";
import { useToast } from "@/hooks/use-toast";

export function useAffirmationCreation(chatState: any) {
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  // Destructure needed properties
  const {
    message,
    language,
    duration,
    user,
    setLoading,
    setMessages,
    hasReachedLimit,
    userPlan,
    saveAffirmation
  } = chatState;

  // Affirmation creation function
  const createAffirmations = async (
    affirmationSession: any,
    startAffirmationSession: any
  ) => {
    // Validate if prompt is empty
    if (!message || message.trim() === '') {
      toast({
        variant: "destructive",
        title: "Empty prompt",
        description: "Please share how you're feeling or what you need affirmations for.",
        duration: 3000
      });
      return;
    }

    setLoading(true);
    try {
      // Check if user is authenticated
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to create affirmations",
          duration: 5000
        });
        setLoading(false);
        return;
      }

      // Check if free trial user has reached their limit
      if (user && hasReachedLimit && userPlan?.plan_type === 'free') {
        toast({
          variant: "destructive",
          title: "Free trial limit reached",
          description: "You've reached your limit of 10 affirmations. Upgrade your plan to continue.",
          duration: 5000
        });
        setLoading(false);
        return;
      }

      let prompt = message || "Create affirmations for me";
      
      // Add context from selections
      prompt += ` for a ${duration} session`;
      if (language !== "English") {
        prompt += ` in ${language}`;
      }
      
      const aiResponse = await generateAIResponse(prompt);
      setMessages([
        { type: 'user', content: prompt },
        { type: 'ai', content: aiResponse }
      ]);
      
      // Start affirmation session automatically
      if (!affirmationSession.isActive) {
        const mood = message || "positive";
        const firstAffirmation = await startAffirmationSession(mood);
        
        // Save the affirmation if user is logged in
        if (user) {
          await saveAffirmation(firstAffirmation);
        }
      }
      
      setShowChat(true);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error creating affirmations",
        description: error.message || "An unexpected error occurred. Please try again.",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    showChat,
    showHistory,
    setShowChat,
    setShowHistory,
    createAffirmations
  };
}

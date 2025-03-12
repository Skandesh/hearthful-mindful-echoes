import { useState, useRef, useEffect } from "react";
import { generateAIResponse } from "../ChatService";
import { useToast } from "@/hooks/use-toast";

export function useAffirmationCreation(chatState: any) {
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showInputAlert, setShowInputAlert] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    if (showInputAlert) {
      const alertElement = document.querySelector('[role="alert"]');
      if (alertElement) {
        alertElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [showInputAlert]);

  const createAffirmations = async (
    affirmationSession: any,
    startAffirmationSession: any
  ) => {
    setShowInputAlert(false);
    
    if (!message || message.trim() === '') {
      setShowInputAlert(true);
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

      if (user && hasReachedLimit && userPlan?.plan_type === 'free') {
        setMessages([
          { type: 'user', content: message },
          { 
            type: 'ai', 
            content: "You've reached your free trial limit of 10 affirmations. Please upgrade your plan to continue using our premium features. Your ongoing well-being journey deserves unlimited support!" 
          }
        ]);
        
        toast({
          variant: "destructive",
          title: "Free trial limit reached",
          description: "You've reached your limit of 10 affirmations. Please upgrade your plan to continue.",
          duration: 5000
        });
        
        setShowChat(true);
        setLoading(false);
        return;
      }

      let prompt = message || "Create affirmations for me";
      
      prompt += ` for a ${duration} session`;
      if (language !== "English") {
        prompt += ` in ${language}`;
      }
      
      const aiResponse = await generateAIResponse(prompt);
      setMessages([
        { type: 'user', content: prompt },
        { type: 'ai', content: aiResponse }
      ]);
      
      if (!affirmationSession.isActive) {
        const mood = message || "positive";
        const firstAffirmation = await startAffirmationSession(mood);
        
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
    showInputAlert,
    setShowChat,
    setShowHistory,
    setShowInputAlert,
    createAffirmations
  };
}

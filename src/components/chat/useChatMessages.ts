
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "./types";
import { generateAIResponse } from "./ChatService";

export function useChatMessages() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  // Reset messages to empty state
  const resetMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Helper function to check if a user message matches an affirmation
  const matchesAffirmation = useCallback((userMessage: string, affirmation: string) => {
    // Normalize both strings for comparison
    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };
    
    const normalizedInput = normalizeText(userMessage);
    const normalizedAffirmation = normalizeText(affirmation);
    
    return normalizedInput === normalizedAffirmation;
  }, []);

  const handleSuggestedPrompt = useCallback(async (prompt: string) => {
    setMessage(prompt);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent, options?: {
    affirmationSession?: any,
    saveAffirmation?: Function,
    startAffirmationSession?: Function,
    handleAffirmationComplete?: Function,
    hasReachedLimit?: boolean,
    userPlan?: any,
    user?: any
  }) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const userMessage = { type: 'user' as const, content: message };
      
      // Add the message but don't scroll for affirmation sessions
      const {
        affirmationSession,
        saveAffirmation,
        startAffirmationSession,
        handleAffirmationComplete,
        hasReachedLimit,
        userPlan,
        user
      } = options || {};
      
      // Only add the message to the list if we're not in an active affirmation session
      // or if this is the first message that starts the session
      const isStartingAffirmationSession = 
        !affirmationSession?.isActive && 
        message.toLowerCase().includes("yes") && 
        messages[messages.length - 1]?.content.includes("affirmation session");
      
      if (!affirmationSession?.isActive || isStartingAffirmationSession) {
        setMessages(prev => [...prev, userMessage]);
      }
      
      setMessage("");

      // Handle affirmation session prompt
      if (isStartingAffirmationSession) {
        const firstAffirmation = await startAffirmationSession?.("positive");
        const aiResponse = await generateAIResponse(firstAffirmation);
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
        
        // Save the affirmation if user is logged in
        if (user && saveAffirmation) {
          await saveAffirmation(firstAffirmation);
        }
        
        setLoading(false);
        return;
      }

      // Handle active affirmation session
      if (affirmationSession && affirmationSession.isActive) {
        if (matchesAffirmation(message, affirmationSession.currentAffirmation)) {
          const nextAffirmation = await handleAffirmationComplete?.();
          if (nextAffirmation) {
            const aiResponse = await generateAIResponse(nextAffirmation);
            setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
            
            // Save the affirmation if user is logged in
            if (user && saveAffirmation) {
              await saveAffirmation(nextAffirmation);
            }
          } else {
            setMessages(prev => [...prev, { 
              type: 'ai', 
              content: "Great job completing your affirmation session! How do you feel now?" 
            }]);
          }
        } else {
          setMessages(prev => [...prev, { 
            type: 'ai', 
            content: "Try repeating the affirmation exactly as shown. Take a deep breath and try again." 
          }]);
        }
        setLoading(false);
        return;
      }

      // Check if free trial user has reached their limit - improved check
      if (user && hasReachedLimit && userPlan?.plan_type === 'free') {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: "You've reached your free trial limit of 10 affirmations. Please upgrade your plan to continue using our premium features and support your well-being journey." 
        }]);
        
        // Add a toast notification
        toast({
          variant: "destructive",
          title: "Free trial limit reached",
          description: "You've reached your limit of 10 affirmations. Upgrade your plan to continue.",
          duration: 5000
        });
        
        setLoading(false);
        return;
      }

      // Regular message flow
      const aiResponse = await generateAIResponse(message);
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unknown error occurred",
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  }, [message, messages, matchesAffirmation, toast]);

  return {
    message,
    setMessage,
    messages,
    setMessages,
    loading,
    setLoading,
    handleSubmit,
    handleSuggestedPrompt,
    matchesAffirmation,
    resetMessages
  };
}

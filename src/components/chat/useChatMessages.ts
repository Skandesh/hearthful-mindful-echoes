
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "./types";
import { generateAIResponse } from "./ChatService";

export function useChatMessages() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  // Helper function to check if a user message matches an affirmation
  const matchesAffirmation = (userMessage: string, affirmation: string) => {
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
  };

  const handleSuggestedPrompt = async (prompt: string) => {
    setMessage(prompt);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  };

  const handleSubmit = async (e: React.FormEvent, options?: {
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
      setMessages(prev => [...prev, userMessage]);
      setMessage("");

      const {
        affirmationSession,
        saveAffirmation,
        startAffirmationSession,
        handleAffirmationComplete,
        hasReachedLimit,
        userPlan,
        user
      } = options || {};

      // Handle affirmation session prompt
      if (affirmationSession && !affirmationSession.isActive && 
          message.toLowerCase().includes("yes") && 
          messages[messages.length - 1]?.content.includes("affirmation session")) {
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

      // Check if free trial user has reached their limit
      if (user && hasReachedLimit && userPlan?.plan_type === 'free') {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: "You've reached your free trial limit of 10 affirmations. Please upgrade your plan to continue using our service." 
        }]);
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
  };

  return {
    message,
    setMessage,
    messages,
    setMessages,
    loading,
    setLoading,
    handleSubmit,
    handleSuggestedPrompt,
    matchesAffirmation
  };
}

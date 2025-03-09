import { useState, useCallback, useEffect } from "react";
import { Message } from "../types";
import { useChatMessages } from "../useChatMessages";
import { useVoiceInput } from "../useVoiceInput";
import { useAuthState } from "../useAuthState";
import { useUserAffirmations } from "../useUserAffirmations";
import { useToast } from "@/hooks/use-toast";

export function useChat() {
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("5min");
  
  // Auth related hooks
  const { user, isAuthenticated, loading: authLoading, requireAuth } = useAuthState();
  
  // Toast for notifications
  const { toast } = useToast();
  
  // User affirmations management
  const { 
    userAffirmations, 
    favoriteAffirmations, 
    userPlan, 
    saveAffirmation, 
    toggleFavorite,
    hasReachedLimit,
    fetchUserAffirmations
  } = useUserAffirmations();
  
  // Chat message management
  const {
    message,
    setMessage,
    messages,
    setMessages,
    loading,
    setLoading,
    handleSubmit,
    handleSuggestedPrompt,
    resetMessages
  } = useChatMessages();

  // Voice input handling
  const { isRecording, handleStartRecording, handleStopRecording } = useVoiceInput(
    setLoading, 
    setMessage, 
    "en-US"
  );

  // Message submission handling
  const handleMessageSubmit = useCallback(async (e: React.FormEvent, options: any) => {
    // Check authentication
    if (!requireAuth("chat messaging")) {
      return;
    }
    
    await handleSubmit(e, options);
  }, [requireAuth, handleSubmit]);

  // Handle toggling favorites
  const handleToggleFavorite = useCallback(async (id: string) => {
    // Check authentication
    if (!requireAuth("favorites")) {
      return Promise.resolve();
    }
    
    // Find the affirmation to get its current status
    const affirmation = [...userAffirmations, ...favoriteAffirmations]
      .find(a => a.id === id);
    
    if (affirmation) {
      return toggleFavorite(id, affirmation.is_favorite);
    }
    
    return Promise.resolve();
  }, [requireAuth, userAffirmations, favoriteAffirmations, toggleFavorite]);

  // Fetch user data when component mounts, not on every render
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserAffirmations();
    }
  }, [isAuthenticated, user, fetchUserAffirmations]);

  return {
    // State
    language,
    duration,
    message,
    messages,
    loading,
    isRecording,
    
    // User & auth related
    user,
    isAuthenticated,
    authLoading,
    userAffirmations,
    favoriteAffirmations,
    userPlan,
    hasReachedLimit,
    
    // Actions
    setLanguage,
    setDuration,
    setMessage,
    setMessages,
    setLoading,
    saveAffirmation,
    handleMessageSubmit,
    handleSuggestedPrompt,
    handleStartRecording,
    handleStopRecording,
    handleToggleFavorite,
    resetMessages
  };
}

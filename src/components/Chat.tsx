import { useRef, useState } from "react";
import { generateAIResponse } from "./chat/ChatService";
import { Message, AudioOptions } from "./chat/types";
import { ChatContainer } from "./chat/ChatContainer";
import { useChatMessages } from "./chat/useChatMessages";
import { useVoiceInput } from "./chat/useVoiceInput";
import { useUserAffirmations } from "./chat/useUserAffirmations";
import { useAuthState } from "./chat/useAuthState";
import { useVoiceSelection } from "./chat/useVoiceSelection";
import { useSessionManagement } from "./chat/useSessionManagement";
import { usePremiumFeatures } from "./chat/usePremiumFeatures";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("5min");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  
  // Custom hooks
  const { user, isAuthenticated, loading: authLoading, requireAuth } = useAuthState();
  const { 
    userAffirmations, 
    favoriteAffirmations, 
    userPlan, 
    saveAffirmation, 
    toggleFavorite,
    hasReachedLimit,
    fetchUserAffirmations
  } = useUserAffirmations();
  
  const {
    showChat,
    setShowChat,
    showHistory,
    setShowHistory,
    isPlaying,
    playAudio,
    stopAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    checkPremiumFeature,
    affirmationSession,
    startAffirmationSession,
    handleAffirmationComplete,
    handleBackClick,
    cleanupSession,
    handleToggleFullscreen
  } = useSessionManagement();

  const {
    selectedVoice,
    enableBackgroundMusic,
    handleVoiceChange,
    handleBackgroundMusicChange,
    getAvailableVoices
  } = useVoiceSelection(userPlan);

  const { canAccessPremiumVoice } = usePremiumFeatures(userPlan);

  // Message handling with our custom hook
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

  // Voice input handling with English language setting
  const { isRecording, handleStartRecording, handleStopRecording } = useVoiceInput(
    setLoading, 
    setMessage, 
    "en-US" // Explicitly set English as the recognition language
  );

  // Fetch user data when authenticated
  if (isAuthenticated && user) {
    fetchUserAffirmations();
  }

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Affirmation creation function
  const createAffirmations = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated
      if (!requireAuth("affirmation creation")) {
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
        title: "Error",
        description: error.message || "An unknown error occurred",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // Message submission handling
  const handleMessageSubmit = async (e: React.FormEvent) => {
    // Check authentication
    if (!requireAuth("chat messaging")) {
      return;
    }
    
    await handleSubmit(e, {
      affirmationSession,
      saveAffirmation,
      startAffirmationSession,
      handleAffirmationComplete,
      hasReachedLimit,
      userPlan,
      user
    });
    setShowChat(true);
  };

  // Handle toggling favorites
  const handleToggleFavorite = async (id: string) => {
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
  };
  
  // Play audio for messages
  const handlePlayAudio = (message: Message) => {
    const options: AudioOptions = {
      voiceId: selectedVoice,
      backgroundMusic: enableBackgroundMusic
    };
    
    // Check if the user can access these premium features
    const voiceFeature = canAccessPremiumVoice(selectedVoice);
    playAudio(message, options, voiceFeature);
  };

  // If still loading auth status, show a loading spinner
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ChatContainer
      user={user}
      showChat={showChat}
      showHistory={showHistory}
      messages={messages}
      message={message}
      isPlaying={isPlaying}
      loading={loading}
      isRecording={isRecording}
      language={language}
      duration={duration}
      affirmationSession={affirmationSession}
      userAffirmations={userAffirmations}
      favoriteAffirmations={favoriteAffirmations}
      userPlan={userPlan}
      voiceOptions={getAvailableVoices()}
      selectedVoice={selectedVoice}
      enableBackgroundMusic={enableBackgroundMusic}
      messagesEndRef={messagesEndRef}
      onMessageChange={setMessage}
      onSubmit={handleMessageSubmit}
      onLanguageChange={setLanguage}
      onDurationChange={setDuration}
      onVoiceChange={handleVoiceChange}
      onBackgroundMusicChange={handleBackgroundMusicChange}
      onPlayAudio={handlePlayAudio}
      onStopAudio={stopAudio}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onBackClick={handleBackClick}
      onSuggestedPrompt={handleSuggestedPrompt}
      onCreateAffirmations={createAffirmations}
      onToggleFavorite={handleToggleFavorite}
      onShowHistory={() => setShowHistory(true)}
      onCloseHistory={() => setShowHistory(false)}
      onToggleFullscreen={handleToggleFullscreen}
    />
  );
}

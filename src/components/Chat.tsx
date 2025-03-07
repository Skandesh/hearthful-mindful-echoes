<lov-codelov-code>
import { useRef, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateAIResponse } from "./chat/ChatService";
import { useAudio } from "./chat/useAudio";
import { useAffirmations } from "./chat/useAffirmations";
import { useUserAffirmations } from "./chat/useUserAffirmations";
import { Message, VoiceOption, AudioOptions, PremiumFeature } from "./chat/types";
import { ChatContainer } from "./chat/ChatContainer";
import { useChatMessages } from "./chat/useChatMessages";
import { useVoiceInput } from "./chat/useVoiceInput";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("5min");
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>("EXAVITQu4vr4xnSDxMaL"); // Default to Sarah
  const [enableBackgroundMusic, setEnableBackgroundMusic] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Available voice options with premium flags
  const voiceOptions: VoiceOption[] = [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Female)", description: "Default voice" },
    { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie (Male)", description: "Friendly male voice" },
    { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte (Female)", premium: true, description: "Premium female voice" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam (Male)", premium: true, description: "Premium male voice" },
    { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily (Female)", premium: true, description: "Premium female voice" }
  ];

  // Custom hooks for functionality
  const { isPlaying, playAudio, stopAudio, playBackgroundMusic, stopBackgroundMusic, checkPremiumFeature } = useAudio();
  const { 
    affirmationSession,
    startAffirmationSession,
    handleAffirmationComplete,
    toggleFullscreen,
    resetAffirmationSession
  } = useAffirmations();
  const { 
    userAffirmations, 
    favoriteAffirmations, 
    userPlan, 
    saveAffirmation, 
    toggleFavorite,
    hasReachedLimit,
    fetchUserAffirmations
  } = useUserAffirmations();

  // Message handling
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

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      setAuthLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsAuthenticated(!!session?.user);
      setAuthLoading(false);
      
      // Redirect to auth page if not authenticated
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access all features",
        });
        navigate("/auth");
      } else {
        // If authenticated, fetch user data
        fetchUserAffirmations();
      }
    };

    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsAuthenticated(!!session?.user);
        
        if (event === 'SIGNED_OUT') {
          navigate("/auth");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Check if user has premium access to features
  const isPremiumVoice = (voiceId: string): boolean => {
    const voice = voiceOptions.find(v => v.id === voiceId);
    return voice?.premium || false;
  };

  const canAccessPremiumVoice = (voiceId: string): PremiumFeature => {
    const isPremium = isPremiumVoice(voiceId);
    const hasPremiumPlan = userPlan?.plan_type === 'premium' || userPlan?.plan_type === 'pro';
    
    return {
      type: 'voice',
      available: !isPremium || hasPremiumPlan,
      upgradeMessage: "Premium voices are available on Pro and Premium plans. Upgrade to access this voice."
    };
  };

  const canAccessBackgroundMusic = (): PremiumFeature => {
    const hasPremiumPlan = userPlan?.plan_type === 'premium' || userPlan?.plan_type === 'pro';
    
    return {
      type: 'music',
      available: hasPremiumPlan,
      upgradeMessage: "Background music is available on Pro and Premium plans. Upgrade to access this feature."
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle background music when affirmation session starts/ends
  useEffect(() => {
    if (affirmationSession.isActive && enableBackgroundMusic) {
      // Check if user can access background music
      const musicFeature = canAccessBackgroundMusic();
      if (checkPremiumFeature(musicFeature)) {
        playBackgroundMusic();
      }
    } else {
      stopBackgroundMusic();
    }
    
    return () => {
      // Clean up audio when component unmounts
      stopBackgroundMusic();
      stopAudio();
    };
  }, [affirmationSession.isActive, enableBackgroundMusic]);

  // Filter voice options based on plan
  const getAvailableVoices = () => {
    const hasPremiumPlan = userPlan?.plan_type === 'premium' || userPlan?.plan_type === 'pro';
    
    if (hasPremiumPlan) {
      return voiceOptions; // All voices available
    } else {
      // Only free voices
      return voiceOptions.filter(voice => !voice.premium);
    }
  };

  const createAffirmations = async () => {
    setLoading(true);
    try {
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

  const handleMessageSubmit = async (e: React.FormEvent) => {
    // Check authentication
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this feature",
        duration: 3000
      });
      navigate("/auth");
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
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorites",
        duration: 3000
      });
      navigate("/auth");
      return;
    }
    
    // Find the affirmation to get its current status
    const affirmation = [...userAffirmations, ...favoriteAffirmations]
      .find(a => a.id === id);
    
    if (affirmation) {
      return toggleFavorite(id, affirmation.is_favorite);
    }
    
    return Promise.resolve();
  };

  const handleToggleFullscreen = () => {
    toggleFullscreen();
  };
  
  const handlePlayAudio = (message: Message) => {
    const options: AudioOptions = {
      voiceId: selectedVoice,
      backgroundMusic: enableBackgroundMusic
    };
    
    // Check if the user can access these premium features
    const voiceFeature = canAccessPremiumVoice(selectedVoice);
    playAudio(message, options, voiceFeature);
  };

  const handleVoiceChange = (voiceId: string) => {
    // Check if this is a premium voice and user doesn't have premium access
    const voice = voiceOptions.find(v => v.id === voiceId);
    if (voice?.premium && !(userPlan?.plan_type === 'premium' || userPlan?.plan_type === 'pro')) {
      toast({
        title: "Premium Voice",
        description: "This voice is only available on Pro and Premium plans. Upgrade to access it.",
        variant: "default",
        duration: 3000
      });
      // Don't change the voice
      return;
    }
    
    setSelectedVoice(voiceId);
    toast({
      title: "Voice Changed",
      description: `Now using ${voice?.name || "selected voice"}`,
      duration: 1500
    });
  };

  const handleBackgroundMusicChange = (enabled: boolean) => {
    if (enabled) {
      // Check if user can access background music
      const musicFeature = canAccessBackgroundMusic();
      if (!checkPremiumFeature(musicFeature)) {
        return; // Don't enable if not available
      }
    }
    
    setEnableBackgroundMusic(enabled);
    
    if (enabled) {
      toast({
        title: "Background Music",
        description: "Background music enabled",
        duration: 1500
      });
    } else {
      stopBackgroundMusic();
    }
  };

  // Handle back button click - clear all session data
  const handleBackClick = () => {
    // Stop any playing audio
    stopAudio();
    stopBackgroundMusic();
    
    // Reset affirmation session
    resetAffirmationSession();
    
    // Reset messages to initial state
    resetMessages();
    
    // Clear input field
    setMessage("");
    
    // Return to home screen
    setShowChat(false);
    
    // Notify user
    toast({
      title: "Session Ended",
      description: "Your affirmation session was ended",
      duration: 3000
    });
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
</lov-code>

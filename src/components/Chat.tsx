
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

export default function Chat() {
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("5min");
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>("EXAVITQu4vr4xnSDxMaL"); // Default to Sarah
  const [enableBackgroundMusic, setEnableBackgroundMusic] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  // Available voice options with premium flags
  const voiceOptions: VoiceOption[] = [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Female, Default)" },
    { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie (Male)" },
    { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte (Female)", premium: true },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam (Male)", premium: true },
    { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily (Female)", premium: true }
  ];

  // Custom hooks for functionality
  const { isPlaying, playAudio, stopAudio, playBackgroundMusic, stopBackgroundMusic, checkPremiumFeature } = useAudio();
  const { 
    affirmationSession,
    startAffirmationSession,
    handleAffirmationComplete,
    toggleFullscreen
  } = useAffirmations();
  const { 
    userAffirmations, 
    favoriteAffirmations, 
    userPlan, 
    saveAffirmation, 
    toggleFavorite,
    hasReachedLimit
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
    handleSuggestedPrompt
  } = useChatMessages();

  // Voice input handling
  const { isRecording, handleStartRecording, handleStopRecording } = useVoiceInput(setLoading, setMessage);

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

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
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
          description: "You've reached your limit of 10 affirmations. Upgrade your plan to continue."
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
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
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

  // Create a wrapper function to match the expected signature
  const handleToggleFavorite = (id: string) => {
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
      });
      // Don't change the voice
      return;
    }
    
    setSelectedVoice(voiceId);
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
  };

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
      onBackClick={() => setShowChat(false)}
      onSuggestedPrompt={handleSuggestedPrompt}
      onCreateAffirmations={createAffirmations}
      onToggleFavorite={handleToggleFavorite}
      onShowHistory={() => setShowHistory(true)}
      onCloseHistory={() => setShowHistory(false)}
      onToggleFullscreen={handleToggleFullscreen}
    />
  );
}

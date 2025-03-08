
import { useRef, useEffect } from "react";
import { Message, AudioOptions } from "./chat/types";
import { ChatContainer } from "./chat/ChatContainer";
import { useSessionManagement } from "./chat/useSessionManagement";
import { useVoiceSelection } from "./chat/useVoiceSelection";
import { useChat } from "./chat/hooks/useChat";
import { useAffirmationCreation } from "./chat/hooks/useAffirmationCreation";
import { useAudioPlayback } from "./chat/hooks/useAudioPlayback";

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Chat and message management
  const chat = useChat();
  
  // Session management 
  const {
    showChat,
    setShowChat,
    showHistory,
    setShowHistory,
    affirmationSession,
    startAffirmationSession,
    handleAffirmationComplete,
    handleBackClick,
    cleanupSession,
    handleToggleFullscreen
  } = useSessionManagement();

  // Voice selection
  const {
    selectedVoice,
    enableBackgroundMusic,
    handleVoiceChange,
    handleBackgroundMusicChange,
    getAvailableVoices
  } = useVoiceSelection(chat.userPlan);

  // Audio playback
  const {
    isPlaying,
    playAudio,
    stopAudio
  } = useAudioPlayback(chat.userPlan);

  // Affirmation creation
  const { createAffirmations } = useAffirmationCreation({
    ...chat,
    affirmationSession,
    startAffirmationSession
  });

  // Scroll to bottom after messages update
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    if (chat.messages.length > 0 && !chat.loading) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chat.messages, chat.loading]);

  // Message submission handler with session context
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await chat.handleMessageSubmit(e, {
      affirmationSession,
      saveAffirmation: chat.saveAffirmation,
      startAffirmationSession,
      handleAffirmationComplete,
      hasReachedLimit: chat.hasReachedLimit,
      userPlan: chat.userPlan,
      user: chat.user
    });
    setShowChat(true);
  };
  
  // Handle creating affirmations
  const handleCreateAffirmations = async () => {
    await createAffirmations(affirmationSession, startAffirmationSession);
  };

  // Play audio for messages
  const handlePlayAudio = (message: Message) => {
    const options: AudioOptions = {
      voiceId: selectedVoice,
      backgroundMusic: enableBackgroundMusic
    };
    
    playAudio(message, options);
  };

  // If still loading auth status, show a loading spinner
  if (chat.authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ChatContainer
      user={chat.user}
      showChat={showChat}
      showHistory={showHistory}
      messages={chat.messages}
      message={chat.message}
      isPlaying={isPlaying}
      loading={chat.loading}
      isRecording={chat.isRecording}
      language={chat.language}
      duration={chat.duration}
      affirmationSession={affirmationSession}
      userAffirmations={chat.userAffirmations}
      favoriteAffirmations={chat.favoriteAffirmations}
      userPlan={chat.userPlan}
      voiceOptions={getAvailableVoices()}
      selectedVoice={selectedVoice}
      enableBackgroundMusic={enableBackgroundMusic}
      messagesEndRef={messagesEndRef}
      onMessageChange={chat.setMessage}
      onSubmit={handleMessageSubmit}
      onLanguageChange={chat.setLanguage}
      onDurationChange={chat.setDuration}
      onVoiceChange={handleVoiceChange}
      onBackgroundMusicChange={handleBackgroundMusicChange}
      onPlayAudio={handlePlayAudio}
      onStopAudio={stopAudio}
      onStartRecording={chat.handleStartRecording}
      onStopRecording={chat.handleStopRecording}
      onBackClick={handleBackClick}
      onSuggestedPrompt={chat.handleSuggestedPrompt}
      onCreateAffirmations={handleCreateAffirmations}
      onToggleFavorite={chat.handleToggleFavorite}
      onShowHistory={() => setShowHistory(true)}
      onCloseHistory={() => setShowHistory(false)}
      onToggleFullscreen={handleToggleFullscreen}
    />
  );
}

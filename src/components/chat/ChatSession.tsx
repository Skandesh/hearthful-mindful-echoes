
import React, { useState } from "react";
import { Message } from "./types";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { AffirmationSession } from "./types";
import { SessionHeader } from "./session/SessionHeader";
import { AffirmationVisualizerWithControls } from "./session/AffirmationVisualizerWithControls";
import { ExitSessionDialog } from "./session/ExitSessionDialog";

interface ChatSessionProps {
  messages: Message[];
  message: string;
  isPlaying: boolean;
  loading: boolean;
  isRecording: boolean;
  affirmationSession: AffirmationSession;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onBackClick: () => void;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPlayAudio: (msg: Message) => void;
  onStopAudio: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleFullscreen?: () => void;
}

export function ChatSession({
  messages,
  message,
  isPlaying,
  loading,
  isRecording,
  affirmationSession,
  messagesEndRef,
  onBackClick,
  onMessageChange,
  onSubmit,
  onPlayAudio,
  onStopAudio,
  onStartRecording,
  onStopRecording,
  onToggleFullscreen,
}: ChatSessionProps) {
  // Only show the most recent AI message during affirmation sessions
  const recentMessages = affirmationSession.isActive 
    ? messages.slice(-2) // Just the recent user and AI message
    : messages;

  // Determine if we should show the affirmation in fullscreen mode
  const isFullscreenMode = affirmationSession.isActive && affirmationSession.isFullscreen;
  
  // State for session exit confirmation dialog
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const handleBackButton = () => {
    // Only show confirmation if there's an active session
    if (affirmationSession.isActive) {
      setShowExitConfirmation(true);
    } else {
      onBackClick();
    }
  };

  return (
    <div className={`transition-all duration-500 ${isFullscreenMode ? 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center' : ''}`}>
      {/* Confirmation Dialog */}
      <ExitSessionDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        onConfirm={onBackClick}
      />

      {/* Session Header */}
      <SessionHeader
        affirmationSession={affirmationSession}
        onBackClick={handleBackButton}
        isFullscreenMode={isFullscreenMode}
      />
      
      {/* Visualization Component */}
      <AffirmationVisualizerWithControls
        isActive={affirmationSession.isActive}
        isFullscreenMode={isFullscreenMode}
        currentAffirmation={affirmationSession.currentAffirmation}
        onToggleFullscreen={onToggleFullscreen}
      />
      
      {/* Chat History */}
      {!isFullscreenMode && (!affirmationSession.isActive || recentMessages.length > 0) && (
        <div className={`bg-white/50 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-[#9b87f5]/10 mb-8 ${affirmationSession.isActive ? 'max-h-32 overflow-y-auto opacity-60' : ''}`}>
          <MessageList
            messages={recentMessages}
            isPlaying={isPlaying}
            loading={loading}
            onPlayAudio={onPlayAudio}
            onStopAudio={onStopAudio}
          />
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Message Input */}
      {!isFullscreenMode && (
        <MessageInput
          message={message}
          loading={loading}
          isRecording={isRecording}
          isAffirmationSession={affirmationSession.isActive}
          onMessageChange={onMessageChange}
          onSubmit={onSubmit}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
        />
      )}
    </div>
  );
}

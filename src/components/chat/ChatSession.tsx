
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Message } from "./types";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { AffirmationVisualizer } from "./AffirmationVisualizer";
import { AffirmationSession } from "./types";

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
}: ChatSessionProps) {
  return (
    <>
      {affirmationSession.isActive && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg text-center">
          <p className="text-sm text-primary-foreground">
            Affirmation Session in Progress - {affirmationSession.index + 1} of {affirmationSession.affirmations.length}
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBackClick}
          className="text-[#9b87f5]"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h2 className="text-2xl font-bold text-primary-foreground">
          {affirmationSession.isActive 
            ? "Repeat this affirmation:" 
            : "Your Affirmations"}
        </h2>
        <div className="w-16"></div> {/* Empty div for centering */}
      </div>
      
      {/* Visualization Component - only show during affirmation sessions */}
      {affirmationSession.isActive && (
        <AffirmationVisualizer 
          isActive={affirmationSession.isActive} 
          currentAffirmation={affirmationSession.currentAffirmation} 
        />
      )}
      
      <MessageList
        messages={messages}
        isPlaying={isPlaying}
        loading={loading}
        onPlayAudio={onPlayAudio}
        onStopAudio={onStopAudio}
      />
      <div ref={messagesEndRef} />

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
    </>
  );
}


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
        <div className="mb-4 p-3 bg-gradient-to-r from-primary/20 to-[#543ab7]/20 rounded-lg text-center backdrop-blur-sm border border-primary/10 shadow-sm">
          <p className="text-sm font-medium text-primary-foreground">
            Affirmation Session in Progress
            <span className="inline-flex items-center justify-center ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-xs">
              {affirmationSession.index + 1}/{affirmationSession.affirmations.length}
            </span>
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={onBackClick}
          className="text-[#9b87f5] border-[#9b87f5]/20 hover:bg-[#9b87f5]/5"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-[#543ab7] text-transparent bg-clip-text">
          {affirmationSession.isActive 
            ? "Repeat After Me" 
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
      
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#9b87f5]/10 mb-6">
        <MessageList
          messages={messages}
          isPlaying={isPlaying}
          loading={loading}
          onPlayAudio={onPlayAudio}
          onStopAudio={onStopAudio}
        />
        <div ref={messagesEndRef} />
      </div>

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

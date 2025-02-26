
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info } from "lucide-react";
import { Message } from "./types";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { AffirmationVisualizer } from "./AffirmationVisualizer";
import { AffirmationSession } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  // Only show the most recent AI message during affirmation sessions
  const recentMessages = affirmationSession.isActive 
    ? messages.slice(-2) // Just the recent user and AI message
    : messages;

  return (
    <>
      {affirmationSession.isActive && (
        <div className="mb-4 p-3 bg-gradient-to-r from-primary/20 to-[#543ab7]/20 rounded-lg backdrop-blur-sm border border-primary/10 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary-foreground">
              Affirmation Session in Progress
              <span className="inline-flex items-center justify-center ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-xs">
                {affirmationSession.index + 1}/{affirmationSession.affirmations.length}
              </span>
            </p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                    <Info className="h-3.5 w-3.5 text-primary-foreground/70" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4">
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">How to complete the session:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Type or say the affirmation <strong>exactly</strong> as shown</li>
                      <li>Press submit to confirm and move to the next affirmation</li>
                      <li>Complete all {affirmationSession.affirmations.length} affirmations to finish</li>
                    </ol>
                    <p className="text-xs italic mt-2">Try to speak each affirmation with feeling and belief</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Clear instructions for what to do */}
          <div className="mt-2 p-2 bg-white/20 rounded text-xs">
            <p><strong>Your task:</strong> Type or speak the displayed affirmation exactly as shown, then submit it.</p>
          </div>
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
      
      {/* Only show chat history if not in affirmation mode or if we have a special message to show */}
      {(!affirmationSession.isActive || recentMessages.length > 0) && (
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#9b87f5]/10 mb-6">
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

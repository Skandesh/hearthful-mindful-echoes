
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, Maximize, Minimize } from "lucide-react";
import { Message } from "./types";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { AffirmationVisualizer } from "./AffirmationVisualizer";
import { AffirmationSession } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showExitConfirmation, setShowExitConfirmation] = React.useState(false);

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
      <AlertDialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Affirmation Session?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an active affirmation session in progress. 
              Are you sure you want to exit? Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Session</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onBackClick}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              End Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {affirmationSession.isActive && (
        <div className={`mb-6 p-4 ${isFullscreenMode ? 'hidden' : 'bg-gradient-to-r from-primary/20 to-[#543ab7]/20 rounded-lg backdrop-blur-sm border border-primary/10 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary-foreground">
              Affirmation Session in Progress
              <span className="inline-flex items-center justify-center ml-3 px-2.5 py-1 rounded-full bg-primary/20 text-xs">
                {affirmationSession.index + 1}/{affirmationSession.affirmations.length}
              </span>
            </p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                    <HelpCircle className="h-4 w-4 text-primary-foreground/70" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4">
                  <div className="space-y-3 text-sm">
                    <p className="font-medium">How to complete the session:</p>
                    <ol className="list-decimal pl-5 space-y-1.5">
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
          <div className="mt-3 p-3 bg-white/20 rounded text-xs">
            <p><strong>Your task:</strong> Type or speak the displayed affirmation exactly as shown, then submit it.</p>
          </div>
        </div>
      )}
      
      {!isFullscreenMode && (
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={handleBackButton}
            className="text-[#9b87f5] border-[#9b87f5]/20 hover:bg-[#9b87f5]/5"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-[#543ab7] text-transparent bg-clip-text">
            {affirmationSession.isActive 
              ? "Repeat After Me" 
              : "Your Affirmations"}
          </h2>
          <div className="w-16"></div> {/* Empty div for centering */}
        </div>
      )}
      
      {/* Visualization Component - only show during affirmation sessions */}
      {affirmationSession.isActive && (
        <div className={`relative transition-all duration-500 ${isFullscreenMode ? 'w-full max-w-3xl' : ''}`}>
          <AffirmationVisualizer 
            isActive={affirmationSession.isActive} 
            currentAffirmation={affirmationSession.currentAffirmation} 
          />
          {onToggleFullscreen && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/30 hover:bg-white/50"
              onClick={onToggleFullscreen}
            >
              {affirmationSession.isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          )}
        </div>
      )}
      
      {/* Only show chat history if not in fullscreen mode and if not in affirmation mode or if we have a special message to show */}
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

      {/* Hide the message input in fullscreen mode */}
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

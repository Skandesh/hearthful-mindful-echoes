
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "./useAudio";
import { useAffirmations } from "./useAffirmations";
import { useConfirmationDialog } from "./useConfirmationDialog";

export function useSessionManagement() {
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  
  const { 
    isPlaying, 
    playAudio, 
    stopAudio, 
    playBackgroundMusic, 
    stopBackgroundMusic, 
    checkPremiumFeature 
  } = useAudio();
  
  const { 
    affirmationSession,
    startAffirmationSession,
    handleAffirmationComplete,
    toggleFullscreen,
    resetAffirmationSession
  } = useAffirmations();
  
  const { 
    showConfirmation, 
    confirmAction, 
    cancelAction 
  } = useConfirmationDialog();

  // Handle back button click with confirmation
  const handleBackClick = () => {
    // If there's an active affirmation session, show confirmation dialog
    if (affirmationSession.isActive) {
      showConfirmation(
        "End Session?", 
        "Are you sure you want to end your current affirmation session? All progress will be lost.",
        () => {
          cleanupSession();
        }
      );
    } else {
      // No active session, just clean up
      cleanupSession();
    }
  };

  // Clean up all session data
  const cleanupSession = () => {
    // Stop any playing audio
    stopAudio();
    stopBackgroundMusic();
    
    // Reset affirmation session
    resetAffirmationSession();
    
    // Return to home screen
    setShowChat(false);
    
    // Notify user
    toast({
      title: "Session Ended",
      description: "Your affirmation session was ended",
      duration: 3000
    });
  };

  const handleToggleFullscreen = () => {
    toggleFullscreen();
  };

  return {
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
    handleToggleFullscreen,
    showConfirmation,
    confirmAction,
    cancelAction
  };
}

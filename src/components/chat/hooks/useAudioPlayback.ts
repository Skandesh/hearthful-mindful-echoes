
import { AudioOptions, Message, PremiumFeature } from "../types";
import { useAudio } from "../useAudio";
import { usePremiumFeatures } from "../usePremiumFeatures";
import { useState, useEffect } from "react";

export function useAudioPlayback(userPlan: any) {
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Check for mobile view on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Audio playback functionality
  const {
    isPlaying,
    playAudio,
    stopAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    checkPremiumFeature
  } = useAudio();

  // Premium feature access
  const { canAccessPremiumVoice } = usePremiumFeatures(userPlan);

  // Play audio for messages with responsive adjustments
  const handlePlayAudio = (message: Message, options: AudioOptions) => {
    const voiceFeature = canAccessPremiumVoice(options.voiceId);
    
    // Adjust volume slightly for mobile devices
    const adjustedOptions = isMobileView ? 
      {...options, volumeAdjustment: 1.2} : 
      options;
      
    playAudio(message, adjustedOptions, voiceFeature);
  };

  return {
    isPlaying,
    playAudio: handlePlayAudio,
    stopAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    checkPremiumFeature,
    isMobileView
  };
}

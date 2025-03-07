
import { AudioOptions, Message, PremiumFeature } from "../types";
import { useAudio } from "../useAudio";
import { usePremiumFeatures } from "../usePremiumFeatures";

export function useAudioPlayback(userPlan: any) {
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

  // Play audio for messages
  const handlePlayAudio = (message: Message, options: AudioOptions) => {
    const voiceFeature = canAccessPremiumVoice(options.voiceId);
    playAudio(message, options, voiceFeature);
  };

  return {
    isPlaying,
    playAudio: handlePlayAudio,
    stopAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    checkPremiumFeature
  };
}

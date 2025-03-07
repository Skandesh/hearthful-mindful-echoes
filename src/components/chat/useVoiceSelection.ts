
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserPlan, VoiceOption } from "./types";
import { usePremiumFeatures } from "./usePremiumFeatures";

export function useVoiceSelection(userPlan: UserPlan | null) {
  const [selectedVoice, setSelectedVoice] = useState<string>("EXAVITQu4vr4xnSDxMaL"); // Default to Sarah
  const [enableBackgroundMusic, setEnableBackgroundMusic] = useState(false);
  const { toast } = useToast();
  const { 
    voiceOptions, 
    canAccessPremiumVoice, 
    canAccessBackgroundMusic, 
    getAvailableVoices 
  } = usePremiumFeatures(userPlan);

  const handleVoiceChange = (voiceId: string) => {
    // Check if this is a premium voice and user doesn't have premium access
    const voice = voiceOptions.find(v => v.id === voiceId);
    if (voice?.premium && !(userPlan?.plan_type === 'premium' || userPlan?.plan_type === 'pro')) {
      toast({
        title: "Premium Voice",
        description: "This voice is only available on Pro and Premium plans. Upgrade to access it.",
        variant: "default",
        duration: 3000
      });
      // Don't change the voice
      return;
    }
    
    setSelectedVoice(voiceId);
    toast({
      title: "Voice Changed",
      description: `Now using ${voice?.name || "selected voice"}`,
      duration: 1500
    });
  };

  const handleBackgroundMusicChange = (enabled: boolean) => {
    if (enabled) {
      // Check if user can access background music
      const musicFeature = canAccessBackgroundMusic();
      if (!musicFeature.available) {
        toast({
          title: "Premium Feature",
          description: musicFeature.upgradeMessage,
          variant: "default",
          duration: 3000
        });
        return; // Don't enable if not available
      }
    }
    
    setEnableBackgroundMusic(enabled);
    
    if (enabled) {
      toast({
        title: "Background Music",
        description: "Background music enabled",
        duration: 1500
      });
    }
  };

  return {
    selectedVoice,
    enableBackgroundMusic,
    handleVoiceChange,
    handleBackgroundMusicChange,
    getAvailableVoices
  };
}

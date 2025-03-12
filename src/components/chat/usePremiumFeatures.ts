
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoiceOption, PremiumFeature, UserPlan } from "./types";

export function usePremiumFeatures(userPlan: UserPlan | null) {
  const { toast } = useToast();
  const [voiceOptions, setVoiceOptions] = useState<VoiceOption[]>([
    // Free voices
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Female)", description: "Default voice" },
    { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie (Male)", description: "Friendly male voice" },
    
    // Premium voices
    { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte (Female)", premium: true, description: "Premium female voice" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam (Male)", premium: true, description: "Premium male voice" },
    { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily (Female)", premium: true, description: "Premium female voice" },
    { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum (Male)", premium: true, description: "British male voice" },
    { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice (Female)", premium: true, description: "Warm female voice" },
    { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda (Female)", premium: true, description: "Gentle female voice" },
    { id: "bIHbv24MWmeRgasZH58o", name: "Will (Male)", premium: true, description: "Energetic male voice" },
    { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica (Female)", premium: true, description: "Professional female voice" }
  ]);

  const isPremiumVoice = (voiceId: string): boolean => {
    const voice = voiceOptions.find(v => v.id === voiceId);
    return voice?.premium || false;
  };

  const canAccessPremiumVoice = (voiceId: string): PremiumFeature => {
    const isPremium = isPremiumVoice(voiceId);
    const hasPremiumPlan = userPlan?.plan_type === 'premium' || userPlan?.plan_type === 'pro';
    
    return {
      type: 'voice',
      available: !isPremium || hasPremiumPlan,
      upgradeMessage: "Premium voices are available on Pro and Premium plans. Upgrade to access this voice."
    };
  };

  const canAccessBackgroundMusic = (): PremiumFeature => {
    const hasPremiumPlan = userPlan?.plan_type === 'premium' || userPlan?.plan_type === 'pro';
    
    return {
      type: 'music',
      available: hasPremiumPlan,
      upgradeMessage: "Background music is available on Pro and Premium plans. Upgrade to access this feature."
    };
  };

  const getAvailableVoices = () => {
    const hasPremiumPlan = userPlan?.plan_type === 'premium' || userPlan?.plan_type === 'pro';
    
    if (hasPremiumPlan) {
      return voiceOptions; // All voices available
    } else {
      // Only free voices
      return voiceOptions.filter(voice => !voice.premium);
    }
  };

  return {
    voiceOptions,
    isPremiumVoice,
    canAccessPremiumVoice,
    canAccessBackgroundMusic,
    getAvailableVoices
  };
}


import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoiceOption, PremiumFeature, UserPlan } from "./types";

export function usePremiumFeatures(userPlan: UserPlan | null) {
  const { toast } = useToast();
  const [voiceOptions, setVoiceOptions] = useState<VoiceOption[]>([
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Female)", description: "Default voice" },
    { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie (Male)", description: "Friendly male voice" },
    { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte (Female)", premium: true, description: "Premium female voice" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam (Male)", premium: true, description: "Premium male voice" },
    { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily (Female)", premium: true, description: "Premium female voice" }
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

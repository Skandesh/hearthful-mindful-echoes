
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserPlan, VoiceOption } from "./types";
import { usePremiumFeatures } from "./usePremiumFeatures";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

export function useVoiceSelection(userPlan: UserPlan | null) {
  const [selectedVoice, setSelectedVoice] = useState<string>("EXAVITQu4vr4xnSDxMaL"); // Default to Sarah
  const [enableBackgroundMusic, setEnableBackgroundMusic] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string>('');
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
      setCurrentFeature('premium voice');
      setShowPremiumDialog(true);
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
        setCurrentFeature('background music');
        setShowPremiumDialog(true);
        return;
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

  const PremiumFeatureDialog = () => (
    <AlertDialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-primary">Premium Feature</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {currentFeature === 'background music' ? 
              "Soothing background music is only available on Pro and Premium plans." :
              "Premium voices are only available on Pro and Premium plans."}
            <br /><br />
            Upgrade your plan to unlock all premium features, including {currentFeature}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="sm:mt-0">Maybe Later</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link to="/profile" className="bg-gradient-to-r from-[#9b87f5] to-[#543ab7] hover:opacity-90 text-white">
              Upgrade Plan
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    selectedVoice,
    enableBackgroundMusic,
    handleVoiceChange,
    handleBackgroundMusicChange,
    getAvailableVoices,
    PremiumFeatureDialog,
    showPremiumDialog
  };
}

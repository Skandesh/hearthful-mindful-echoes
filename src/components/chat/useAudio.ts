
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message, AudioOptions, PremiumFeature } from "./types";
import { useToast } from "@/hooks/use-toast";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Default audio options
  const defaultOptions: AudioOptions = {
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Default to Sarah voice
    backgroundMusic: false
  };

  const checkPremiumFeature = (feature: PremiumFeature): boolean => {
    if (feature.available) return true;
    
    toast({
      title: "Premium Feature",
      description: feature.upgradeMessage,
      variant: "default",
    });
    
    return false;
  };

  const playBackgroundMusic = async (premiumCheck?: PremiumFeature) => {
    // Check if background music is a premium feature
    if (premiumCheck && !checkPremiumFeature(premiumCheck)) {
      return;
    }
    
    try {
      if (backgroundMusic) {
        backgroundMusic.play();
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-background-music', {
        body: { mood: "calming" },
      });

      if (error) throw error;

      if (data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        audio.loop = true;
        audio.volume = 0.2; // Lower volume for background music
        setBackgroundMusic(audio);
        await audio.play();
      }
    } catch (error: any) {
      console.error("Background music error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not play background music: " + error.message,
      });
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
  };

  const playAudio = async (message: Message, options: AudioOptions = defaultOptions, premiumCheck?: PremiumFeature) => {
    // Check if the selected voice is a premium feature
    if (premiumCheck && !checkPremiumFeature(premiumCheck)) {
      // Fall back to default voice
      options.voiceId = defaultOptions.voiceId;
    }
    
    if (!message.audio) {
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { 
            text: message.content,
            voiceId: options.voiceId 
          },
        });

        if (error) throw error;

        if (data.audio) {
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
          audioRef.current = audio;
          audio.onended = () => setIsPlaying(false);
          await audio.play();
          setIsPlaying(true);

          // If background music is enabled in options, play it
          if (options.backgroundMusic) {
            const musicPremiumCheck = premiumCheck?.type === 'music' ? premiumCheck : undefined;
            playBackgroundMusic(musicPremiumCheck);
          }
          
          return data.audio;
        }
      } catch (error: any) {
        console.error("TTS Error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not generate speech: " + error.message,
        });
      }
    } else {
      try {
        const audio = new Audio(`data:audio/mpeg;base64,${message.audio}`);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        await audio.play();
        setIsPlaying(true);
        
        // If background music is enabled in options, play it
        if (options.backgroundMusic) {
          const musicPremiumCheck = premiumCheck?.type === 'music' ? premiumCheck : undefined;
          playBackgroundMusic(musicPremiumCheck);
        }
      } catch (error) {
        console.error("Audio playback error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not play audio",
        });
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    playAudio,
    stopAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    checkPremiumFeature
  };
}


import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "./types";
import { useToast } from "@/hooks/use-toast";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const playAudio = async (message: Message) => {
    if (!message.audio) {
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { text: message.content },
        });

        if (error) throw error;

        if (data.audio) {
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
          audioRef.current = audio;
          audio.onended = () => setIsPlaying(false);
          await audio.play();
          setIsPlaying(true);
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
    stopAudio
  };
}

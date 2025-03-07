
import { supabase } from "@/integrations/supabase/client";

export const generateAIResponse = async (userInput: string) => {
  const { data, error } = await supabase.functions.invoke('generate-response', {
    body: { message: userInput }
  });

  if (error) throw error;
  
  if (data.response.toLowerCase().includes("positive")) {
    return data.response + "\n\nWould you like to start an affirmation session to enhance these positive feelings?";
  }
  
  return data.response;
};

export const transcribeAudio = async (audioBase64: string, language: string = "en-US") => {
  const { data, error } = await supabase.functions.invoke('transcribe-audio', {
    body: { 
      audio: audioBase64,
      language: language // Pass language parameter to the edge function
    }
  });

  if (error) throw error;
  return data;
};

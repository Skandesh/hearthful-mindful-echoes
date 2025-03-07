
import { useRecording } from "./useRecording";
import { useToast } from "@/hooks/use-toast";

export function useVoiceInput(
  setLoading: (loading: boolean) => void, 
  setMessage: (message: string) => void,
  language: string = "en-US" // Default to US English
) {
  const { isRecording, startRecording, stopRecording, processRecording } = useRecording(language);
  const { toast } = useToast();

  const handleStartRecording = async () => {
    const recorder = await startRecording();
    if (recorder) {
      recorder.onstop = handleVoiceInput;
    }
  };

  const handleVoiceInput = async () => {
    try {
      setLoading(true);
      const transcribedText = await processRecording();
      
      if (transcribedText) {
        // Set the transcribed text in the message input
        setMessage(transcribedText);
      }
    } catch (error: any) {
      console.error('Voice Input Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStopRecording = async () => {
    stopRecording();
  };

  return {
    isRecording,
    handleStartRecording,
    handleStopRecording
  };
}

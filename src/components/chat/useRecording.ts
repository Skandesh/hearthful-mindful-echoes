
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { transcribeAudio } from "./ChatService";

export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      return mediaRecorder;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone: " + error.message,
      });
      return null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processRecording = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        try {
          const transcriptionData = await transcribeAudio(base64Audio);
          resolve(transcriptionData?.text || null);
        } catch (error) {
          console.error("Transcription error:", error);
          resolve(null);
        }
      };
      reader.readAsDataURL(audioBlob);
    });
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    processRecording
  };
}

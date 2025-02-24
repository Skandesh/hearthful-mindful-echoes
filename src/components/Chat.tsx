import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "./chat/types";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { WavyBackground } from "./chat/WavyBackground";
import { useAudio } from "./chat/useAudio";
import { useAffirmations } from "./chat/useAffirmations";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const { isPlaying, playAudio, stopAudio } = useAudio();
  const { affirmationSession, startAffirmationSession, handleAffirmationComplete } = useAffirmations();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userInput: string) => {
    const { data, error } = await supabase.functions.invoke('generate-response', {
      body: { message: userInput }
    });

    if (error) throw error;
    
    if (!affirmationSession.isActive && data.response.toLowerCase().includes("positive")) {
      return data.response + "\n\nWould you like to start an affirmation session to enhance these positive feelings?";
    }
    
    return data.response;
  };

  const handleVoiceInput = async (audioBase64: string) => {
    try {
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: audioBase64 }
      });

      if (transcriptionError) throw transcriptionError;

      if (transcriptionData?.text) {
        // Add user's transcribed message
        setMessages(prev => [...prev, { type: 'user', content: transcriptionData.text }]);

        // Generate AI response without TTS
        const aiResponse = await generateAIResponse(transcriptionData.text);
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      }
    } catch (error: any) {
      console.error('Voice Input Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

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

      mediaRecorder.onstop = async () => {
        setLoading(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await handleVoiceInput(base64Audio);
          setLoading(false);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone: " + error.message,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const userMessage = { type: 'user' as const, content: message };
      setMessages(prev => [...prev, userMessage]);
      setMessage("");

      if (!affirmationSession.isActive && 
          message.toLowerCase().includes("yes") && 
          messages[messages.length - 1]?.content.includes("affirmation session")) {
        const firstAffirmation = await startAffirmationSession("positive");
        const aiResponse = await generateAIResponse(firstAffirmation);
        const aiMessage = { type: 'ai' as const, content: aiResponse };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
        return;
      }

      if (affirmationSession.isActive) {
        if (message.toLowerCase().includes(affirmationSession.currentAffirmation.toLowerCase())) {
          const nextAffirmation = await handleAffirmationComplete();
          if (nextAffirmation) {
            const aiResponse = await generateAIResponse(nextAffirmation);
            const aiMessage = { type: 'ai' as const, content: aiResponse };
            setMessages(prev => [...prev, aiMessage]);
          } else {
            const finalMessage = { 
              type: 'ai' as const, 
              content: "Great job completing your affirmation session! How do you feel now?" 
            };
            setMessages(prev => [...prev, finalMessage]);
          }
        } else {
          const aiMessage = { 
            type: 'ai' as const, 
            content: "Try repeating the affirmation exactly as shown. Take a deep breath and try again." 
          };
          setMessages(prev => [...prev, aiMessage]);
        }
        setLoading(false);
        return;
      }

      const aiResponse = await generateAIResponse(message);
      const aiMessage = { type: 'ai' as const, content: aiResponse };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-4rem)]">
      <WavyBackground />
      <Card className="p-8 w-full bg-white/70 backdrop-blur-xl shadow-xl border-primary/20">
        <div className="max-w-md mx-auto">
          {affirmationSession.isActive && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-primary-foreground">
                Affirmation Session in Progress - {affirmationSession.index + 1} of {affirmationSession.affirmations.length}
              </p>
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-6 text-center text-primary-foreground">
            {affirmationSession.isActive 
              ? "Repeat this affirmation:" 
              : "How are you feeling today?"}
          </h2>
          
          <MessageList
            messages={messages}
            isPlaying={isPlaying}
            loading={loading}
            onPlayAudio={playAudio}
            onStopAudio={stopAudio}
          />
          <div ref={messagesEndRef} />

          <MessageInput
            message={message}
            loading={loading}
            isRecording={isRecording}
            isAffirmationSession={affirmationSession.isActive}
            onMessageChange={setMessage}
            onSubmit={handleSubmit}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />
        </div>
      </Card>
    </div>
  );
}

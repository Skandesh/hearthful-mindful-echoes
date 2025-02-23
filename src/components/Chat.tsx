
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SendHorizonal, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  type: 'user' | 'ai';
  content: string;
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      setMessages(prev => [...prev, { type: 'user', content: message }]);
      toast({
        title: "Message sent!",
        description: "Thank you for sharing how you feel.",
      });
      setMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
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
          try {
            const { data, error } = await supabase.functions.invoke('transcribe-audio', {
              body: { audio: base64Audio },
            });
            
            if (error) throw error;
            if (data.text) {
              setMessages(prev => [...prev, { 
                type: 'ai', 
                content: data.text 
              }]);
            }
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Transcription failed",
              description: error.message,
            });
          } finally {
            setLoading(false);
          }
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

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-4rem)]">
      <Card className="p-8 w-full bg-white/50 backdrop-blur-sm shadow-xl">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
            How are you feeling today?
          </h2>
          
          {/* Conversation History */}
          <div className="mb-6 space-y-4 max-h-[400px] overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-accent/10 ml-8'
                    : 'bg-accent text-white mr-8'
                }`}
              >
                <div className="text-xs mb-1 opacity-70">
                  {msg.type === 'user' ? 'You' : 'AI Assistant'}
                </div>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-center p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3">
              <Textarea
                placeholder="Share your thoughts and feelings..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] bg-white/70 backdrop-blur-sm shadow-inner border-accent/20 focus:border-accent"
              />
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex-shrink-0 transition-all duration-300 hover:scale-105 ${
                  isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </div>
            <Button 
              type="submit" 
              disabled={loading || !message.trim()}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-[1.02]"
            >
              <SendHorizonal className="mr-2 h-5 w-5" />
              Share
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

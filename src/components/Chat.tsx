import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SendHorizonal, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  type: 'user' | 'ai';
  content: string;
  audio?: string;
};

const generateAIResponse = (userMessage: string) => {
  // Convert message to lowercase for easier matching
  const msg = userMessage.toLowerCase();
  
  // Check for various emotional states and keywords
  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('worried')) {
    return "I can hear that you're feeling anxious right now. That's a challenging feeling to sit with. Would you like to try some calming affirmations together? We can start with something gentle like: 'I am safe in this moment, and this feeling will pass.'";
  }
  
  if (msg.includes('feeling low') || msg.includes('sad') || msg.includes('depressed') || msg.includes('down')) {
    return "I hear you, and I want you to know that it's completely okay to feel low. Your feelings are valid. Would you like to work through some affirmations together? We can begin with acknowledging where you are and gently moving toward hope.";
  }
  
  if (msg.includes('stressed') || msg.includes('overwhelmed') || msg.includes('too much')) {
    return "Being stressed and overwhelmed can feel really heavy. Let's take a moment together. Would you like to try some grounding affirmations? We can start with: 'I can take things one step at a time. Each breath brings me clarity.'";
  }
  
  if (msg.includes('yes') || msg.includes('sure') || msg.includes('okay') || msg.includes('let\'s try')) {
    return "That's wonderful that you're open to this. Let's begin with something simple. Take a gentle breath and repeat after me: 'I acknowledge my feelings without judgment. I am worthy of peace and healing. Each moment is a new opportunity.'";
  }
  
  if (msg.includes('thank') || msg.includes('helped') || msg.includes('better')) {
    return "I'm so glad we could work through this together. Remember, you have incredible strength within you. Would you like to try another affirmation to carry with you today?";
  }
  
  // Default response for any other input
  return "I'm here with you, and I hear that you're going through something. Would you like to share more about what you're feeling? We can work through some affirmations together that might help support you in this moment.";
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playAudio = async (message: Message) => {
    if (!message.audio) {
      try {
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { text: message.content },
        });

        if (error) throw error;

        if (data.audio) {
          // Update message with audio
          setMessages(prev => prev.map(msg => 
            msg === message ? { ...msg, audio: data.audio } : msg
          ));
          
          // Play the audio
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
          audioRef.current = audio;
          audio.onended = () => setIsPlaying(false);
          await audio.play();
          setIsPlaying(true);
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
      // Play cached audio
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Add user message
      const userMessage = { type: 'user' as const, content: message };
      setMessages(prev => [...prev, userMessage]);
      setMessage(""); // Clear input immediately
      
      // Generate AI response
      const aiResponse = generateAIResponse(message);
      const aiMessage = { type: 'ai' as const, content: aiResponse };
      
      // Add AI message and generate speech
      setMessages(prev => [...prev, aiMessage]);
      
      // Get text-to-speech for AI response
      const { data: ttsData, error: ttsError } = await supabase.functions.invoke('text-to-speech', {
        body: { text: aiResponse }
      });

      if (ttsError) throw ttsError;

      if (ttsData?.audio) {
        // Update AI message with audio
        setMessages(prev => prev.map(msg => 
          msg === aiMessage ? { ...msg, audio: ttsData.audio } : msg
        ));
        
        // Play the audio
        const audio = new Audio(`data:audio/mpeg;base64,${ttsData.audio}`);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        await audio.play();
        setIsPlaying(true);
      }

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

  const handleVoiceInput = async (audioBase64: string) => {
    try {
      // First, get the transcription
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: audioBase64 }
      });

      if (transcriptionError) throw transcriptionError;

      if (transcriptionData?.text) {
        // Add user's transcribed message
        const userMessage = { type: 'user' as const, content: transcriptionData.text };
        setMessages(prev => [...prev, userMessage]);

        // Generate AI response
        const aiResponse = generateAIResponse(transcriptionData.text);
        const aiMessage = { type: 'ai' as const, content: aiResponse };

        // Add AI message and generate speech
        setMessages(prev => [...prev, aiMessage]);

        // Get text-to-speech for AI response
        const { data: ttsData, error: ttsError } = await supabase.functions.invoke('text-to-speech', {
          body: { text: aiResponse }
        });

        if (ttsError) throw ttsError;

        if (ttsData?.audio) {
          // Update AI message with audio
          setMessages(prev => prev.map(msg => 
            msg === aiMessage ? { ...msg, audio: ttsData.audio } : msg
          ));
          
          // Play the audio
          const audio = new Audio(`data:audio/mpeg;base64,${ttsData.audio}`);
          audioRef.current = audio;
          audio.onended = () => setIsPlaying(false);
          await audio.play();
          setIsPlaying(true);
        }
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
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs opacity-70">
                    {msg.type === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  {msg.type === 'ai' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => isPlaying ? stopAudio() : playAudio(msg)}
                    >
                      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  )}
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
            <div ref={messagesEndRef} />
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

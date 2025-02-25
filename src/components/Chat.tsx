
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
import { Button } from "./ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, Mic } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("5min");
  const [showChat, setShowChat] = useState(false);
  
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
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
        setLoading(false);
        return;
      }

      if (affirmationSession.isActive) {
        if (message.toLowerCase().includes(affirmationSession.currentAffirmation.toLowerCase())) {
          const nextAffirmation = await handleAffirmationComplete();
          if (nextAffirmation) {
            const aiResponse = await generateAIResponse(nextAffirmation);
            setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
          } else {
            setMessages(prev => [...prev, { 
              type: 'ai', 
              content: "Great job completing your affirmation session! How do you feel now?" 
            }]);
          }
        } else {
          setMessages(prev => [...prev, { 
            type: 'ai', 
            content: "Try repeating the affirmation exactly as shown. Take a deep breath and try again." 
          }]);
        }
        setLoading(false);
        return;
      }

      const aiResponse = await generateAIResponse(message);
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      setShowChat(true);

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

  const handleSuggestedPrompt = async (prompt: string) => {
    setMessage(prompt);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  };

  const createAffirmations = async () => {
    setLoading(true);
    try {
      let prompt = message || "Create affirmations for me";
      
      // Add context from selections
      prompt += ` for a ${duration} session`;
      if (language !== "English") {
        prompt += ` in ${language}`;
      }
      
      const aiResponse = await generateAIResponse(prompt);
      setMessages([
        { type: 'user', content: prompt },
        { type: 'ai', content: aiResponse }
      ]);
      setShowChat(true);
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

  // UI for the main input screen
  const renderInputScreen = () => (
    <div className="flex flex-col space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary-foreground">
          Transform Your Self-Talk,<br />
          Unlock Your True Potential
        </h1>
        <p className="text-xl text-[#9b87f5]">
          World's First AI APP Creating Custom Affirmations
        </p>
      </div>

      <div className="text-center">
        <p className="text-lg text-[#9b87f5] mb-2">Chat or speak</p>
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How are you feeling today?"
            className="w-full p-4 pr-14 rounded-full border border-[#9b87f5]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#9b87f5]/50"
          />
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-[#9b87f5]"
          >
            <Mic className={`w-5 h-5 text-white ${isRecording ? "animate-pulse" : ""}`} />
          </Button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-gray-700">Try this</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleSuggestedPrompt("Learning to love myself more")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5"
          >
            Learning to love myself more
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSuggestedPrompt("Dealing with work stress")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5"
          >
            Dealing with work stress
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSuggestedPrompt("Starting a new chapter")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5"
          >
            Starting a new chapter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg text-gray-700 mb-2">Duration</h3>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-full rounded-full border border-[#9b87f5]/20">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5min">5min - Perfect for Daily Practice</SelectItem>
              <SelectItem value="10min">10min - Standard Session</SelectItem>
              <SelectItem value="15min">15min - Deep Immersion</SelectItem>
              <SelectItem value="20min">20min - Complete Transformation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h3 className="text-lg text-gray-700 mb-2">Language</h3>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full rounded-full border border-[#9b87f5]/20">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
              <SelectItem value="Korean">Korean</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={createAffirmations}
        disabled={loading}
        className="w-full py-6 bg-[#9b87f5] hover:bg-[#7E69AB] text-white text-xl font-semibold rounded-lg"
      >
        Create My Affirmations
      </Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-4rem)]">
      <WavyBackground />
      <Card className="p-8 w-full bg-white/70 backdrop-blur-xl shadow-xl border-primary/20">
        <div className="max-w-md mx-auto">
          {showChat ? (
            <>
              {affirmationSession.isActive && (
                <div className="mb-4 p-3 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-primary-foreground">
                    Affirmation Session in Progress - {affirmationSession.index + 1} of {affirmationSession.affirmations.length}
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowChat(false)}
                  className="text-[#9b87f5]"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <h2 className="text-2xl font-bold text-primary-foreground">
                  {affirmationSession.isActive 
                    ? "Repeat this affirmation:" 
                    : "Your Affirmations"}
                </h2>
                <div className="w-16"></div> {/* Empty div for centering */}
              </div>
              
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
            </>
          ) : (
            renderInputScreen()
          )}
        </div>
      </Card>
    </div>
  );
}

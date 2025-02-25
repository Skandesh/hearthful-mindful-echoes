
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Message } from "./chat/types";
import { WavyBackground } from "./chat/WavyBackground";
import { useAudio } from "./chat/useAudio";
import { useAffirmations } from "./chat/useAffirmations";
import { useRecording } from "./chat/useRecording";
import { generateAIResponse } from "./chat/ChatService";
import { HomeScreen } from "./chat/HomeScreen";
import { ChatSession } from "./chat/ChatSession";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("5min");
  const [showChat, setShowChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const { isPlaying, playAudio, stopAudio } = useAudio();
  const { affirmationSession, startAffirmationSession, handleAffirmationComplete } = useAffirmations();
  const { isRecording, startRecording, stopRecording, processRecording } = useRecording();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = async () => {
    try {
      setLoading(true);
      const transcribedText = await processRecording();
      
      if (transcribedText) {
        // Add user's transcribed message
        setMessages(prev => [...prev, { type: 'user', content: transcribedText }]);

        // Generate AI response
        const aiResponse = await generateAIResponse(transcribedText);
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
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

  const handleStartRecording = async () => {
    const recorder = await startRecording();
    if (recorder) {
      recorder.onstop = handleVoiceInput;
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
      
      // Start affirmation session automatically
      if (!affirmationSession.isActive) {
        const mood = message || "positive";
        await startAffirmationSession(mood);
      }
      
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

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-4rem)]">
      <WavyBackground />
      <Card className="p-8 w-full bg-white/70 backdrop-blur-xl shadow-xl border-primary/20">
        <div className="max-w-md mx-auto">
          {showChat ? (
            <ChatSession 
              messages={messages}
              message={message}
              isPlaying={isPlaying}
              loading={loading}
              isRecording={isRecording}
              affirmationSession={affirmationSession}
              messagesEndRef={messagesEndRef}
              onBackClick={() => setShowChat(false)}
              onMessageChange={setMessage}
              onSubmit={handleSubmit}
              onPlayAudio={playAudio}
              onStopAudio={stopAudio}
              onStartRecording={handleStartRecording}
              onStopRecording={stopRecording}
            />
          ) : (
            <HomeScreen 
              message={message}
              isRecording={isRecording}
              loading={loading}
              language={language}
              duration={duration}
              onMessageChange={setMessage}
              onStartRecording={handleStartRecording}
              onStopRecording={stopRecording}
              onSuggestedPrompt={handleSuggestedPrompt}
              onLanguageChange={setLanguage}
              onDurationChange={setDuration}
              onCreateAffirmations={createAffirmations}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

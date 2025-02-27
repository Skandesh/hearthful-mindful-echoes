
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { WavyBackground } from "./WavyBackground";
import { ChatSession } from "./ChatSession";
import { HomeScreen } from "./HomeScreen";
import { AffirmationHistory } from "./AffirmationHistory";
import { Message } from "./types";
import { AffirmationSession } from "./types";
import { UserAffirmation } from "./types";
import { UserPlan } from "./types";
import { RefObject } from "react";

interface ChatContainerProps {
  user: any;
  showChat: boolean;
  showHistory: boolean;
  messages: Message[];
  message: string;
  isPlaying: boolean;
  loading: boolean;
  isRecording: boolean;
  language: string;
  duration: string;
  affirmationSession: AffirmationSession;
  userAffirmations: UserAffirmation[];
  favoriteAffirmations: UserAffirmation[];
  userPlan: UserPlan | null;
  messagesEndRef: RefObject<HTMLDivElement>;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLanguageChange: (language: string) => void;
  onDurationChange: (duration: string) => void;
  onPlayAudio: (msg: Message) => void;
  onStopAudio: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onBackClick: () => void;
  onSuggestedPrompt: (prompt: string) => void;
  onCreateAffirmations: () => void;
  onToggleFavorite: (id: string) => Promise<void>;
  onShowHistory: () => void;
  onCloseHistory: () => void;
}

export function ChatContainer({
  user,
  showChat,
  showHistory,
  messages,
  message,
  isPlaying,
  loading,
  isRecording,
  language,
  duration,
  affirmationSession,
  userAffirmations,
  favoriteAffirmations,
  userPlan,
  messagesEndRef,
  onMessageChange,
  onSubmit,
  onLanguageChange,
  onDurationChange,
  onPlayAudio,
  onStopAudio,
  onStartRecording,
  onStopRecording,
  onBackClick,
  onSuggestedPrompt,
  onCreateAffirmations,
  onToggleFavorite,
  onShowHistory,
  onCloseHistory,
}: ChatContainerProps) {
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-4rem)]">
      <WavyBackground />
      <Card className="p-8 w-full bg-white/70 backdrop-blur-xl shadow-xl border-primary/20">
        {user && (
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-sm text-primary"
              onClick={onShowHistory}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </Button>
          </div>
        )}
        
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
              onBackClick={onBackClick}
              onMessageChange={onMessageChange}
              onSubmit={onSubmit}
              onPlayAudio={onPlayAudio}
              onStopAudio={onStopAudio}
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
            />
          ) : (
            <HomeScreen 
              message={message}
              isRecording={isRecording}
              loading={loading}
              language={language}
              duration={duration}
              onMessageChange={onMessageChange}
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
              onSuggestedPrompt={onSuggestedPrompt}
              onLanguageChange={onLanguageChange}
              onDurationChange={onDurationChange}
              onCreateAffirmations={onCreateAffirmations}
            />
          )}
        </div>
      </Card>
      
      {showHistory && (
        <AffirmationHistory 
          affirmations={userAffirmations}
          favoriteAffirmations={favoriteAffirmations}
          userPlanInfo={{
            used: userPlan?.affirmations_used || 0,
            limit: userPlan?.affirmations_limit || 10,
            type: userPlan?.plan_type || 'free'
          }}
          onToggleFavorite={(id: string, status: boolean) => onToggleFavorite(id)}
          onClose={onCloseHistory}
        />
      )}
    </div>
  );
}

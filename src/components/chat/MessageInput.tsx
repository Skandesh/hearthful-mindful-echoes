
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, SendHorizonal } from "lucide-react";

interface MessageInputProps {
  message: string;
  loading: boolean;
  isRecording: boolean;
  isAffirmationSession: boolean;
  onMessageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function MessageInput({
  message,
  loading,
  isRecording,
  isAffirmationSession,
  onMessageChange,
  onSubmit,
  onStartRecording,
  onStopRecording,
}: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex gap-3">
        <Textarea
          placeholder={isAffirmationSession 
            ? "Repeat the affirmation..." 
            : "Share your thoughts and feelings..."}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="min-h-[120px] bg-white/80 backdrop-blur-sm border-primary/20 focus:border-primary text-primary-foreground placeholder:text-primary-foreground/50"
        />
        <Button
          type="button"
          variant="outline"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`flex-shrink-0 transition-all duration-300 hover:scale-105 ${
            isRecording ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' : 'border-primary/20 bg-white/80 text-primary-foreground hover:bg-primary/10'
          }`}
        >
          {isRecording ? 
            <MicOff className="h-5 w-5 text-red-500" /> : 
            <Mic className="h-5 w-5" />
          }
        </Button>
      </div>
      <Button 
        type="submit" 
        disabled={loading || !message.trim()}
        className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:scale-[1.02]"
      >
        <SendHorizonal className="mr-2 h-5 w-5" />
        {isAffirmationSession ? "Submit Affirmation" : "Share"}
      </Button>
    </form>
  );
}

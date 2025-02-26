
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
  // Get the current affirmation from the Chat component context or props
  const matchesAffirmation = (inputText: string, affirmationText: string) => {
    // Normalize both strings for comparison
    // Remove punctuation, extra spaces, and convert to lowercase
    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };
    
    const normalizedInput = normalizeText(inputText);
    const normalizedAffirmation = normalizeText(affirmationText);
    
    return normalizedInput === normalizedAffirmation;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="relative w-full">
          <Textarea
            placeholder={isAffirmationSession 
              ? "Type the affirmation exactly as shown above..." 
              : "Share your thoughts or ask a question..."}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="min-h-[100px] bg-white/80 backdrop-blur-sm border-[#9b87f5]/20 focus:border-[#9b87f5] rounded-xl text-primary-foreground placeholder:text-gray-400 pr-12 resize-none shadow-sm"
          />
          {isAffirmationSession && message.trim() && (
            <div className="absolute -top-6 right-0 text-xs">
              {/* This is a placeholder since we can't actually check against the current affirmation
                  without passing it as a prop. We'll need to update the Chat component to pass it. */}
              <span className="text-gray-500">
                Type exactly as shown to proceed
              </span>
            </div>
          )}
          <div className="absolute bottom-2 right-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={`rounded-full h-8 w-8 ${
                isRecording 
                  ? 'bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600' 
                  : 'text-[#9b87f5] hover:bg-[#9b87f5]/10'
              }`}
              title={isRecording ? "Stop recording" : isAffirmationSession ? "Record affirmation" : "Start voice input"}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      {isAffirmationSession && (
        <div className="text-xs text-gray-500 italic px-2">
          <p>Tip: Speak or type the affirmation <strong>exactly</strong> as shown, then submit. {message.trim() ? "" : "Try copying it to ensure an exact match."}</p>
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={loading || !message.trim()}
        className="w-full bg-gradient-to-r from-[#9b87f5] to-[#543ab7] hover:from-[#8a75e8] hover:to-[#472e9d] text-white transition-all duration-300 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed rounded-xl"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            {isAffirmationSession ? "Processing..." : "Sending..."}
          </div>
        ) : (
          <>
            <SendHorizonal className="mr-2 h-4 w-4" />
            {isAffirmationSession ? "Submit Affirmation" : "Send Message"}
          </>
        )}
      </Button>
    </form>
  );
}

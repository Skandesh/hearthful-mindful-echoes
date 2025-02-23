
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  isPlaying: boolean;
  loading: boolean;
  onPlayAudio: (msg: Message) => void;
  onStopAudio: () => void;
}

export function MessageList({ 
  messages, 
  isPlaying, 
  loading, 
  onPlayAudio, 
  onStopAudio 
}: MessageListProps) {
  return (
    <div className="mb-6 space-y-4 max-h-[400px] overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg ${
            msg.type === 'user'
              ? 'bg-white/50 ml-8 border border-primary/10'
              : 'bg-primary/10 mr-8'
          } text-primary-foreground`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs opacity-70">
              {msg.type === 'user' ? 'You' : 'AI Assistant'}
            </span>
            {msg.type === 'ai' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:text-primary"
                onClick={() => isPlaying ? onStopAudio() : onPlayAudio(msg)}
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
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
    </div>
  );
}

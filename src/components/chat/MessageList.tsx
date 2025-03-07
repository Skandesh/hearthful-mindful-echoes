
import { Button } from "@/components/ui/button";
import { Speaker, SpeakerX } from "lucide-react";
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
    <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#9b87f5]/20 scrollbar-track-transparent">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-4 rounded-xl transition-all duration-300 ${
            msg.type === 'user'
              ? 'bg-white/70 ml-6 border border-[#9b87f5]/10 shadow-sm hover:shadow'
              : 'bg-gradient-to-r from-[#9b87f5]/10 to-[#543ab7]/10 mr-6 shadow-inner'
          } text-primary-foreground`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-medium ${
              msg.type === 'user' ? 'text-[#9b87f5]' : 'text-[#543ab7]'
            }`}>
              {msg.type === 'user' ? 'You' : 'AI Assistant'}
            </span>
            {msg.type === 'ai' && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 text-[#543ab7] hover:bg-[#543ab7]/10 rounded-full ${isPlaying ? 'bg-[#543ab7]/10' : ''}`}
                onClick={() => isPlaying ? onStopAudio() : onPlayAudio(msg)}
              >
                {isPlaying ? <SpeakerX className="h-4 w-4" /> : <Speaker className="h-4 w-4" />}
              </Button>
            )}
          </div>
          <div className="text-gray-800 leading-relaxed">
            {msg.content}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex items-center justify-center p-5">
          <div className="flex space-x-2">
            <div className="w-2.5 h-2.5 bg-[#9b87f5] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2.5 h-2.5 bg-[#9b87f5] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2.5 h-2.5 bg-[#9b87f5] rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
      {messages.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">
          <p>Your conversation will appear here</p>
        </div>
      )}
    </div>
  );
}

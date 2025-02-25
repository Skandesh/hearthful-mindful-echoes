
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Mic } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HomeScreenProps {
  message: string;
  isRecording: boolean;
  loading: boolean;
  language: string;
  duration: string;
  onMessageChange: (message: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSuggestedPrompt: (prompt: string) => void;
  onLanguageChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onCreateAffirmations: () => void;
}

export function HomeScreen({
  message,
  isRecording,
  loading,
  language,
  duration,
  onMessageChange,
  onStartRecording,
  onStopRecording,
  onSuggestedPrompt,
  onLanguageChange,
  onDurationChange,
  onCreateAffirmations,
}: HomeScreenProps) {
  return (
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
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="How are you feeling today?"
            className="w-full p-4 pr-14 rounded-full border border-[#9b87f5]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#9b87f5]/50"
          />
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
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
            onClick={() => onSuggestedPrompt("Learning to love myself more")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5"
          >
            Learning to love myself more
          </Button>
          <Button
            variant="outline"
            onClick={() => onSuggestedPrompt("Dealing with work stress")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5"
          >
            Dealing with work stress
          </Button>
          <Button
            variant="outline"
            onClick={() => onSuggestedPrompt("Starting a new chapter")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5"
          >
            Starting a new chapter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg text-gray-700 mb-2">Duration</h3>
          <Select value={duration} onValueChange={onDurationChange}>
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
          <Select value={language} onValueChange={onLanguageChange}>
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
        onClick={onCreateAffirmations}
        disabled={loading}
        className="w-full py-6 bg-[#9b87f5] hover:bg-[#7E69AB] text-white text-xl font-semibold rounded-lg"
      >
        Create My Affirmations
      </Button>
    </div>
  );
}

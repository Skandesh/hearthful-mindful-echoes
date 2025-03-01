
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Mic, Sparkles, Music, Crown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VoiceOption } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HomeScreenProps {
  message: string;
  isRecording: boolean;
  loading: boolean;
  language: string;
  duration: string;
  voiceOptions: VoiceOption[];
  selectedVoice: string;
  enableBackgroundMusic: boolean;
  onMessageChange: (message: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSuggestedPrompt: (prompt: string) => void;
  onLanguageChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onVoiceChange: (value: string) => void;
  onBackgroundMusicChange: (value: boolean) => void;
  onCreateAffirmations: () => void;
}

export function HomeScreen({
  message,
  isRecording,
  loading,
  language,
  duration,
  voiceOptions,
  selectedVoice,
  enableBackgroundMusic,
  onMessageChange,
  onStartRecording,
  onStopRecording,
  onSuggestedPrompt,
  onLanguageChange,
  onDurationChange,
  onVoiceChange,
  onBackgroundMusicChange,
  onCreateAffirmations,
}: HomeScreenProps) {
  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          <span>AI-Powered Affirmations</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-[#543ab7] to-[#00acc1] text-transparent bg-clip-text leading-tight">
          Transform Your Self-Talk,<br />
          Unlock Your Potential
        </h1>
        <p className="text-lg text-[#9b87f5] max-w-md mx-auto">
          Personalized affirmations to boost confidence, reduce stress, and improve focus
        </p>
      </div>

      <div className="relative group">
        <div className="text-center mb-2">
          <p className="text-base text-[#9b87f5] font-medium">How are you feeling today?</p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Share your thoughts or feelings..."
            className="w-full p-4 pr-14 rounded-full border border-[#9b87f5]/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#9b87f5]/50 shadow-sm transition-all duration-300 group-hover:shadow-md"
          />
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 transition-all duration-300 ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-[#9b87f5] hover:bg-[#8a75e8]"
            }`}
          >
            <Mic className={`w-5 h-5 text-white ${isRecording ? "animate-pulse" : ""}`} />
          </Button>
        </div>
        <p className="mt-2 text-xs text-center text-gray-500">Type or use your voice to tell us how you're feeling</p>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#9b87f5]/10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-medium text-primary-foreground">Common Situations</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#9b87f5]">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#9b87f5]">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => onSuggestedPrompt("I want to feel more confident today")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5 text-sm py-1 h-auto"
          >
            Boost confidence
          </Button>
          <Button
            variant="outline"
            onClick={() => onSuggestedPrompt("I'm feeling anxious about work")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5 text-sm py-1 h-auto"
          >
            Reduce work anxiety
          </Button>
          <Button
            variant="outline"
            onClick={() => onSuggestedPrompt("I need to focus better")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5 text-sm py-1 h-auto"
          >
            Improve focus
          </Button>
          <Button
            variant="outline"
            onClick={() => onSuggestedPrompt("I want to feel more positive about myself")}
            className="rounded-full border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/5 text-sm py-1 h-auto"
          >
            Self-love
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#9b87f5]/10">
          <h3 className="text-base font-medium text-primary-foreground mb-3">Session Duration</h3>
          <Select value={duration} onValueChange={onDurationChange}>
            <SelectTrigger className="w-full rounded-lg border border-[#9b87f5]/20">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#9b87f5]/20 rounded-lg shadow-lg">
              <SelectItem value="5min">5min - Quick Boost</SelectItem>
              <SelectItem value="10min">10min - Standard Session</SelectItem>
              <SelectItem value="15min">15min - Deep Immersion</SelectItem>
              <SelectItem value="20min">20min - Complete Transformation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#9b87f5]/10">
          <h3 className="text-base font-medium text-primary-foreground mb-3">Language</h3>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full rounded-lg border border-[#9b87f5]/20">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#9b87f5]/20 rounded-lg shadow-lg">
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

      {/* Enhanced Voice Selection and Background Music UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#9b87f5]/10">
          <h3 className="text-base font-medium text-primary-foreground mb-3">Voice Selection</h3>
          <Select value={selectedVoice} onValueChange={onVoiceChange}>
            <SelectTrigger className="w-full rounded-lg border border-[#9b87f5]/20">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#9b87f5]/20 rounded-lg shadow-lg max-h-72">
              {voiceOptions.map(voice => (
                <SelectItem key={voice.id} value={voice.id} className="flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <span>{voice.name}</span>
                    {voice.premium && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-2">
                              <Crown className="h-3.5 w-3.5 text-amber-500 inline-block" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="text-xs">Premium voice (Pro & Premium plans)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-xs text-gray-500">
            Choose the voice that will narrate your affirmations
            {voiceOptions.some(v => v.premium) && (
              <span className="flex items-center mt-1">
                <Crown className="h-3 w-3 text-amber-500 mr-1 inline-block" />
                <span>Premium voices available with Pro & Premium plans</span>
              </span>
            )}
          </p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-[#9b87f5]/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-primary-foreground">Soothing Background</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Crown className="h-4 w-4 text-amber-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Premium feature (Pro & Premium plans)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="w-4 h-4 text-[#9b87f5]" />
              <Label htmlFor="background-music" className="text-sm text-gray-600">
                Enable calming background music
              </Label>
            </div>
            <Switch
              id="background-music"
              checked={enableBackgroundMusic}
              onCheckedChange={onBackgroundMusicChange}
              className="data-[state=checked]:bg-[#9b87f5]"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Gentle ambient sounds will play during your affirmation session
          </p>
        </div>
      </div>

      <Button 
        onClick={onCreateAffirmations}
        disabled={loading}
        className="w-full py-6 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#8a75e8] hover:to-[#6d5999] text-white text-xl font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating...
          </div>
        ) : (
          <>Create My Affirmations</>
        )}
      </Button>
    </div>
  );
}

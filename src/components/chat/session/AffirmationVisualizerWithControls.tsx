
import React from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import { AffirmationVisualizer } from "../AffirmationVisualizer";

interface AffirmationVisualizerWithControlsProps {
  isActive: boolean;
  isFullscreenMode: boolean;
  currentAffirmation: string;
  onToggleFullscreen?: () => void;
}

export function AffirmationVisualizerWithControls({
  isActive,
  isFullscreenMode,
  currentAffirmation,
  onToggleFullscreen
}: AffirmationVisualizerWithControlsProps) {
  if (!isActive) {
    return null;
  }

  return (
    <div className={`relative transition-all duration-500 ${isFullscreenMode ? 'w-full max-w-3xl' : ''}`}>
      <AffirmationVisualizer 
        isActive={isActive} 
        currentAffirmation={currentAffirmation} 
      />
      {onToggleFullscreen && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/30 hover:bg-white/50"
          onClick={onToggleFullscreen}
        >
          {isFullscreenMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}

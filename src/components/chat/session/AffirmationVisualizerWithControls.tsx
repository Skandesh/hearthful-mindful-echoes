
import React, { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import { AffirmationVisualizer } from "../AffirmationVisualizer";

interface AffirmationVisualizerWithControlsProps {
  isActive: boolean;
  isFullscreenMode: boolean;
  currentAffirmation: string;
  onToggleFullscreen?: () => void;
}

// Separate the fullscreen button to avoid re-renders
const FullscreenButton = memo(({ 
  isFullscreenMode, 
  onToggleFullscreen 
}: { 
  isFullscreenMode: boolean;
  onToggleFullscreen: () => void;
}) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/30 hover:bg-white/50"
      onClick={onToggleFullscreen}
    >
      {isFullscreenMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
    </Button>
  );
});
FullscreenButton.displayName = "FullscreenButton";

function AffirmationVisualizerWithControlsBase({
  isActive,
  isFullscreenMode,
  currentAffirmation,
  onToggleFullscreen
}: AffirmationVisualizerWithControlsProps) {
  // Early return optimization - don't render anything if not active
  if (!isActive) {
    return null;
  }

  // Memoize the container classes to prevent recalculations
  const containerClasses = useMemo(() => 
    `relative transition-all duration-500 ${isFullscreenMode ? 'w-full max-w-3xl' : ''}`,
    [isFullscreenMode]
  );

  return (
    <div className={containerClasses}>
      <AffirmationVisualizer 
        isActive={isActive} 
        currentAffirmation={currentAffirmation} 
      />
      {onToggleFullscreen && (
        <FullscreenButton 
          isFullscreenMode={isFullscreenMode} 
          onToggleFullscreen={onToggleFullscreen} 
        />
      )}
    </div>
  );
}

// Use React.memo for the main component
export const AffirmationVisualizerWithControls = React.memo(AffirmationVisualizerWithControlsBase);

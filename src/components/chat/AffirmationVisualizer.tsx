
import React from "react";
import { useVisualizer } from "./visualizer/useVisualizer";

interface AffirmationVisualizerProps {
  isActive: boolean;
  currentAffirmation: string;
}

function AffirmationVisualizerBase({ isActive, currentAffirmation }: AffirmationVisualizerProps) {
  const canvasRef = useVisualizer(isActive, currentAffirmation);
  
  return (
    <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-primary/10 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1">
      <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3 backdrop-blur-md shadow-inner">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Affirmation to Repeat</h3>
            <p className="text-white/70 text-xs">Say or type this exactly as shown</p>
          </div>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        className="w-full h-64 bg-gradient-to-b from-[#543ab7] to-[#00acc1]"
      />
      <div className="p-4 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
          <span>Please repeat this affirmation exactly, then submit</span>
        </div>
      </div>
    </div>
  );
}

// Use React.memo to prevent unnecessary re-renders
export const AffirmationVisualizer = React.memo(AffirmationVisualizerBase);


import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AffirmationSession } from "../types";

interface SessionHeaderProps {
  affirmationSession: AffirmationSession;
  onBackClick: () => void;
  isFullscreenMode: boolean;
}

export function SessionHeader({ 
  affirmationSession, 
  onBackClick, 
  isFullscreenMode 
}: SessionHeaderProps) {
  if (isFullscreenMode) {
    return null;
  }

  return (
    <>
      {affirmationSession.isActive && (
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/20 to-[#543ab7]/20 rounded-lg backdrop-blur-sm border border-primary/10 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary-foreground">
              Affirmation Session in Progress
              <span className="inline-flex items-center justify-center ml-3 px-2.5 py-1 rounded-full bg-primary/20 text-xs">
                {affirmationSession.index + 1}/{affirmationSession.affirmations.length}
              </span>
            </p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                    <HelpCircle className="h-4 w-4 text-primary-foreground/70" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4">
                  <div className="space-y-3 text-sm">
                    <p className="font-medium">How to complete the session:</p>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      <li>Type or say the affirmation <strong>exactly</strong> as shown</li>
                      <li>Press submit to confirm and move to the next affirmation</li>
                      <li>Complete all {affirmationSession.affirmations.length} affirmations to finish</li>
                    </ol>
                    <p className="text-xs italic mt-2">Try to speak each affirmation with feeling and belief</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Clear instructions for what to do */}
          <div className="mt-3 p-3 bg-white/20 rounded text-xs">
            <p><strong>Your task:</strong> Type or speak the displayed affirmation exactly as shown, then submit it.</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="outline" 
          onClick={onBackClick}
          className="text-[#9b87f5] border-[#9b87f5]/20 hover:bg-[#9b87f5]/5"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-[#543ab7] text-transparent bg-clip-text">
          {affirmationSession.isActive 
            ? "Repeat After Me" 
            : "Your Affirmations"}
        </h2>
        <div className="w-16"></div> {/* Empty div for centering */}
      </div>
    </>
  );
}

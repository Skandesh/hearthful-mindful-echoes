
import { Sparkles } from "lucide-react";
import { StepCard } from "./StepCard";

export const ProcessSection = () => {
  return (
    <div className="container-custom py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-[#E7F0FD] to-[#ACCBEE] px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#9b87f5]/10 text-[#543ab7] text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
          Simple Process
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4 md:mb-6">
          How Hearth Works
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered platform creates personalized affirmations tailored to your unique emotional needs
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-4 md:gap-6 lg:gap-8 relative">
        {/* Connection lines (desktop only) */}
        <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-[#9b87f5] to-[#543ab7] transform -translate-y-1/2" />
        
        <StepCard 
          number={1}
          title="Share How You Feel"
          description="Tell us what's on your mind or select from common emotional states"
          iconName="Heart"
        />
        
        <StepCard 
          number={2}
          title="AI Creates Affirmations"
          description="Our AI generates personalized affirmations based on your emotional state"
          iconName="BrainCircuit"
        />
        
        <StepCard 
          number={3}
          title="Transform Your Mindset"
          description="Listen and repeat the affirmations to rewire your thinking patterns"
          iconName="Sparkles"
        />
      </div>
    </div>
  );
};

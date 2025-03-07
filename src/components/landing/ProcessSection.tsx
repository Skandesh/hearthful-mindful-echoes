
import { Sparkles } from "lucide-react";
import { StepCard } from "./StepCard";

export const ProcessSection = () => {
  return (
    <div className="container-custom py-14 md:py-20 bg-gradient-to-b from-[#E7F0FD] to-[#ACCBEE]">
      <div className="text-center mb-12 md:mb-16">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#9b87f5]/10 text-[#543ab7] text-sm font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Simple Process
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 md:mb-6">
          How Hearth Works
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered platform creates personalized affirmations tailored to your unique emotional needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
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

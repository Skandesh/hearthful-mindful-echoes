
import { Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TestimonialCard } from "./TestimonialCard";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  user: any;
  startPath: string;
}

export const HeroSection = ({
  user,
  startPath
}: HeroSectionProps) => {
  const [animateCards, setAnimateCards] = useState(false);
  
  useEffect(() => {
    setAnimateCards(true);
  }, []);
  
  return (
    <AuroraBackground className="pt-20 md:pt-32 pb-12 md:pb-24 lg:pb-32 px-4 sm:px-6 overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-12 w-full">
          {/* Text Content */}
          <div className="text-center md:text-left md:w-1/2 space-y-3 md:space-y-5 relative z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 backdrop-blur-md text-primary-foreground mb-2 hover-lift"
            >
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              <span className="text-xs sm:text-sm font-medium">Begin Your Healing Journey</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            >
              Transform Your Mind with{" "}
              <span className="gradient-text bg-gradient-to-r from-[#9b87f5] via-[#543ab7] to-[#00acc1]">
                AI-Powered Affirmations
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto md:mx-0"
            >
              Experience personalized emotional healing through AI-generated affirmations, 
              delivered in a soothing voice with perfect timing and rhythm.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 pt-3 sm:pt-5 w-full"
            >
              <Button 
                asChild 
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#9b87f5] to-[#543ab7] hover:opacity-90 text-white transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                <Link to={startPath}>
                  Get Started {user ? "Now" : "Free"}
                  <ChevronRight className="ml-1.5 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#9b87f5]/20 hover:bg-[#9b87f5]/5 transition-all duration-300 hover:scale-105 text-sm sm:text-base mt-2 sm:mt-0"
              >
                <a href="#features">
                  See How It Works
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.7, delay: 0.3 }}
            className="md:w-1/2 mt-8 md:mt-0 w-full max-w-md mx-auto md:max-w-none"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#9b87f5] to-[#543ab7] opacity-75 blur-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Person meditating peacefully" 
                className="relative rounded-2xl w-full h-auto object-cover shadow-xl transition-all duration-300 hover:shadow-2xl z-10 aspect-[4/3]" 
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-5 -right-5 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#9b87f5]/50 to-[#543ab7]/50 blur-xl z-0"></div>
              <div className="absolute -bottom-7 -left-7 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-[#00acc1]/30 to-[#543ab7]/30 blur-xl z-0"></div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial Cards Section */}
        <div className="relative max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 mb-4 sm:mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-0"
          >
            {/* Testimonial Cards */}
            <TestimonialCard 
              animate={animateCards} 
              delay={0} 
              quote="These affirmations have completely transformed my morning routine. I feel centered and confident." 
              author="Sarah L." 
              iconName="Stars" 
            />
            
            <TestimonialCard 
              animate={animateCards} 
              delay={0.2} 
              quote="The personalized approach is incredible. It's like the AI knows exactly what I need to hear." 
              author="Michael T." 
              iconName="BrainCircuit" 
            />
            
            <TestimonialCard 
              animate={animateCards} 
              delay={0.4} 
              quote="I've tried many mindfulness apps, but this one connects with me on a deeper level. Truly amazing." 
              author="Dana W." 
              iconName="Wand2" 
            />
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  );
};

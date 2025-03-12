
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
    <AuroraBackground className="pt-32 pb-24 md:pt-36 md:pb-32">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text Content */}
          <div className="text-center md:text-left md:w-1/2 space-y-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-md text-primary-foreground mb-2 hover-lift"
            >
              <Heart className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Begin Your Healing Journey</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
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
              className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg mt-3"
            >
              Experience personalized emotional healing through AI-generated affirmations, 
              delivered in a soothing voice with perfect timing and rhythm.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-6"
            >
              <Button 
                asChild 
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#9b87f5] to-[#543ab7] hover:opacity-90 text-white transition-all duration-300 hover:scale-105"
              >
                <Link to={startPath}>
                  Get Started {user ? "Now" : "Free"}
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#9b87f5]/20 hover:bg-[#9b87f5]/5 transition-all duration-300 hover:scale-105"
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
            className="md:w-1/2 mt-8 md:mt-0"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#9b87f5] to-[#543ab7] opacity-75 blur-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Person meditating peacefully" 
                className="relative rounded-2xl w-full h-auto object-cover shadow-xl transition-all duration-300 hover:shadow-2xl z-10" 
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-r from-[#9b87f5]/50 to-[#543ab7]/50 blur-xl z-0"></div>
              <div className="absolute -bottom-7 -left-7 w-28 h-28 rounded-full bg-gradient-to-r from-[#00acc1]/30 to-[#543ab7]/30 blur-xl z-0"></div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial Cards Section - Fixed layout */}
        <div className="relative max-w-5xl mx-auto mt-20 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
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

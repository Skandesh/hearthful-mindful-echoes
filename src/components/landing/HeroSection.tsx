
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type HeroSectionProps = {
  user: any;
  startPath: string;
};

export const HeroSection = ({ user, startPath }: HeroSectionProps) => {
  return (
    <div className="relative pt-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#9b87f5]/20 to-transparent" style={{ zIndex: -1 }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-6 items-center">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Daily Affirmations for Your 
              <span className="text-[#9b87f5] ml-2">Mental Wellbeing</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Personalized affirmations delivered through voice technology to help you build a positive mindset and improve your mental health.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="bg-[#9b87f5] hover:bg-[#8b76e5] text-white px-6 py-6 h-auto text-lg rounded-xl"
              >
                <Link to={startPath} className="flex items-center gap-2">
                  {user ? "Go to Dashboard" : "Start Now"} 
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="border-[#9b87f5]/20 text-[#9b87f5] hover:bg-[#9b87f5]/5 px-6 py-6 h-auto text-lg rounded-xl"
              >
                <a href="#features">Learn More</a>
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground pt-2">
              <span className="inline-block px-3 py-1 bg-[#9b87f5]/5 rounded-full text-[#9b87f5] font-medium">
                🚀 No credit card required
              </span>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative w-full aspect-[4/3] max-w-xl mx-auto rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/placeholder.svg"
                alt="Hearth Affirmations App"
                className="object-cover w-full h-full"
              />
              
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#9b87f5]/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

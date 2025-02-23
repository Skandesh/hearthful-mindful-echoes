
import { Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-light to-warm">
      {/* Hero Section */}
      <header className="container-custom py-24">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary-foreground mb-4 animate-fade-in">
            <Heart className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Begin Your Healing Journey</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight animate-fade-up">
            AI-Powered Personalized Affirmations for Your Emotional Wellbeing
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Transform your emotional landscape with personalized affirmations, 
            tailored to your unique journey and delivered in a soothing voice.
          </p>

          <div className="flex justify-center gap-4 pt-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <a
              href="/app"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ChevronRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Features Preview */}
      <section className="container-custom py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-foreground">
            Experience Emotional Healing Through AI
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Speak or type your thoughts, and let our AI create perfectly tailored affirmations 
            in multiple languages with soothing background music.
          </p>
          <div className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <span className="font-medium">Coming Soon</span>
            <ChevronRight className="ml-1 w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-custom py-12">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hearth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

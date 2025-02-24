
import { Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Features } from "@/components/sections/Features";
import { ScientificStudies } from "@/components/sections/ScientificStudies";
import { Pricing } from "@/components/sections/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Hero Section */}
      <AuroraBackground className="py-24">
        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-md text-primary-foreground mb-4 hover-lift"
          >
            <Heart className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Begin Your Healing Journey</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold leading-tight"
          >
            Transform Your Mind with{" "}
            <span className="gradient-text">AI-Powered Affirmations</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Experience personalized emotional healing through AI-generated affirmations, 
            delivered in a soothing voice with perfect timing and rhythm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <Button
              asChild
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:scale-105"
            >
              <a href="/app">
                Get Started Free
                <ChevronRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
            >
              <a href="#features">
                See How It Works
              </a>
            </Button>
          </motion.div>
        </div>
      </AuroraBackground>

      <Features />
      <ScientificStudies />
      <Pricing />

      {/* CTA Section */}
      <section className="container-custom py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-foreground">
            Start Your Healing Journey Today
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of others who have transformed their emotional wellbeing with Hearth's 
            AI-powered affirmations.
          </p>
          <Button
            asChild
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            <a href="/app">
              Begin Free Trial
              <ChevronRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </motion.div>
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

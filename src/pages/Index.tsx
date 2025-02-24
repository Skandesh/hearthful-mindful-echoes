
import { 
  Heart, 
  ChevronRight, 
  Brain, 
  Mic, 
  Clock, 
  Languages, 
  Medal,
  Check 
} from "lucide-react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "Limited affirmations (text-based only)",
      "Basic emotional tracking",
      "2-minute sessions",
      "English language only"
    ]
  },
  {
    name: "Pro",
    price: "9",
    description: "Most popular for personal use",
    features: [
      "Unlimited affirmations",
      "AI voice narration",
      "Background music",
      "All session durations",
      "3 language options",
      "Basic emotion tracking"
    ]
  },
  {
    name: "Premium",
    price: "19",
    description: "Perfect for deep transformation",
    features: [
      "Everything in Pro",
      "Advanced AI emotion tracking",
      "Deep personalization",
      "All languages supported",
      "Priority AI processing",
      "Custom coaching sessions",
      "Premium voice packs"
    ]
  }
];

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Personalization",
    description: "Our advanced AI understands your emotions and creates perfectly tailored affirmations for your journey."
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Voice & Text Input",
    description: "Speak or type your thoughts naturally. Our AI handles accents and ensures accurate understanding."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Flexible Sessions",
    description: "Choose from 2 to 30-minute sessions, perfect for quick boosts or deep transformative work."
  },
  {
    icon: <Languages className="w-6 h-6" />,
    title: "Multi-Language Support",
    description: "Experience healing in your preferred language with natural, authentic pronunciations."
  }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AuroraBackground className="py-24">
        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-accent-soft/30 backdrop-blur-md text-primary-foreground mb-4 hover-lift"
          >
            <Heart className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium">Begin Your Healing Journey</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary animate-gradient"
          >
            Transform Your Mind with{" "}
            <span className="text-primary">AI-Powered</span>{" "}
            <span className="relative">
              Affirmations
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto backdrop-blur-sm py-2"
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
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <a href="/app">
                Get Started Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <a href="#features">
                See How It Works
              </a>
            </Button>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Features Section */}
      <section id="features" className="relative container-custom py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-soft/20 to-warm-light/50 backdrop-blur-sm -z-10" />
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
          >
            Your Personal AI Healing Companion
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Discover how Hearth helps you transform your emotional wellbeing
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-xl hover:bg-white/60 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="feature-icon p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative container-custom py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-warm/30 to-warm-light/50 backdrop-blur-sm -z-10" />
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
          >
            Choose Your Healing Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Find the perfect plan for your transformation
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card p-8 rounded-xl ${
                plan.name === "Pro" ? "border-primary/30 ring-2 ring-primary/30 scale-105" : ""
              }`}
            >
              {plan.name === "Pro" && (
                <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium mb-4">
                  <Medal className="w-4 h-4" />
                  Most Popular
                </div>
              )}
              <div className="text-xl font-semibold text-primary-foreground mb-2">
                {plan.name}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-primary-foreground">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`w-full ${
                  plan.name === "Pro"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border border-primary/20 hover:bg-primary/5"
                }`}
              >
                <a href="/app">Get Started</a>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-soft/30 via-primary/20 to-accent-soft/30 animate-aurora" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-foreground">
              Start Your Healing Journey Today
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of others who have transformed their emotional wellbeing with Hearth's 
              AI-powered affirmations.
            </p>
            <Button
              asChild
              className="inline-flex items-center px-8 py-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            >
              <a href="/app">
                Begin Free Trial
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
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

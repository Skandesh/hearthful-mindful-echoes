import { 
  Heart, 
  ChevronRight, 
  Sparkles, 
  Brain, 
  Mic, 
  Clock, 
  Languages, 
  Medal,
  Check 
} from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-b from-warm-light to-warm">
      {/* Hero Section */}
      <header className="container-custom py-24">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary-foreground mb-4 hover-lift"
          >
            <Heart className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Begin Your Healing Journey</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight"
          >
            Transform Your Mind with{" "}
            <span className="gradient-text">AI-Powered Affirmations</span>
          </motion.h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Experience personalized emotional healing through AI-generated affirmations, 
            delivered in a soothing voice with perfect timing and rhythm.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <a
              href="/app"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started Free
              <ChevronRight className="ml-2 w-4 h-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="container-custom py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Your Personal AI Healing Companion
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover how Hearth helps you transform your emotional wellbeing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl hover:bg-white/60"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="feature-icon p-2 rounded-lg bg-primary/10 text-primary">
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
      <section id="pricing" className="container-custom py-24 bg-warm/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Choose Your Healing Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            Find the perfect plan for your transformation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card p-6 rounded-xl ${
                plan.name === "Pro" ? "border-primary/30 ring-1 ring-primary/30" : ""
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
              <a
                href="/app"
                className={`block text-center py-2 px-4 rounded-lg transition-colors ${
                  plan.name === "Pro"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border border-primary/20 hover:bg-primary/5"
                }`}
              >
                Get Started
              </a>
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
          className="glass-card rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary-foreground">
            Start Your Healing Journey Today
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of others who have transformed their emotional wellbeing with Hearth's 
            AI-powered affirmations.
          </p>
          <a
            href="/app"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Begin Free Trial
            <ChevronRight className="ml-2 w-4 h-4" />
          </a>
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

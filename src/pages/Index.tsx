import { 
  Heart, 
  ChevronRight, 
  Brain, 
  Mic, 
  Clock, 
  Languages, 
  Medal,
  Check,
  BookOpen,
  GraduationCap 
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
    icon: <Mic className="w-6 h-6" />,
    title: "Voice & Natural Language Processing",
    description: "Advanced AI understands your unique voice and natural language, adapting to your accent and speaking style for a truly personalized experience."
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Smart Personalization Engine",
    description: "Our AI learns your emotional patterns and creates custom affirmations that resonate deeply with your personal growth journey."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Flexible Duration Sessions",
    description: "Choose from quick 2-minute boosters to deep 30-minute transformative sessions, perfectly timed to fit your schedule."
  },
  {
    icon: <Languages className="w-6 h-6" />,
    title: "Multi-Language Support",
    description: "Experience healing in your preferred language with natural, authentic pronunciations and culturally relevant affirmations."
  }
];

const scientificStudies = [
  {
    title: "Journal of Clinical Psychology",
    year: "2023",
    finding: "Daily affirmations reduce stress levels by 32% and improve emotional resilience.",
    impact: "Participants showed significant improvement in managing daily stressors."
  },
  {
    title: "Social Cognitive and Affective Neuroscience",
    year: "2022",
    finding: "Positive self-affirmations activate neural pathways associated with reward and positive valuation.",
    impact: "Brain imaging reveals increased activity in regions linked to self-processing and valuation."
  }
];

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

      {/* Features Section */}
      <section id="features" className="container-custom py-24 bg-gradient-to-b from-[#E7F0FD] to-[#ACCBEE]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0EA5E9] mb-4">
            Your Personal AI Healing Companion
          </h2>
          <p className="text-lg text-slate-600">
            Discover how Hearth transforms your emotional wellbeing with cutting-edge AI technology
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
              className="glass-card p-6 rounded-xl hover:bg-white/60 border border-[#33C3F0]/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="feature-icon p-2 rounded-lg bg-[#1EAEDB]/10 text-[#1EAEDB]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#0EA5E9]">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Affirmations Importance Section */}
      <section className="container-custom py-24 bg-gradient-to-b from-[#ACCBEE] to-[#F2FCE2]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0EA5E9] mb-6">
            The Power of Daily Affirmations
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Scientific research shows that regular practice of positive affirmations can rewire neural pathways, 
            reduce stress, and enhance emotional well-being.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-6 rounded-xl">
              <BookOpen className="w-8 h-8 text-[#1EAEDB] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#0EA5E9] mb-3">
                Neuroplasticity Benefits
              </h3>
              <p className="text-slate-600">
                Affirmations strengthen neural pathways associated with positive self-image and emotional resilience, 
                leading to lasting behavioral changes.
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <GraduationCap className="w-8 h-8 text-[#1EAEDB] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#0EA5E9] mb-3">
                Emotional Intelligence
              </h3>
              <p className="text-slate-600">
                Regular practice enhances emotional awareness and self-regulation, 
                improving relationships and personal growth.
              </p>
            </div>
          </div>
        </div>

        {/* Scientific Studies Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-[#0EA5E9] mb-8 text-center">
            Backed by Science
          </h3>
          <div className="space-y-6">
            {scientificStudies.map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-[#0EA5E9] mb-2">
                      {study.title} ({study.year})
                    </h4>
                    <p className="text-slate-600 mb-2">{study.finding}</p>
                    <p className="text-sm text-slate-500">{study.impact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container-custom py-24 bg-gradient-to-b from-[#F2FCE2] to-[#F1F0FB]">
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


import { Check, Medal, X, Music, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      { text: "2 AI voice options", available: true },
      { text: "Limited affirmations (text-based only)", available: true },
      { text: "Basic emotional tracking", available: true },
      { text: "2-minute sessions", available: true },
      { text: "English language only", available: true },
      { text: "Premium voices", available: false, highlight: true },
      { text: "Background music", available: false, highlight: true },
    ]
  },
  {
    name: "Pro",
    price: "9",
    popular: true,
    description: "Most popular for personal use",
    features: [
      { text: "All 5 AI voice options", available: true, highlight: true },
      { text: "Unlimited affirmations", available: true },
      { text: "Background music", available: true, highlight: true },
      { text: "All session durations", available: true },
      { text: "3 language options", available: true },
      { text: "Basic emotion tracking", available: true },
      { text: "Advanced voice customization", available: false },
    ]
  },
  {
    name: "Premium",
    price: "19",
    description: "Perfect for deep transformation",
    features: [
      { text: "Everything in Pro", available: true },
      { text: "Advanced AI emotion tracking", available: true },
      { text: "Deep personalization", available: true },
      { text: "All languages supported", available: true },
      { text: "Priority AI processing", available: true },
      { text: "Custom coaching sessions", available: true },
      { text: "Premium voice customization", available: true, highlight: true },
    ]
  }
];

export const Pricing = () => {
  return (
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
            className={`glass-card p-6 rounded-xl shadow-lg relative ${
              plan.popular ? "border-primary/30 ring-1 ring-primary/30 transform scale-105" : "border border-gray-100"
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] border-0 px-4 py-1 text-white font-medium">
                <Medal className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            )}
            
            <div className="text-xl font-semibold text-primary-foreground mb-2 mt-4">
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
                <li key={feature.text} className={`flex items-center gap-2 text-sm ${feature.available ? '' : 'text-gray-400'}`}>
                  {feature.available ? (
                    <Check className={`w-4 h-4 ${feature.highlight ? 'text-green-500' : 'text-primary'}`} />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={feature.highlight ? 'font-medium' : ''}>
                    {feature.text}
                    {feature.text.includes("AI voice") && <Mic className="w-3 h-3 inline ml-1" />}
                    {feature.text.includes("Background music") && <Music className="w-3 h-3 inline ml-1" />}
                  </span>
                </li>
              ))}
            </ul>
            
            <Button
              asChild
              className={`w-full transition-all ${
                plan.popular
                  ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:opacity-90"
                  : "border border-primary/20 hover:bg-primary/5"
              }`}
            >
              <Link to="/auth">
                {plan.price === "0" ? "Start Free" : "Get Started"}
              </Link>
            </Button>
            
            {plan.price === "0" && (
              <p className="text-xs text-center text-gray-500 mt-4">No credit card required</p>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-20 max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-primary-foreground mb-4">
          Questions? We're Here to Help
        </h3>
        <p className="text-muted-foreground mb-6">
          Contact our support team for any questions about our plans, features, or how Hearth can help you transform your daily affirmation practice.
        </p>
        <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
          Contact Support
        </Button>
      </div>
    </section>
  );
};

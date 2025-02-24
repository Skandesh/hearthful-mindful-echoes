
import { Check, Medal } from "lucide-react";
import { motion } from "framer-motion";
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
  );
};

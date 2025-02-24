
import { Brain, Mic, Clock, Languages } from "lucide-react";
import { motion } from "framer-motion";

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

export const Features = () => {
  return (
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
  );
};

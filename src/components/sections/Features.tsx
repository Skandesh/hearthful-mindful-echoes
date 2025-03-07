
import { Mic2, BrainCircuit, ClockIcon, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Mic2 className="w-5 h-5 md:w-6 md:h-6" />,
    title: "Voice & Natural Language Processing",
    description: "Advanced AI understands your unique voice and natural language, adapting to your accent and speaking style for a truly personalized experience."
  },
  {
    icon: <BrainCircuit className="w-5 h-5 md:w-6 md:h-6" />,
    title: "Smart Personalization Engine",
    description: "Our AI learns your emotional patterns and creates custom affirmations that resonate deeply with your personal growth journey."
  },
  {
    icon: <ClockIcon className="w-5 h-5 md:w-6 md:h-6" />,
    title: "Flexible Duration Sessions",
    description: "Choose from quick 2-minute boosters to deep 30-minute transformative sessions, perfectly timed to fit your schedule."
  },
  {
    icon: <Globe2 className="w-5 h-5 md:w-6 md:h-6" />,
    title: "Multi-Language Support",
    description: "Experience healing in your preferred language with natural, authentic pronunciations and culturally relevant affirmations."
  }
];

export const Features = () => {
  return (
    <section id="features" className="container-custom py-16 md:py-28 bg-gradient-to-b from-[#E7F0FD] to-[#ACCBEE]">
      <div className="text-center mb-12 md:mb-18">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0EA5E9] mb-3 md:mb-5 px-4 md:px-0">
          Your Personal AI Healing Companion
        </h2>
        <p className="text-base md:text-lg text-slate-600 px-4 md:px-0">
          Discover how Hearth transforms your emotional wellbeing with cutting-edge AI technology
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-12 md:mb-16 px-4 md:px-0">
        {features.map((feature, index) => (
          <motion.div 
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-5 md:p-7 rounded-xl hover:bg-white/60 border border-[#33C3F0]/20"
          >
            <div className="flex items-center gap-3 md:gap-5 mb-3 md:mb-5">
              <div className="feature-icon p-2 md:p-3 rounded-lg bg-[#1EAEDB]/10 text-[#1EAEDB]">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#0EA5E9]">
                {feature.title}
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

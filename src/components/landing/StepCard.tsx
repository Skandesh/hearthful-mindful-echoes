
import { Heart, BrainCircuit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  iconName: "Heart" | "BrainCircuit" | "Sparkles";
}

export const StepCard = ({ number, title, description, iconName }: StepCardProps) => {
  // Map the icon name to the actual icon component
  const getIcon = (): ReactNode => {
    switch (iconName) {
      case "Heart":
        return <Heart className="w-6 h-6" />;
      case "BrainCircuit":
        return <BrainCircuit className="w-6 h-6" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm p-5 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center relative border border-[#9b87f5]/10"
    >
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#543ab7] flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div className="pt-6">
        <div className="w-12 h-12 rounded-full bg-[#9b87f5]/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
          {getIcon()}
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-primary-foreground">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
      </div>
    </motion.div>
  );
};


import { Stars, BrainCircuit, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  quote: string;
  author: string;
  iconName: "Stars" | "BrainCircuit" | "Wand2";
  animate: boolean;
  delay: number;
}

export const TestimonialCard = ({ quote, author, iconName, animate, delay }: TestimonialCardProps) => {
  // Map the icon name to the actual icon component
  const getIcon = () => {
    switch (iconName) {
      case "Stars":
        return <Stars className="w-5 h-5 text-[#9b87f5]" />;
      case "BrainCircuit":
        return <BrainCircuit className="w-5 h-5 text-[#9b87f5]" />;
      case "Wand2":
        return <Wand2 className="w-5 h-5 text-[#9b87f5]" />;
      default:
        return <Stars className="w-5 h-5 text-[#9b87f5]" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/80 backdrop-blur-sm p-5 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[#9b87f5]/10 h-full"
    >
      <div className="flex items-center mb-3 md:mb-4">
        <div className="p-2 rounded-full bg-[#9b87f5]/10">
          {getIcon()}
        </div>
      </div>
      <p className="text-gray-700 mb-3 md:mb-4 italic text-sm md:text-base flex-grow">&ldquo;{quote}&rdquo;</p>
      <p className="text-[#543ab7] font-medium text-sm md:text-base">{author}</p>
    </motion.div>
  );
};


import { motion } from "framer-motion";

interface StatCardProps {
  number: string;
  label: string;
  gradient: string;
}

export const StatCard = ({ number, label, gradient }: StatCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center p-3 md:p-4"
    >
      <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
        {number}
      </h3>
      <p className="text-gray-600 text-sm md:text-base">{label}</p>
    </motion.div>
  );
};


import { motion } from "framer-motion";

export const StatsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="stats-grid">
          {/* Active Users */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className="flex flex-col items-center text-center p-4 md:p-6"
          >
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#9b87f5] mb-2">10K+</h3>
            <p className="text-sm md:text-base text-gray-600">Active Users</p>
          </motion.div>
          
          {/* Reduced Stress */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center p-4 md:p-6"
          >
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#9b87f5] mb-2">87%</h3>
            <p className="text-sm md:text-base text-gray-600">Reduced Stress</p>
          </motion.div>
          
          {/* Affirmations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center p-4 md:p-6"
          >
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#9b87f5] mb-2">2M+</h3>
            <p className="text-sm md:text-base text-gray-600">Affirmations</p>
          </motion.div>
          
          {/* Rating */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center text-center p-4 md:p-6"
          >
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#9b87f5] mb-2">4.9</h3>
            <p className="text-sm md:text-base text-gray-600">Rating</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

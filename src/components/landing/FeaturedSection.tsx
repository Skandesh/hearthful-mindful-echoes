
import { motion } from "framer-motion";

export const FeaturedSection = () => {
  return (
    <section className="container-custom py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#F1F0FB] to-[#F7F5F3] px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12"
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground mb-4 sm:mb-5">
          Featured In
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          Hearth has been recognized by leading publications for its innovative approach to mental wellness
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-14"
      >
        {['Forbes', 'TechCrunch', 'Wired', 'Fast Company', 'Psychology Today'].map((name, index) => (
          <motion.div 
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-300 hover:text-gray-500 transition-colors duration-300"
          >
            {name}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

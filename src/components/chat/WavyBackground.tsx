
import { motion } from "framer-motion";

export function WavyBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        background: "linear-gradient(180deg, #FAF3F0 0%, #F5E6E8 100%)",
        overflow: "hidden"
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, #E8A87C 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

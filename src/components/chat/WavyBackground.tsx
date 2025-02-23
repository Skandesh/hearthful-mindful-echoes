
import { motion } from "framer-motion";

export function WavyBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #1a237e 100%)",
        overflow: "hidden"
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, #304ffe 0%, transparent 70%)",
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

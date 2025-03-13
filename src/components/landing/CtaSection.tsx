
import { ChevronRight, Stars } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CtaSectionProps {
  user: any;
  startPath: string;
}

export const CtaSection = ({ user, startPath }: CtaSectionProps) => {
  return (
    <section className="container-custom py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-card rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(155, 135, 245, 0.1) 0%, rgba(0, 172, 193, 0.1) 100%)",
          border: "1px solid rgba(155, 135, 245, 0.2)"
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 md:mb-6 text-primary-foreground">
            Start Your Healing Journey Today
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8">
            Join thousands of others who have transformed their emotional wellbeing with Hearth's 
            AI-powered affirmations.
          </p>
          <Button
            asChild
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#9b87f5] to-[#543ab7] text-white font-medium hover:opacity-90 transition-colors"
          >
            <Link to={startPath}>
              Begin {user ? "Now" : "Free Trial"}
              <ChevronRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </Button>
          
          {/* Decorative elements */}
          <div className="relative mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 md:pt-8 border-t border-[#9b87f5]/10">
            <div className="flex justify-center items-center gap-1 sm:gap-2 text-[#543ab7] font-medium text-sm sm:text-base">
              <Stars className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

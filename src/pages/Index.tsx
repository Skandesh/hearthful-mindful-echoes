import { Heart, ChevronRight, Sparkles, Stars, BrainCircuit, Wand2, Image } from "lucide-react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Features } from "@/components/sections/Features";
import { ScientificStudies } from "@/components/sections/ScientificStudies";
import { Pricing } from "@/components/sections/Pricing";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/App";
import { Link } from "react-router-dom";

const Index = () => {
  const [animateCards, setAnimateCards] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  // Determine the path for the "Get Started" button
  const startPath = user ? "/app" : "/auth";

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Hero Section */}
      <AuroraBackground className="py-12 md:py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Text Content */}
            <div className="text-center md:text-left md:w-1/2 space-y-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-md text-primary-foreground mb-4 hover-lift"
              >
                <Heart className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Begin Your Healing Journey</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight"
              >
                Transform Your Mind with{" "}
                <span className="gradient-text bg-gradient-to-r from-[#9b87f5] via-[#543ab7] to-[#00acc1]">
                  AI-Powered Affirmations
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg"
              >
                Experience personalized emotional healing through AI-generated affirmations, 
                delivered in a soothing voice with perfect timing and rhythm.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4"
              >
                <Button
                  asChild
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#9b87f5] to-[#543ab7] hover:opacity-90 text-white transition-all duration-300 hover:scale-105"
                >
                  <Link to={startPath}>
                    Get Started {user ? "Now" : "Free"}
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#9b87f5]/20 hover:bg-[#9b87f5]/5 transition-all duration-300 hover:scale-105"
                >
                  <a href="#features">
                    See How It Works
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="md:w-1/2 mt-8 md:mt-0"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#9b87f5] to-[#543ab7] opacity-75 blur-sm"></div>
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Person meditating peacefully" 
                  className="relative rounded-2xl w-full h-auto object-cover shadow-xl transition-all duration-300 hover:shadow-2xl z-10"
                />
                
                {/* Decorative elements */}
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-r from-[#9b87f5]/50 to-[#543ab7]/50 blur-xl z-0"></div>
                <div className="absolute -bottom-7 -left-7 w-28 h-28 rounded-full bg-gradient-to-r from-[#00acc1]/30 to-[#543ab7]/30 blur-xl z-0"></div>
              </div>
            </motion.div>
          </div>

          {/* Testimonial Cards - Moved below hero section */}
          <div className="relative max-w-5xl mx-auto mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            >
              {/* Testimonial Cards */}
              <TestimonialCard 
                animate={animateCards}
                delay={0}
                quote="These affirmations have completely transformed my morning routine. I feel centered and confident."
                author="Sarah L."
                icon={<Stars className="w-5 h-5 text-[#9b87f5]" />}
              />
              
              <TestimonialCard 
                animate={animateCards}
                delay={0.2}
                quote="The personalized approach is incredible. It's like the AI knows exactly what I need to hear."
                author="Michael T."
                icon={<BrainCircuit className="w-5 h-5 text-[#9b87f5]" />}
              />
              
              <TestimonialCard 
                animate={animateCards}
                delay={0.4}
                quote="I've tried many mindfulness apps, but this one connects with me on a deeper level. Truly amazing."
                author="Dana W."
                icon={<Wand2 className="w-5 h-5 text-[#9b87f5]" />}
              />
            </motion.div>
          </div>
        </div>
      </AuroraBackground>

      {/* Stats Section */}
      <div className="container-custom py-12 md:py-16 bg-gradient-to-b from-[#F7F5F3] to-[#E7F0FD]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <StatCard
            number="10k+"
            label="Active Users"
            gradient="from-[#9b87f5] to-[#543ab7]"
          />
          <StatCard
            number="87%"
            label="Reduced Stress"
            gradient="from-[#543ab7] to-[#00acc1]"
          />
          <StatCard
            number="2M+"
            label="Affirmations"
            gradient="from-[#00acc1] to-[#9b87f5]"
          />
          <StatCard
            number="4.9"
            label="Rating"
            gradient="from-[#543ab7] to-[#9b87f5]"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="container-custom py-14 md:py-20 bg-gradient-to-b from-[#E7F0FD] to-[#ACCBEE]">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#9b87f5]/10 text-[#543ab7] text-sm font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Simple Process
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 md:mb-6">
            How Hearth Works
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform creates personalized affirmations tailored to your unique emotional needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connection lines (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-[#9b87f5] to-[#543ab7] transform -translate-y-1/2" />
          
          <StepCard 
            number={1}
            title="Share How You Feel"
            description="Tell us what's on your mind or select from common emotional states"
            icon={<Heart className="w-6 h-6" />}
          />
          
          <StepCard 
            number={2}
            title="AI Creates Affirmations"
            description="Our AI generates personalized affirmations based on your emotional state"
            icon={<BrainCircuit className="w-6 h-6" />}
          />
          
          <StepCard 
            number={3}
            title="Transform Your Mindset"
            description="Listen and repeat the affirmations to rewire your thinking patterns"
            icon={<Sparkles className="w-6 h-6" />}
          />
        </div>
      </div>

      {/* Rest of the sections */}
      <Features />
      <ScientificStudies />
      <Pricing />

      {/* Featured In Section */}
      <section className="container-custom py-12 md:py-16 bg-gradient-to-b from-[#F1F0FB] to-[#F7F5F3]">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <h3 className="text-xl md:text-2xl font-semibold text-primary-foreground mb-4 md:mb-6">
            Featured In
          </h3>
          <p className="text-muted-foreground">
            Hearth has been recognized by leading publications for its innovative approach to mental wellness
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-12">
          {['Forbes', 'TechCrunch', 'Wired', 'Fast Company', 'Psychology Today'].map((name) => (
            <div key={name} className="text-lg md:text-2xl font-bold text-gray-300 hover:text-gray-500 transition-colors duration-300">
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 md:p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(155, 135, 245, 0.1) 0%, rgba(0, 172, 193, 0.1) 100%)",
            border: "1px solid rgba(155, 135, 245, 0.2)"
          }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 text-primary-foreground">
              Start Your Healing Journey Today
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8">
              Join thousands of others who have transformed their emotional wellbeing with Hearth's 
              AI-powered affirmations.
            </p>
            <Button
              asChild
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#9b87f5] to-[#543ab7] text-white font-medium hover:opacity-90 transition-colors"
            >
              <Link to={startPath}>
                Begin {user ? "Now" : "Free Trial"}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            
            {/* Decorative elements */}
            <div className="relative mt-8 md:mt-10 pt-6 md:pt-8 border-t border-[#9b87f5]/10">
              <div className="flex justify-center items-center gap-2 text-[#543ab7] font-medium">
                <Stars className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container-custom py-8 md:py-12 bg-gradient-to-b from-[#F7F5F3] to-[#E7F0FD]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10">
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 md:mb-4">Hearth</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-[#9b87f5]">About Us</a></li>
              <li><a href="#" className="hover:text-[#9b87f5]">Careers</a></li>
              <li><a href="#" className="hover:text-[#9b87f5]">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 md:mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-[#9b87f5]">Features</a></li>
              <li><a href="#" className="hover:text-[#9b87f5]">Pricing</a></li>
              <li><a href="#" className="hover:text-[#9b87f5]">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 md:mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-[#9b87f5]">Blog</a></li>
              <li><a href="#" className="hover:text-[#9b87f5]">Research</a></li>
              <li><a href="#" className="hover:text-[#9b87f5]">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 md:mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-[#9b87f5]">Twitter</a></li>
              <li><a href="#" className="hover:text-[#9b87f5]">Instagram</a></li>
              <li><a href="#" className="hover:text-[#9b87f5]">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground border-t border-[#9b87f5]/10 pt-6 md:pt-8">
          <p>&copy; {new Date().getFullYear()} Hearth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, author, icon, animate, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/80 backdrop-blur-sm p-5 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-[#9b87f5]/10"
    >
      <div className="flex items-center mb-3 md:mb-4">
        <div className="p-2 rounded-full bg-[#9b87f5]/10">
          {icon}
        </div>
      </div>
      <p className="text-gray-700 mb-3 md:mb-4 italic text-sm md:text-base">"{quote}"</p>
      <p className="text-[#543ab7] font-medium text-sm md:text-base">{author}</p>
    </motion.div>
  )
};

// Stat Card Component
const StatCard = ({ number, label, gradient }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center p-3 md:p-4"
    >
      <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1 md:mb-2`}>
        {number}
      </h3>
      <p className="text-gray-600 text-xs md:text-sm">{label}</p>
    </motion.div>
  )
};

// Step Card Component
const StepCard = ({ number, title, description, icon }) => {
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
          {icon}
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-primary-foreground">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
      </div>
    </motion.div>
  )
};

export default Index;

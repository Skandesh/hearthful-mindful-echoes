
import { useContext } from "react";
import { AuthContext } from "@/App";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { Features } from "@/components/sections/Features";
import { ScientificStudies } from "@/components/sections/ScientificStudies";
import { Pricing } from "@/components/sections/Pricing";
import { FeaturedSection } from "@/components/landing/FeaturedSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const { user } = useContext(AuthContext);

  // Determine the path for the "Get Started" button
  const startPath = user ? "/app" : "/auth";

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Hero Section */}
      <HeroSection user={user} startPath={startPath} />

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works */}
      <ProcessSection />

      {/* Features Section */}
      <Features />

      {/* Scientific Studies Section */}
      <ScientificStudies />

      {/* Pricing Section */}
      <Pricing />

      {/* Featured In Section */}
      <FeaturedSection />

      {/* CTA Section */}
      <CtaSection user={user} startPath={startPath} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;

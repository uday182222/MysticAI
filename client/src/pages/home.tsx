import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { Footer } from "@/components/footer";
import { CelestialBackground } from "@/components/celestial-background";
import { MagicalOrb } from "@/components/magical-orb";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Celestial Background */}
      <CelestialBackground />
      
      {/* Magical Orb */}
      <MagicalOrb />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <Footer />
      </div>
    </div>
  );
}
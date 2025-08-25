import { Button } from "@/components/ui/button";
import { Camera, Info } from "lucide-react";

interface HeroSectionProps {
  onStartReading: () => void;
}

export function HeroSection({ onStartReading }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Discover what the Stars say <br />
            <span className="text-accent">with Ai Precision</span>
          </h2>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Explore palmistry, astrology, and Vastu analysis powered by advanced AI to unlock mystical insights about your personality, relationships, and destiny.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onStartReading}
              size="lg" 
              className="bg-accent hover:bg-blue-600 text-white px-8 py-4 text-lg shadow-lg"
              data-testid="button-start-reading"
            >
              <Camera className="mr-2 h-5 w-5" />
              Start Analysis
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-300 hover:border-slate-400 text-secondary hover:text-primary px-8 py-4 text-lg"
              data-testid="button-learn-more"
            >
              <Info className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

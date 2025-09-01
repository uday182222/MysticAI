import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Stars, Zap } from "lucide-react";

interface CosmicLoaderProps {
  analysisType?: 'palm' | 'astrology' | 'vastu' | 'numerology' | 'tarot';
  message?: string;
  isVisible?: boolean;
}

const analysisMessages = {
  palm: [
    "Reading the lines of destiny...",
    "Interpreting the ancient palm wisdom...",
    "Unveiling your life's journey...",
    "Discovering your inner strengths..."
  ],
  astrology: [
    "Aligning with celestial energies...",
    "Mapping your cosmic blueprint...",
    "Reading the stars' ancient messages...",
    "Channeling planetary influences..."
  ],
  vastu: [
    "Analyzing energy flow patterns...",
    "Harmonizing spatial vibrations...",
    "Balancing elemental forces...",
    "Optimizing cosmic alignment..."
  ],
  numerology: [
    "Calculating mystical number patterns...",
    "Decoding numerical vibrations...",
    "Unlocking hidden frequencies...",
    "Revealing sacred geometries..."
  ],
  tarot: [
    "Shuffling the cosmic deck...",
    "Drawing from universal wisdom...",
    "Connecting with ancient archetypes...",
    "Channeling mystical insights..."
  ]
};

export function CosmicLoader({ analysisType = 'palm', message, isVisible = true }: CosmicLoaderProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number}>>([]);

  const messages = message ? [message] : analysisMessages[analysisType];

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3
    }));
    setParticles(newParticles);

    // Cycle through messages
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % messages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [analysisType, messages.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-500 shadow-2xl">
        <CardContent className="p-12 text-center relative">
          {/* Animated background stars */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`
                }}
              />
            ))}
            
            {/* Larger floating stars */}
            <div className="absolute top-6 left-8 animate-float">
              <Stars className="h-4 w-4 text-yellow-300 opacity-70" />
            </div>
            <div className="absolute top-12 right-12 animate-float-delayed">
              <Sparkles className="h-3 w-3 text-blue-300 opacity-60" />
            </div>
            <div className="absolute bottom-8 left-16 animate-float">
              <Zap className="h-3 w-3 text-purple-300 opacity-50" />
            </div>
            <div className="absolute bottom-16 right-8 animate-float-delayed">
              <Stars className="h-5 w-5 text-indigo-300 opacity-80" />
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10">
            {/* Central cosmic animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto relative">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-purple-400 rounded-full animate-spin-slow opacity-60"></div>
                
                {/* Middle ring */}
                <div className="absolute inset-2 border-2 border-blue-400 rounded-full animate-spin-reverse opacity-80"></div>
                
                {/* Inner glow */}
                <div className="absolute inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
                
                {/* Central star */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white animate-pulse" />
                </div>
              </div>

              {/* Orbital particles */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
              </div>
              <div className="absolute inset-0 animate-spin-reverse">
                <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-blue-400 rounded-full transform translate-x-1/2 animate-pulse"></div>
              </div>
            </div>

            {/* Loading message */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white mb-2">
                Cosmic Analysis in Progress
              </h3>
              
              <div className="h-6 flex items-center justify-center">
                <p 
                  key={currentMessage}
                  className="text-purple-200 animate-fade-in text-lg"
                  data-testid="text-loading-message"
                >
                  {messages[currentMessage]}
                </p>
              </div>

              {/* Loading dots */}
              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>

          {/* Shooting star effect */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="shooting-star"></div>
            <div className="shooting-star" style={{animationDelay: '3s'}}></div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
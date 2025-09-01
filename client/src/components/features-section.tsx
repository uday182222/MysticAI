import { Hand, Stars, Home, Calculator, Zap } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Hand,
      title: "Palmistry Divination",
      description: "Ancient wisdom meets cosmic AI to reveal the secrets written in your palms - personality, destiny, and life's sacred journey.",
      rune: "ᚱ",
      gradient: "from-purple-400 to-violet-600",
    },
    {
      icon: Stars,
      title: "Celestial Astrology", 
      description: "Navigate the cosmic tapestry through your birth chart, unlocking stellar insights about love, purpose, and divine timing.",
      rune: "ᚨ",
      gradient: "from-indigo-400 to-purple-600",
    },
    {
      icon: Home,
      title: "Sacred Vastu Wisdom",
      description: "Harmonize your living spaces with ancient Vastu principles, channeling prosperity and positive energy through divine alignment.",
      rune: "ᚢ",
      gradient: "from-violet-400 to-indigo-600",
    },
    {
      icon: Calculator,
      title: "Numerology Mysteries",
      description: "Decode the mystical language of numbers that shape your reality, revealing hidden patterns in your life's cosmic design.",
      rune: "ᚾ",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: Zap,
      title: "Tarot Revelations",
      description: "Unveil the archetypal forces guiding your path through ancient tarot wisdom, illuminating past, present, and future mysteries.",
      rune: "ᚦ",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground">
            Five Sacred Arts of
            <span className="text-gradient"> Divination</span>
          </h3>
          
          <p className="text-lg text-secondary-foreground max-w-3xl mx-auto leading-relaxed">
            Explore ancient wisdom enhanced by AI intelligence. Each mystical art offers unique insights 
            into your personality, destiny, and life's deepest mysteries.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="clean-card p-6 text-center group"
            >
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">{feature.rune}</span>
                </div>
              </div>
              
              <h4 className="text-xl font-heading font-semibold mb-4 text-foreground group-hover:text-accent transition-colors duration-300">
                {feature.title}
              </h4>
              
              <p className="text-secondary-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

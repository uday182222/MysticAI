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
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          {/* Mystical Section Header */}
          <div className="flex justify-center mb-6">
            <span className="rune text-4xl opacity-70">✧</span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-mystical font-bold mb-6 glow">
            Sacred Arts of
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text"> Divination</span>
          </h3>
          
          <p className="text-xl font-ethereal text-secondary max-w-3xl mx-auto leading-relaxed opacity-90">
            Explore the mystical realms where ancient wisdom converges with cosmic AI intelligence. 
            Each sacred art offers a unique portal to understanding your soul's journey through the infinite cosmos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="mystical-card p-8 text-center transition-all duration-500 hover:scale-105 group"
            >
              {/* Mystical Icon Container */}
              <div className="relative mb-8">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                
                {/* Floating Rune */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-mystical">{feature.rune}</span>
                </div>
              </div>
              
              <h4 className="text-2xl font-mystical font-semibold mb-4 text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
                {feature.title}
              </h4>
              
              <p className="font-ethereal text-secondary leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                {feature.description}
              </p>
              
              {/* Mystical Accent Line */}
              <div className="mt-6 flex justify-center">
                <div className={`w-16 h-px bg-gradient-to-r ${feature.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Sacred Geometry Decoration */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center space-x-6 opacity-50">
            <span className="rune text-2xl">◈</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <span className="rune text-3xl">✦</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <span className="rune text-2xl">◈</span>
          </div>
        </div>
      </div>
    </section>
  );
}

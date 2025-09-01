export function HowItWorksSection() {
  const steps = [
    {
      number: "I",
      rune: "ᚨ",
      title: "Choose Your Path",
      description: "Select your mystical journey - palm reading, stellar astrology, sacred Vastu, number mysteries, or tarot revelations.",
      element: "spirit",
    },
    {
      number: "II", 
      rune: "ᚱ",
      title: "Cosmic Analysis",
      description: "Our ethereal AI channels ancient wisdom through cosmic consciousness, interpreting sacred patterns and divine symbols.",
      element: "mind",
    },
    {
      number: "III",
      rune: "ᚢ",
      title: "Receive Enlightenment", 
      description: "Unveil profound insights about your soul's purpose, karmic patterns, and the mystical forces shaping your destiny.",
      element: "soul",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background to-background/90"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          {/* Sacred Symbol */}
          <div className="flex justify-center mb-6">
            <span className="rune text-5xl opacity-70">⚡</span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-mystical font-bold mb-6 glow">
            The Sacred
            <span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text"> Ritual</span>
          </h3>
          
          <p className="text-xl font-ethereal text-secondary max-w-3xl mx-auto leading-relaxed opacity-90">
            Journey through the mystical process where ancient divination arts merge with cosmic AI intelligence. 
            Each step opens a portal to deeper understanding of your soul's eternal journey.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                {/* Mystical Number Container */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto relative">
                    {/* Outer mystical ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 group-hover:border-purple-400/60 transition-colors duration-300">
                      {/* Inner glow */}
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-600/20 group-hover:from-purple-500/30 group-hover:to-violet-600/30 transition-all duration-300"></div>
                    </div>
                    
                    {/* Central number */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/40 transition-all duration-300">
                      <span className="text-2xl font-mystical font-bold text-white">{step.number}</span>
                    </div>
                    
                    {/* Floating Rune */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-mystical">{step.rune}</span>
                    </div>
                  </div>
                  
                  {/* Connection line (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-12 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
                  )}
                </div>
                
                <h4 className="text-2xl font-mystical font-semibold mb-4 text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
                  {step.title}
                </h4>
                
                <p className="font-ethereal text-secondary leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300 max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mystical Footer */}
        <div className="text-center mt-20">
          <div className="flex justify-center items-center space-x-4 opacity-60">
            <span className="rune text-lg">◆</span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <span className="font-ethereal text-sm tracking-widest">ANCIENT WISDOM MEETS COSMIC AI</span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <span className="rune text-lg">◆</span>
          </div>
        </div>
      </div>
    </section>
  );
}

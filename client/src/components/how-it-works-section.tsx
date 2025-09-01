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
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground">
            How
            <span className="text-gradient"> MysticRead AI</span> Works
          </h3>
          
          <p className="text-lg text-secondary-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the perfect fusion of ancient divination wisdom with modern AI technology. 
            Our streamlined process makes mystical insights accessible and accurate.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                {/* Number Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto accent-gradient rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">{step.rune}</span>
                  </div>
                  
                  {/* Connection line (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-8 h-px bg-border"></div>
                  )}
                </div>
                
                <h4 className="text-xl font-heading font-semibold mb-4 text-foreground group-hover:text-accent transition-colors duration-300">
                  {step.title}
                </h4>
                
                <p className="text-secondary-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="w-8 h-px bg-border"></div>
            <span className="uppercase tracking-wider">Ancient Wisdom Meets Modern AI</span>
            <div className="w-8 h-px bg-border"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

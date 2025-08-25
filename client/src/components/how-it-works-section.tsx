export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Choose Analysis",
      description: "Select from palmistry (upload palm photos), astrology (enter birth details), or Vastu analysis (describe your space).",
    },
    {
      number: "2",
      title: "AI Analysis",
      description: "Our GPT-5 model analyzes your data using ancient wisdom combined with advanced artificial intelligence.",
    },
    {
      number: "3",
      title: "Get Insights",
      description: "Receive comprehensive mystical insights about your personality, relationships, career, health, and future prospects.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-primary mb-4">How MysticRead AI Works</h3>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Our advanced AI technology combines ancient mystical wisdom with modern artificial intelligence
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {step.number}
                </div>
                <h4 className="text-xl font-semibold text-primary mb-4">{step.title}</h4>
                <p className="text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

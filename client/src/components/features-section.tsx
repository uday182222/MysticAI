import { Brain, Smartphone, TrendingUp } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Utilizing GPT-4 Vision model to accurately identify and interpret palm lines, mounts, and patterns with unprecedented precision.",
      bgColor: "bg-blue-100",
      iconColor: "text-accent",
    },
    {
      icon: Smartphone,
      title: "Mobile Camera Support", 
      description: "Take photos directly with your device camera or upload existing images for instant analysis anywhere, anytime.",
      bgColor: "bg-green-100",
      iconColor: "text-success",
    },
    {
      icon: TrendingUp,
      title: "Comprehensive Readings",
      description: "Get detailed insights about personality traits, life path, relationships, health, and career prospects from your palm analysis.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-primary mb-4">Advanced Ai Assisted Analysis</h3>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Our cutting-edge AI technology provides detailed mystical insights through palmistry, astrology, and Vastu analysis.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>
              <h4 className="text-xl font-semibold text-primary mb-4">{feature.title}</h4>
              <p className="text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

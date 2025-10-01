import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Heart, Briefcase, Leaf, Sparkles, Star, Trophy, Activity, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  gradient: string;
  content: {
    items: Array<{
      label: string;
      value: string | string[];
      testId?: string;
    }>;
    footer?: {
      label: string;
      value: string;
      icon: React.ReactNode;
      testId?: string;
    };
  };
}

interface InsightAccordionProps {
  sections: InsightSection[];
}

function AccordionItem({ section, isOpen, onToggle }: { 
  section: InsightSection; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  // Extract color for icon/title from gradient
  const getAccentColor = (gradient: string) => {
    if (gradient.includes('rose')) return 'text-rose-500';
    if (gradient.includes('amber')) return 'text-amber-500';
    if (gradient.includes('emerald')) return 'text-emerald-500';
    if (gradient.includes('indigo')) return 'text-indigo-500';
    return 'text-violet-500';
  };

  const getGradientBorder = (gradient: string) => {
    if (gradient.includes('rose')) return 'from-rose-400 via-pink-400 to-rose-300';
    if (gradient.includes('amber')) return 'from-amber-400 via-yellow-400 to-amber-300';
    if (gradient.includes('emerald')) return 'from-emerald-400 via-teal-400 to-emerald-300';
    if (gradient.includes('indigo')) return 'from-indigo-400 via-purple-400 to-indigo-300';
    return 'from-violet-400 via-purple-400 to-violet-300';
  };

  const accentColor = getAccentColor(section.gradient);
  const gradientBorder = getGradientBorder(section.gradient);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn(
        "border-0 shadow-sm overflow-hidden transition-all duration-300 bg-white/80 backdrop-blur",
        isOpen ? "shadow-lg" : "hover:shadow-md",
        "relative"
      )}>
        {/* Gradient top border */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
          gradientBorder
        )} />
        
        <button
          onClick={onToggle}
          className={cn(
            "w-full p-6 pt-7 flex items-center justify-between text-left transition-all duration-200",
            "hover:bg-gray-50/50"
          )}
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br",
                section.gradient.includes('rose') && "from-rose-50 to-pink-50",
                section.gradient.includes('amber') && "from-amber-50 to-yellow-50",
                section.gradient.includes('emerald') && "from-emerald-50 to-teal-50",
                section.gradient.includes('indigo') && "from-indigo-50 to-purple-50",
                "shadow-sm"
              )}
            >
              <div className={accentColor}>
                {section.icon}
              </div>
            </motion.div>
            <div>
              <h3 className={cn("text-xl font-bold", accentColor)}>
                {section.title}
              </h3>
              <p className="text-sm text-gray-500">
                {isOpen ? "Click to collapse" : "Click to expand"}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className={cn("w-6 h-6", accentColor)} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-6 pt-4 bg-gradient-to-b from-white to-gray-50/30 space-y-6">
                {section.content.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {item.label}
                    </h4>
                    {Array.isArray(item.value) ? (
                      <ul className="space-y-2">
                        {item.value.map((v, i) => (
                          <li 
                            key={i} 
                            className="text-gray-700 flex items-start gap-2"
                            data-testid={item.testId ? `${item.testId}-${i}` : undefined}
                          >
                            <span className={cn("mt-1 font-bold", getAccentColor(section.gradient))}>•</span>
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p 
                        className="text-gray-700 leading-relaxed"
                        data-testid={item.testId}
                      >
                        {item.value}
                      </p>
                    )}
                  </motion.div>
                ))}

                {section.content.footer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex items-center gap-3 pt-4 border-t border-gray-200"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      "bg-gradient-to-br",
                      section.gradient.includes('rose') && "from-rose-100 to-pink-100",
                      section.gradient.includes('amber') && "from-amber-100 to-yellow-100",
                      section.gradient.includes('emerald') && "from-emerald-100 to-teal-100",
                      section.gradient.includes('indigo') && "from-indigo-100 to-purple-100"
                    )}>
                      <div className={getAccentColor(section.gradient)}>
                        {section.content.footer.icon}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{section.content.footer.label}</div>
                      <div 
                        className={cn("text-sm font-semibold", getAccentColor(section.gradient))}
                        data-testid={section.content.footer.testId}
                      >
                        {section.content.footer.value}
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export function InsightAccordion({ sections }: InsightAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(sections[0]?.id || null);

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
        >
          <AccordionItem
            section={section}
            isOpen={openSection === section.id}
            onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Export helper function to create section data
export function createInsightSections(result: any) {
  return [
    {
      id: "love",
      title: "Love & Relationships",
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      gradient: "bg-gradient-to-r from-rose-500 to-pink-500",
      content: {
        items: [
          {
            label: "Heart Line Analysis",
            value: result.loveAndRelationships?.heartLineAnalysis || "Not available",
            testId: "text-heart-line-analysis",
          },
          {
            label: "Compatibility Insights",
            value: result.loveAndRelationships?.compatibilityInsights || "Not available",
            testId: "text-compatibility-insights",
          },
        ],
        footer: {
          label: "Relationship Strength",
          value: result.loveAndRelationships?.relationshipStrength || "Not analyzed",
          icon: <Star className="w-4 h-4 text-white" />,
          testId: "text-relationship-strength",
        },
      },
    },
    {
      id: "career",
      title: "Career & Success",
      icon: <Briefcase className="w-6 h-6 text-amber-500" />,
      gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
      content: {
        items: [
          {
            label: "Professional Strengths",
            value: result.careerAndSuccess?.professionalStrengths || "Not available",
            testId: "text-professional-strengths",
          },
          {
            label: "Recommended Career Paths",
            value: result.careerAndSuccess?.recommendedPaths || [],
            testId: "text-career-path",
          },
        ],
        footer: {
          label: "Success Potential",
          value: result.careerAndSuccess?.successPotential || "Not analyzed",
          icon: <Trophy className="w-4 h-4 text-white" />,
          testId: "text-success-potential",
        },
      },
    },
    {
      id: "health",
      title: "Health & Wellness",
      icon: <Leaf className="w-6 h-6 text-emerald-500" />,
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
      content: {
        items: [
          {
            label: "Life Line Insights",
            value: result.healthAndWellness?.lifeLineInsights || "Not available",
            testId: "text-life-line-insights",
          },
          {
            label: "Wellness Recommendations",
            value: result.healthAndWellness?.wellnessRecommendations || [],
            testId: "text-wellness-recommendation",
          },
        ],
        footer: {
          label: "Vitality Level",
          value: result.healthAndWellness?.vitalityLevel || "Not analyzed",
          icon: <Activity className="w-4 h-4 text-white" />,
          testId: "text-vitality-level",
        },
      },
    },
    {
      id: "future",
      title: "Future Insights",
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
      content: {
        items: [
          {
            label: "Near Future (1-3 Years)",
            value: result.futureInsights?.nearFuture || "Not available",
            testId: "text-near-future",
          },
          {
            label: "Life Path Direction",
            value: result.futureInsights?.lifePathDirection || "Not available",
            testId: "text-life-path-direction",
          },
        ],
        footer: {
          label: "Path Clarity",
          value: result.futureInsights?.pathClarity || "Not analyzed",
          icon: <Compass className="w-4 h-4 text-white" />,
          testId: "text-path-clarity",
        },
      },
    },
  ];
}


import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PalmAnalysisResult } from "@shared/schema";
import { Download, Share2, RotateCcw, Sparkles } from "lucide-react";
import { SummaryCard } from "./palm-results/SummaryCard";
import { PersonalityRadar } from "./palm-results/PersonalityRadar";
import { InsightAccordion, createInsightSections } from "./palm-results/InsightAccordion";
import { LifeCompass } from "./palm-results/LifeCompass";
import { ChatBox } from "./palm-results/ChatBox";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/pdf-generator";
import { useState, useRef } from "react";

interface PalmAnalysisResultsModernProps {
  result: PalmAnalysisResult;
  imageUrl: string;
  onAnalyzeAnother: () => void;
  analysisId?: string;
  isAuthenticated?: boolean;
  onLoginRequired?: () => void;
}

export function PalmAnalysisResultsModern({
  result,
  imageUrl,
  onAnalyzeAnother,
  analysisId,
  isAuthenticated = false,
  onLoginRequired,
}: PalmAnalysisResultsModernProps) {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  // Create sections for accordion
  const sections = createInsightSections(result);

  // Calculate compass scores
  const compassScores = {
    love: result.emotionalBalancePercentage || 75,
    career: result.careerPotentialPercentage || 80,
    health: result.lifeEnergyPercentage || 78,
    future: Math.round((result.futureInsights?.pathClarity === "High" ? 85 : 70)),
  };

  const handleQuadrantClick = (quadrantId: string) => {
    // Scroll to the corresponding section
    const sectionElement = document.getElementById(`section-${quadrantId}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const reportElement = document.getElementById("palm-report-content");
      if (!reportElement) {
        throw new Error("Report content not found");
      }

      const filename = `MysticRead_Palm_Reading_${new Date().toISOString().split('T')[0]}_${Date.now()}.pdf`;
      await generatePDF(reportElement.id, {
        filename,
        quality: 0.95,
        format: 'a4',
        orientation: 'portrait'
      });

      toast({
        title: "Report Downloaded!",
        description: "Your palm reading report has been saved as PDF.",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = async () => {
    const shareText = `I just got my AI palm reading! ✨\n\n` +
      `Life Energy: ${result.lifeEnergyPercentage}%\n` +
      `Emotional Balance: ${result.emotionalBalancePercentage}%\n` +
      `Career Potential: ${result.careerPotentialPercentage}%\n\n` +
      `Check out MysticRead AI for your own mystical insights!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Palm Reading Results",
          text: shareText,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied!",
          description: "Results copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Failed to copy",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/30 to-blue-50/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Actions */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
          >
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Your Palm Reading Report
              </h1>
              <p className="text-gray-600">AI-powered mystical insights into your destiny</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
              >
                {isGeneratingPDF ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-violet-300 text-violet-700 hover:bg-violet-50"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                onClick={onAnalyzeAnother}
                variant="ghost"
                className="text-violet-700 hover:bg-violet-100"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                New Reading
              </Button>
            </div>
          </motion.div>

          {/* Report Content */}
          <div id="palm-report-content" className="space-y-8">
            {/* Summary Card */}
            <SummaryCard
              imageUrl={imageUrl}
              personalityOverview={result.personalityOverview || ""}
              traits={result.traits || []}
              lifeEnergy={result.lifeEnergyPercentage || 0}
              emotionalBalance={result.emotionalBalancePercentage || 0}
              careerPotential={result.careerPotentialPercentage || 0}
            />

            {/* Personality Radar */}
            {result.traits && result.traits.length > 0 && (
              <PersonalityRadar traits={result.traits} />
            )}

            {/* Life Compass */}
            <div ref={compassRef}>
              <LifeCompass scores={compassScores} onQuadrantClick={handleQuadrantClick} />
            </div>

            {/* Insight Sections */}
            <div id="section-love">
              <InsightAccordion sections={sections} />
            </div>

            {/* AI Chat Box */}
            {analysisId && (
              <ChatBox
                analysisId={analysisId}
                analysisType="palm"
                analysisData={result}
                isAuthenticated={isAuthenticated}
                onLoginRequired={onLoginRequired}
              />
            )}
          </div>

          {/* Footer Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/50 backdrop-blur shadow-lg">
              <Sparkles className="w-5 h-5 text-violet-600" />
              <p className="text-sm text-gray-700 italic">
                "The future belongs to those who believe in the beauty of their dreams"
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { PalmAnalysisInterface } from "@/components/palm-analysis-interface";
import { AnalysisResults } from "@/components/analysis-results";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { Footer } from "@/components/footer";
import { AnalysisResult } from "@shared/schema";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisImageUrl, setAnalysisImageUrl] = useState<string | null>(null);

  const handleStartReading = () => {
    const uploadSection = document.getElementById("upload-section");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAnalysisComplete = (result: AnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    setAnalysisImageUrl(imageUrl);
    
    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById("results-section");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleAnalyzeAnother = () => {
    setAnalysisResult(null);
    setAnalysisImageUrl(null);
    
    // Scroll back to upload section
    setTimeout(() => {
      const uploadSection = document.getElementById("upload-section");
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection onStartReading={handleStartReading} />
      <FeaturesSection />
      <PalmAnalysisInterface onAnalysisComplete={handleAnalysisComplete} />
      {analysisResult && analysisImageUrl && (
        <AnalysisResults 
          result={analysisResult}
          imageUrl={analysisImageUrl}
          onAnalyzeAnother={handleAnalyzeAnother}
        />
      )}
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

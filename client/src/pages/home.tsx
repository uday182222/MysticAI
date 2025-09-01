import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { PalmAnalysisInterface } from "@/components/palm-analysis-interface";
import { AstrologyAnalysisInterface } from "@/components/astrology-analysis-interface";
import { VastuAnalysisInterface } from "@/components/vastu-analysis-interface";
import { NumerologyAnalysisInterface } from "@/components/numerology-analysis-interface";
import { TarotAnalysisInterface } from "@/components/tarot-analysis-interface";
import { AnalysisResults } from "@/components/analysis-results";
import { AstrologyResults } from "@/components/astrology-results";
import { VastuResults } from "@/components/vastu-results";
import { NumerologyResults } from "@/components/numerology-results";
import { TarotResults } from "@/components/tarot-results";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hand, Stars, Home as HomeIcon, Calculator, Zap } from "lucide-react";
import { PalmAnalysisResult, AstrologyAnalysisResult, AstrologyInput, VastuAnalysisResult, VastuInput, NumerologyAnalysisResult, NumerologyInput, TarotAnalysisResult, TarotInput } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState("palm");
  
  // Palm analysis state
  const [palmAnalysisResult, setPalmAnalysisResult] = useState<PalmAnalysisResult | null>(null);
  const [palmImageUrl, setPalmImageUrl] = useState<string | null>(null);
  
  // Astrology analysis state
  const [astrologyAnalysisResult, setAstrologyAnalysisResult] = useState<AstrologyAnalysisResult | null>(null);
  const [astrologyInputData, setAstrologyInputData] = useState<AstrologyInput | null>(null);
  
  // Vastu analysis state
  const [vastuAnalysisResult, setVastuAnalysisResult] = useState<VastuAnalysisResult | null>(null);
  const [vastuInputData, setVastuInputData] = useState<VastuInput | null>(null);
  const [vastuImageUrl, setVastuImageUrl] = useState<string | null>(null);

  // Numerology analysis state
  const [numerologyAnalysisResult, setNumerologyAnalysisResult] = useState<NumerologyAnalysisResult | null>(null);
  const [numerologyInputData, setNumerologyInputData] = useState<NumerologyInput | null>(null);

  // Tarot analysis state
  const [tarotAnalysisResult, setTarotAnalysisResult] = useState<TarotAnalysisResult | null>(null);
  const [tarotInputData, setTarotInputData] = useState<TarotInput | null>(null);

  const handleStartReading = () => {
    const analysisSection = document.getElementById("analysis-section");
    if (analysisSection) {
      analysisSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Palm analysis handlers
  const handlePalmAnalysisComplete = (result: PalmAnalysisResult, imageUrl: string) => {
    setPalmAnalysisResult(result);
    setPalmImageUrl(imageUrl);
    scrollToResults();
  };

  const handlePalmAnalyzeAnother = () => {
    setPalmAnalysisResult(null);
    setPalmImageUrl(null);
    scrollToAnalysis();
  };

  // Astrology analysis handlers
  const handleAstrologyAnalysisComplete = (result: AstrologyAnalysisResult, inputData: AstrologyInput) => {
    setAstrologyAnalysisResult(result);
    setAstrologyInputData(inputData);
    scrollToResults();
  };

  const handleAstrologyAnalyzeAnother = () => {
    setAstrologyAnalysisResult(null);
    setAstrologyInputData(null);
    scrollToAnalysis();
  };

  // Vastu analysis handlers
  const handleVastuAnalysisComplete = (result: VastuAnalysisResult, inputData: VastuInput, imageUrl?: string) => {
    setVastuAnalysisResult(result);
    setVastuInputData(inputData);
    setVastuImageUrl(imageUrl || null);
    scrollToResults();
  };

  const handleVastuAnalyzeAnother = () => {
    setVastuAnalysisResult(null);
    setVastuInputData(null);
    setVastuImageUrl(null);
    scrollToAnalysis();
  };

  // Numerology analysis handlers
  const handleNumerologyAnalysisComplete = (result: NumerologyAnalysisResult, inputData: NumerologyInput) => {
    setNumerologyAnalysisResult(result);
    setNumerologyInputData(inputData);
    scrollToResults();
  };

  const handleNumerologyAnalyzeAnother = () => {
    setNumerologyAnalysisResult(null);
    setNumerologyInputData(null);
    scrollToAnalysis();
  };

  // Tarot analysis handlers
  const handleTarotAnalysisComplete = (result: TarotAnalysisResult, inputData: TarotInput) => {
    setTarotAnalysisResult(result);
    setTarotInputData(inputData);
    scrollToResults();
  };

  const handleTarotAnalyzeAnother = () => {
    setTarotAnalysisResult(null);
    setTarotInputData(null);
    scrollToAnalysis();
  };

  const scrollToResults = () => {
    setTimeout(() => {
      const resultsSection = document.getElementById("results-section");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const scrollToAnalysis = () => {
    setTimeout(() => {
      const analysisSection = document.getElementById("analysis-section");
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const hasAnyResults = palmAnalysisResult || astrologyAnalysisResult || vastuAnalysisResult || numerologyAnalysisResult || tarotAnalysisResult;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection onStartReading={handleStartReading} />
      
      {/* Analysis Section */}
      <section id="analysis-section" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-primary mb-4">Choose Your Analysis Type</h3>
              <p className="text-lg text-secondary">
                Select from palmistry, astrology, Vastu, numerology, or tarot reading for personalized insights
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="palm" className="flex items-center gap-2" data-testid="tab-palm">
                  <Hand className="h-4 w-4" />
                  Palmistry
                </TabsTrigger>
                <TabsTrigger value="astrology" className="flex items-center gap-2" data-testid="tab-astrology">
                  <Stars className="h-4 w-4" />
                  Astrology
                </TabsTrigger>
                <TabsTrigger value="vastu" className="flex items-center gap-2" data-testid="tab-vastu">
                  <HomeIcon className="h-4 w-4" />
                  Vastu
                </TabsTrigger>
                <TabsTrigger value="numerology" className="flex items-center gap-2" data-testid="tab-numerology">
                  <Calculator className="h-4 w-4" />
                  Numerology
                </TabsTrigger>
                <TabsTrigger value="tarot" className="flex items-center gap-2" data-testid="tab-tarot">
                  <Zap className="h-4 w-4" />
                  Tarot
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="palm" className="mt-6">
                <PalmAnalysisInterface onAnalysisComplete={handlePalmAnalysisComplete} />
              </TabsContent>
              
              <TabsContent value="astrology" className="mt-6">
                <AstrologyAnalysisInterface onAnalysisComplete={handleAstrologyAnalysisComplete} />
              </TabsContent>
              
              <TabsContent value="vastu" className="mt-6">
                <VastuAnalysisInterface onAnalysisComplete={handleVastuAnalysisComplete} />
              </TabsContent>
              
              <TabsContent value="numerology" className="mt-6">
                <NumerologyAnalysisInterface onAnalysisComplete={handleNumerologyAnalysisComplete} />
              </TabsContent>
              
              <TabsContent value="tarot" className="mt-6">
                <TarotAnalysisInterface onAnalysisComplete={handleTarotAnalysisComplete} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      <FeaturesSection />
      
      {/* Results Section */}
      {hasAnyResults && (
        <div id="results-section">
          {palmAnalysisResult && palmImageUrl && (
            <AnalysisResults 
              result={palmAnalysisResult}
              imageUrl={palmImageUrl}
              onAnalyzeAnother={handlePalmAnalyzeAnother}
            />
          )}
          {astrologyAnalysisResult && astrologyInputData && (
            <AstrologyResults 
              result={astrologyAnalysisResult}
              inputData={astrologyInputData}
              onAnalyzeAnother={handleAstrologyAnalyzeAnother}
            />
          )}
          {vastuAnalysisResult && vastuInputData && (
            <VastuResults 
              result={vastuAnalysisResult}
              inputData={vastuInputData}
              imageUrl={vastuImageUrl || undefined}
              onAnalyzeAnother={handleVastuAnalyzeAnother}
            />
          )}
          
          {numerologyAnalysisResult && numerologyInputData && (
            <NumerologyResults 
              result={numerologyAnalysisResult} 
              inputData={numerologyInputData}
              onAnalyzeAnother={handleNumerologyAnalyzeAnother}
            />
          )}
          
          {tarotAnalysisResult && tarotInputData && (
            <TarotResults 
              result={tarotAnalysisResult} 
              inputData={tarotInputData}
              onAnalyzeAnother={handleTarotAnalyzeAnother}
            />
          )}
        </div>
      )}
      
      <HowItWorksSection />
      
      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-primary mb-6">About MysticRead AI</h3>
            <div className="space-y-6 text-lg text-secondary">
              <p>
                MysticRead AI is a comprehensive mystical analysis platform that combines ancient wisdom with cutting-edge artificial intelligence. Our web application offers three powerful analysis types: palmistry reading through photo analysis, detailed astrology chart interpretations, and Vastu Shastra guidance for optimal living and working spaces.
              </p>
              <p>
                Using OpenAI's latest GPT-5 model, we provide accurate and personalized insights about your personality, relationships, career prospects, health, and future possibilities. Whether you're seeking guidance through palm reading, astrological charts, or Vastu principles, our AI delivers comprehensive analyses rooted in traditional mystical knowledge.
              </p>
              <p className="font-semibold text-primary">
                MysticRead AI is a project proudly developed by <span className="text-accent">Team Motion Falcon</span>, 
                bringing together expertise in artificial intelligence, traditional mystical arts, and modern web development 
                to create an accessible platform for personal insight and guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

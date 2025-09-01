import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/auth-context";
import { Hand, Stars, Home as HomeIcon, Calculator, Zap, User, Sparkles } from "lucide-react";
import { PalmAnalysisResult, AstrologyAnalysisResult, AstrologyInput, VastuAnalysisResult, VastuInput, NumerologyAnalysisResult, NumerologyInput, TarotAnalysisResult, TarotInput } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("palm");
  
  const isAuthenticated = !!user;
  
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

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

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
    const analysisSection = document.getElementById("analysis-section");
    if (analysisSection) {
      analysisSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Check if any results exist
  const hasAnyResults = palmAnalysisResult || astrologyAnalysisResult || vastuAnalysisResult || numerologyAnalysisResult || tarotAnalysisResult;

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Dashboard Header */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-xl text-secondary mb-6">
              Your personal mystical insights dashboard. Choose an analysis type to begin your journey of discovery.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-secondary">All analysis types available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section id="analysis-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Choose Your Analysis</h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Select from our comprehensive range of mystical analysis tools. Each provides unique insights into different aspects of your life.
              </p>
            </div>

            {/* Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 gap-2 h-auto p-2 bg-gray-50 rounded-xl mb-8">
                <TabsTrigger 
                  value="palm" 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid="tab-palm"
                >
                  <Hand className="h-6 w-6" />
                  <span className="text-sm font-medium">Palm Reading</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="astrology" 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid="tab-astrology"
                >
                  <Stars className="h-6 w-6" />
                  <span className="text-sm font-medium">Astrology</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="vastu" 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid="tab-vastu"
                >
                  <HomeIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">Vastu</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="numerology" 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid="tab-numerology"
                >
                  <Calculator className="h-6 w-6" />
                  <span className="text-sm font-medium">Numerology</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="tarot" 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid="tab-tarot"
                >
                  <Zap className="h-6 w-6" />
                  <span className="text-sm font-medium">Tarot</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <TabsContent value="palm" className="mt-0">
                  <PalmAnalysisInterface onAnalysisComplete={handlePalmAnalysisComplete} />
                </TabsContent>
                
                <TabsContent value="astrology" className="mt-0">
                  <AstrologyAnalysisInterface onAnalysisComplete={handleAstrologyAnalysisComplete} />
                </TabsContent>
                
                <TabsContent value="vastu" className="mt-0">
                  <VastuAnalysisInterface onAnalysisComplete={handleVastuAnalysisComplete} />
                </TabsContent>
                
                <TabsContent value="numerology" className="mt-0">
                  <NumerologyAnalysisInterface onAnalysisComplete={handleNumerologyAnalysisComplete} />
                </TabsContent>
                
                <TabsContent value="tarot" className="mt-0">
                  <TarotAnalysisInterface onAnalysisComplete={handleTarotAnalysisComplete} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasAnyResults && (
        <div id="results-section">
          {palmAnalysisResult && palmImageUrl && (
            <AnalysisResults 
              result={palmAnalysisResult}
              imageUrl={palmImageUrl}
              onAnalyzeAnother={handlePalmAnalyzeAnother}
              isAuthenticated={isAuthenticated}
            />
          )}
          {astrologyAnalysisResult && astrologyInputData && (
            <AstrologyResults 
              result={astrologyAnalysisResult}
              inputData={astrologyInputData}
              onAnalyzeAnother={handleAstrologyAnalyzeAnother}
              isAuthenticated={isAuthenticated}
            />
          )}
          {vastuAnalysisResult && vastuInputData && (
            <VastuResults 
              result={vastuAnalysisResult}
              inputData={vastuInputData}
              imageUrl={vastuImageUrl || undefined}
              onAnalyzeAnother={handleVastuAnalyzeAnother}
              isAuthenticated={isAuthenticated}
            />
          )}
          
          {numerologyAnalysisResult && numerologyInputData && (
            <NumerologyResults 
              result={numerologyAnalysisResult} 
              inputData={numerologyInputData}
              onAnalyzeAnother={handleNumerologyAnalyzeAnother}
              isAuthenticated={isAuthenticated}
            />
          )}
          
          {tarotAnalysisResult && tarotInputData && (
            <TarotResults 
              result={tarotAnalysisResult} 
              inputData={tarotInputData}
              onAnalyzeAnother={handleTarotAnalyzeAnother}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
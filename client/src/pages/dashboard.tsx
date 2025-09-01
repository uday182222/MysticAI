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
      <section className="pt-24 pb-12 subtle-bg">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 accent-gradient rounded-full flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Welcome {user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-xl text-secondary-foreground mb-6">
              Your personal mystical insights dashboard. Choose an analysis type to begin your journey of discovery.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-gradient" />
              <span className="text-sm text-muted-foreground">All analysis types available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section id="analysis-section" className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Choose Your Analysis</h2>
              <p className="text-lg text-secondary-foreground max-w-2xl mx-auto">
                Select from our comprehensive range of mystical analysis tools. Each provides unique insights into different aspects of your life.
              </p>
            </div>

            {/* Analysis Layout with Sidebar */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex gap-8">
                
                {/* Main Content Area */}
                <div className="flex-1">
                  <div className="clean-card p-8">
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
                </div>

                {/* Right Sidebar Navigation */}
                <div className="w-80 flex-shrink-0">
                  <div className="sticky top-8">
                    <div className="clean-card p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-6">Analysis Tools</h3>
                      <TabsList className="flex flex-col h-auto p-0 bg-transparent gap-2 w-full">
                        <TabsTrigger 
                          value="palm" 
                          className="w-full justify-start gap-3 p-4 h-auto data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-secondary-foreground hover:text-foreground hover:bg-muted transition-all"
                          data-testid="tab-palm"
                        >
                          <Hand className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Palm Reading</div>
                            <div className="text-xs text-muted-foreground">Analyze your palm lines</div>
                          </div>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="astrology" 
                          className="w-full justify-start gap-3 p-4 h-auto data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-secondary-foreground hover:text-foreground hover:bg-muted transition-all"
                          data-testid="tab-astrology"
                        >
                          <Stars className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Astrology</div>
                            <div className="text-xs text-muted-foreground">Birth chart insights</div>
                          </div>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="vastu" 
                          className="w-full justify-start gap-3 p-4 h-auto data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-secondary-foreground hover:text-foreground hover:bg-muted transition-all"
                          data-testid="tab-vastu"
                        >
                          <HomeIcon className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Vastu</div>
                            <div className="text-xs text-muted-foreground">Space energy analysis</div>
                          </div>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="numerology" 
                          className="w-full justify-start gap-3 p-4 h-auto data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-secondary-foreground hover:text-foreground hover:bg-muted transition-all"
                          data-testid="tab-numerology"
                        >
                          <Calculator className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Numerology</div>
                            <div className="text-xs text-muted-foreground">Numbers and destiny</div>
                          </div>
                        </TabsTrigger>
                        
                        <TabsTrigger 
                          value="tarot" 
                          className="w-full justify-start gap-3 p-4 h-auto data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-secondary-foreground hover:text-foreground hover:bg-muted transition-all"
                          data-testid="tab-tarot"
                        >
                          <Zap className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">Tarot</div>
                            <div className="text-xs text-muted-foreground">Card divination</div>
                          </div>
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                </div>

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
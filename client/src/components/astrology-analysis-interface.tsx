import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAnalysisError } from "@/hooks/use-analysis-error";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Stars, Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { AstrologyAnalysisResult, AstrologyInput } from "@shared/schema";
import { CosmicLoader } from "@/components/cosmic-loader";
import { AnalysisErrorDisplay } from "@/components/analysis-error-display";

interface AstrologyAnalysisInterfaceProps {
  onAnalysisComplete: (result: AstrologyAnalysisResult, inputData: AstrologyInput, analysisId: string) => void;
}

export function AstrologyAnalysisInterface({ onAnalysisComplete }: AstrologyAnalysisInterfaceProps) {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  
  const { toast } = useToast();
  const { analysisError, retryCount, clearError, setError, resetRetry, handleRetry } = useAnalysisError();

  const analysisMutation = useMutation({
    mutationFn: async (astrologyData: AstrologyInput) => {
      const response = await apiRequest("POST", "/api/astrology/analyze", astrologyData);
      return response.json();
    },
    onSuccess: (data) => {
      clearError();
      resetRetry();
      onAnalysisComplete(data.result, data.inputData, data.id);
      toast({
        title: "Analysis Complete!",
        description: "Your astrological chart reading is ready.",
      });
    },
    onError: (error) => {
      const errorMessage = error.message || "An unexpected error occurred during analysis";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!birthDate || !birthTime || !birthPlace) {
      toast({
        title: "Missing Information",
        description: "Please fill in all birth details for accurate analysis.",
        variant: "destructive",
      });
      return;
    }

    clearError();
    const astrologyData: AstrologyInput = {
      birthDate,
      birthTime,
      birthPlace,
    };

    analysisMutation.mutate(astrologyData);
  };

  const handleRetryClick = () => {
    if (!birthDate || !birthTime || !birthPlace) return;
    
    const astrologyData: AstrologyInput = {
      birthDate,
      birthTime,
      birthPlace,
    };
    handleRetry(() => analysisMutation.mutate(astrologyData));
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Astrology Chart Analysis</h3>
            <p className="text-lg text-gray-300">
              Enter your birth details to receive a comprehensive astrological reading
            </p>
          </div>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-card/95 backdrop-blur rounded-2xl">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
            <CardContent className="p-8 pt-9">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-card-foreground font-medium">
                      <Calendar className="inline mr-2 h-4 w-4 text-violet-500" />
                      Birth Date
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full"
                      data-testid="input-birth-date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthTime" className="text-card-foreground font-medium">
                      <Clock className="inline mr-2 h-4 w-4 text-violet-500" />
                      Birth Time
                    </Label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full"
                      data-testid="input-birth-time"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-card-foreground font-medium">
                    <MapPin className="inline mr-2 h-4 w-4 text-violet-500" />
                    Birth Place (City, Country)
                  </Label>
                  <Input
                    id="birthPlace"
                    type="text"
                    placeholder="e.g., New York, USA or Mumbai, India"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full"
                    data-testid="input-birth-place"
                  />
                </div>

                <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                  <h5 className="font-medium text-card-foreground mb-3 flex items-center">
                    <Stars className="text-violet-500 mr-2 h-4 w-4" />
                    Why We Need This Information
                  </h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Birth Date:</strong> Determines your sun sign and planetary positions</li>
                    <li>• <strong>Birth Time:</strong> Essential for calculating rising sign and house positions</li>
                    <li>• <strong>Birth Place:</strong> Used to determine exact celestial coordinates</li>
                    <li>• Accurate timing creates precise charts for better predictions</li>
                  </ul>
                </div>

                <div className="text-center mt-8">
                  <Button
                    onClick={handleAnalyze}
                    disabled={analysisMutation.isPending || !birthDate || !birthTime || !birthPlace}
                    size="lg"
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-8 py-4 text-lg shadow-lg"
                    data-testid="button-analyze-astrology"
                  >
                    {analysisMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Chart...
                      </>
                    ) : (
                      <>
                        <Stars className="mr-2 h-5 w-5" />
                        Generate Astrology Reading
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">Analysis typically takes 15-45 seconds</p>
                </div>

                {/* Error Display */}
                <AnalysisErrorDisplay
                  error={analysisError}
                  retryCount={retryCount}
                  onRetry={handleRetryClick}
                  isPending={analysisMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CosmicLoader 
        analysisType="astrology"
        isVisible={analysisMutation.isPending}
      />
    </div>
  );
}
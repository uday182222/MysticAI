import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, Hash, Loader2, Building, User } from "lucide-react";
import { NumerologyAnalysisResult, NumerologyInput } from "@shared/schema";
import { CosmicLoader } from "@/components/cosmic-loader";

interface NumerologyAnalysisInterfaceProps {
  onAnalysisComplete: (result: NumerologyAnalysisResult, inputData: NumerologyInput, analysisId: string) => void;
}

export function NumerologyAnalysisInterface({ onAnalysisComplete }: NumerologyAnalysisInterfaceProps) {
  const [analysisType, setAnalysisType] = useState<"personal" | "business">("personal");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async (numerologyData: NumerologyInput) => {
      const response = await apiRequest("POST", "/api/numerology/analyze", numerologyData);
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data.result, data.inputData, data.id);
      toast({
        title: "Analysis Complete!",
        description: "Your numerology analysis is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    const numerologyData: NumerologyInput = {
      analysisType,
      ...(analysisType === "personal" && {
        name: name.trim(),
        birthDate: birthDate,
      }),
      ...(analysisType === "business" && {
        companyName: companyName.trim(),
      }),
    };

    // Basic validation
    if (analysisType === "personal") {
      if (!name.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your full name.",
          variant: "destructive",
        });
        return;
      }
      if (!birthDate) {
        toast({
          title: "Missing Information", 
          description: "Please enter your birth date.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!companyName.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter the company name.",
          variant: "destructive",
        });
        return;
      }
    }

    analysisMutation.mutate(numerologyData);
  };

  const resetForm = () => {
    setName("");
    setBirthDate("");
    setCompanyName("");
    setAnalysisType("personal");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-card/75 backdrop-blur rounded-2xl">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
        <CardHeader className="text-center pt-9">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <Calculator className="h-6 w-6 text-violet-500" />
          </div>
          <CardTitle className="text-2xl text-white">Numerology Analysis</CardTitle>
          <CardDescription className="text-white/80">
            Discover the hidden meanings behind numbers in your life
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Analysis Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="analysisType">Analysis Type</Label>
            <Select value={analysisType} onValueChange={(value: "personal" | "business") => setAnalysisType(value)}>
              <SelectTrigger data-testid="select-numerology-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Personal Numerology</span>
                  </div>
                </SelectItem>
                <SelectItem value="business">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Business Numerology</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {analysisType === "personal" ? (
            <>
              {/* Personal Information */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name as on birth certificate"
                    data-testid="input-numerology-name"
                  />
                  <p className="text-sm text-white/80">
                    Use your complete birth name for the most accurate reading
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    data-testid="input-numerology-birthdate"
                  />
                  <p className="text-sm text-white/80">
                    Your birth date is used to calculate your Life Path number
                  </p>
                </div>
              </div>

              {/* Personal Analysis Features */}
              <Card className="bg-violet-50/50 border-violet-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Hash className="mr-2 h-4 w-4 text-violet-500" />
                    Personal Analysis Includes:
                  </h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• Life Path Number - Your life's purpose and journey</li>
                    <li>• Destiny Number - Your ultimate life goals</li>
                    <li>• Soul Urge Number - Your inner desires and motivations</li>
                    <li>• Personality Number - How others perceive you</li>
                    <li>• Lucky numbers, colors, and favorable periods</li>
                    <li>• Relationship compatibility insights</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Business Information */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter the full company name"
                  data-testid="input-numerology-company"
                />
                <p className="text-sm text-white/80">
                  Use the complete business name as registered
                </p>
              </div>

              {/* Business Analysis Features */}
              <Card className="bg-violet-50/50 border-violet-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Hash className="mr-2 h-4 w-4 text-violet-500" />
                    Business Analysis Includes:
                  </h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• Business Destiny Number - Company's ultimate purpose</li>
                    <li>• Success potential and growth opportunities</li>
                    <li>• Favorable business activities and ventures</li>
                    <li>• Lucky dates for important decisions</li>
                    <li>• Branding and marketing insights</li>
                    <li>• Partnership compatibility analysis</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {/* Action Button */}
          <Button 
            onClick={handleAnalyze}
            disabled={analysisMutation.isPending}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            size="lg"
            data-testid="button-analyze-numerology"
          >
            {analysisMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {analysisMutation.isPending ? "Calculating Numbers..." : "Analyze Numbers"}
          </Button>

          <Button 
            onClick={resetForm}
            variant="outline"
            className="w-full"
            data-testid="button-reset-numerology-form"
          >
            Reset Form
          </Button>
        </CardContent>
      </Card>

      <CosmicLoader 
        analysisType="numerology"
        isVisible={analysisMutation.isPending}
      />
    </div>
  );
}
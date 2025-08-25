import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VastuAnalysisResult, VastuInput } from "@shared/schema";
import { 
  Home, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Download,
  Share,
  RotateCcw,
  Compass,
  Heart,
  DollarSign,
  Activity,
  Briefcase,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface VastuResultsProps {
  result: VastuAnalysisResult;
  inputData: VastuInput;
  imageUrl?: string;
  onAnalyzeAnother: () => void;
}

export function VastuResults({ result, inputData, imageUrl, onAnalyzeAnother }: VastuResultsProps) {
  const handleDownloadReport = () => {
    console.log("Download Vastu report functionality would be implemented here");
  };

  const handleShareResults = () => {
    console.log("Share Vastu results functionality would be implemented here");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <section id="vastu-results-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Results Header */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">Your Vastu Analysis Report</h3>
            <p className="text-lg text-secondary">
              Comprehensive Vastu assessment for your {inputData.layoutType} with practical recommendations
            </p>
          </div>

          {/* Overall Score and Assessment */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {imageUrl && (
              <div className="lg:col-span-1">
                <Card className="bg-slate-50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-primary mb-4">Layout Image</h4>
                    <div className="relative">
                      <img 
                        src={imageUrl} 
                        alt="Analyzed layout" 
                        className="w-full rounded-lg shadow-md"
                        data-testid="img-analyzed-layout"
                      />
                      <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className={imageUrl ? "lg:col-span-2" : "lg:col-span-3"}>
              <div className="space-y-6">
                {/* Overall Score */}
                <Card className={`${getScoreBgColor(result.overallScore)} border-2`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Home className="h-8 w-8 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-primary">Overall Vastu Score</h4>
                        <div className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`} data-testid="text-overall-score">
                          {result.overallScore}/100
                        </div>
                      </div>
                    </div>
                    <Progress value={result.overallScore} className="mb-4" />
                    <p className="text-secondary" data-testid="text-overall-assessment">
                      {result.overallAssessment}
                    </p>
                  </CardContent>
                </Card>

                {/* Energy Flow */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-primary mb-4 flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                      Energy Flow Analysis
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <ArrowUp className="h-5 w-5 text-green-500 mr-1" />
                          <span className="font-medium text-green-600">Positive</span>
                        </div>
                        <div className="space-y-1">
                          {result.energyFlow.positive.map((area, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <ArrowDown className="h-5 w-5 text-red-500 mr-1" />
                          <span className="font-medium text-red-600">Negative</span>
                        </div>
                        <div className="space-y-1">
                          {result.energyFlow.negative.map((area, index) => (
                            <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Minus className="h-5 w-5 text-gray-500 mr-1" />
                          <span className="font-medium text-gray-600">Neutral</span>
                        </div>
                        <div className="space-y-1">
                          {result.energyFlow.neutral.map((area, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Room Analysis */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <Compass className="mr-2 h-5 w-5 text-blue-500" />
                Room-wise Analysis
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {result.roomAnalysis.map((room, index) => (
                  <Card key={index} className="bg-slate-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-primary">{room.room}</h5>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {room.direction}
                          </Badge>
                          <div className={`text-sm font-bold ${getScoreColor(room.score)}`}>
                            {room.score}/100
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-secondary mb-3" data-testid={`text-room-compliance-${index}`}>
                        {room.vastuCompliance}
                      </p>
                      <div>
                        <h6 className="text-xs font-medium text-primary mb-1">Recommendations:</h6>
                        <ul className="text-xs text-secondary space-y-1">
                          {room.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} data-testid={`text-room-recommendation-${index}-${recIndex}`}>
                              • {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-primary">Immediate Actions</h4>
                </div>
                <ul className="text-secondary text-sm space-y-2">
                  {result.recommendations.immediate.map((recommendation, index) => (
                    <li key={index} data-testid={`text-immediate-recommendation-${index}`}>
                      • {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-primary">Long-term Changes</h4>
                </div>
                <ul className="text-secondary text-sm space-y-2">
                  {result.recommendations.longTerm.map((recommendation, index) => (
                    <li key={index} data-testid={`text-longterm-recommendation-${index}`}>
                      • {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-primary">Vastu Remedies</h4>
                </div>
                <ul className="text-secondary text-sm space-y-2">
                  {result.recommendations.remedies.map((remedy, index) => (
                    <li key={index} data-testid={`text-remedy-${index}`}>
                      • {remedy}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Prosperity Impact */}
          <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-amber-600" />
                Impact on Prosperity
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h5 className="font-medium text-primary mb-2">Wealth</h5>
                  <p className="text-sm text-secondary" data-testid="text-wealth-impact">
                    {result.prosperity.wealth}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <h5 className="font-medium text-primary mb-2">Health</h5>
                  <p className="text-sm text-secondary" data-testid="text-health-impact">
                    {result.prosperity.health}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <h5 className="font-medium text-primary mb-2">Relationships</h5>
                  <p className="text-sm text-secondary" data-testid="text-relationships-impact">
                    {result.prosperity.relationships}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <h5 className="font-medium text-primary mb-2">Career</h5>
                  <p className="text-sm text-secondary" data-testid="text-career-impact">
                    {result.prosperity.career}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDownloadReport}
                className="bg-accent hover:bg-blue-600"
                data-testid="button-download-vastu-report"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Full Report
              </Button>
              <Button 
                variant="outline"
                onClick={handleShareResults}
                data-testid="button-share-vastu-results"
              >
                <Share className="mr-2 h-4 w-4" />
                Share Results
              </Button>
              <Button 
                variant="ghost"
                onClick={onAnalyzeAnother}
                className="text-accent hover:text-blue-600"
                data-testid="button-analyze-another-vastu"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Analyze Another Layout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
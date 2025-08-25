import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AstrologyAnalysisResult, AstrologyInput } from "@shared/schema";
import { 
  Stars, 
  Sun, 
  Moon, 
  Heart, 
  Briefcase, 
  Leaf, 
  Gem,
  Download,
  Share,
  RotateCcw,
  Zap,
  TrendingUp,
  Compass,
  Brain
} from "lucide-react";

interface AstrologyResultsProps {
  result: AstrologyAnalysisResult;
  inputData: AstrologyInput;
  onAnalyzeAnother: () => void;
}

export function AstrologyResults({ result, inputData, onAnalyzeAnother }: AstrologyResultsProps) {
  const handleDownloadReport = () => {
    console.log("Download astrology report functionality would be implemented here");
  };

  const handleShareResults = () => {
    console.log("Share astrology results functionality would be implemented here");
  };

  return (
    <section id="astrology-results-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Results Header */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">Your Astrological Chart Reading</h3>
            <p className="text-lg text-secondary">
              AI-powered analysis of your birth chart reveals insights about your cosmic blueprint
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              Born: {inputData.birthDate} at {inputData.birthTime} in {inputData.birthPlace}
            </div>
          </div>

          {/* Chart Overview */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Signs Overview */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-primary mb-4 flex items-center">
                    <Stars className="mr-2 h-5 w-5 text-indigo-600" />
                    Your Core Signs
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Sun className="h-8 w-8 text-orange-500" />
                      <div>
                        <div className="font-medium">Sun Sign</div>
                        <div className="text-sm text-secondary" data-testid="text-sun-sign">
                          {result.sunSign}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Moon className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-medium">Moon Sign</div>
                        <div className="text-sm text-secondary" data-testid="text-moon-sign">
                          {result.moonSign}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-green-500" />
                      <div>
                        <div className="font-medium">Rising Sign</div>
                        <div className="text-sm text-secondary" data-testid="text-rising-sign">
                          {result.risingSign}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personality Overview */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-primary">Personality Overview</h4>
                  </div>
                  <p className="text-secondary leading-relaxed" data-testid="text-astrology-personality-overview">
                    {result.personalityOverview}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Planetary Positions */}
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-purple-600" />
                Planetary Influences
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.planetaryPositions).map(([planet, description]) => (
                  <div key={planet} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-medium text-primary capitalize mb-2">{planet}</div>
                    <div className="text-sm text-secondary" data-testid={`text-planet-${planet}`}>
                      {description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Life Areas Analysis */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Love & Relationships */}
            <Card className="bg-rose-50 border-rose-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-primary">Love & Relationships</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-2">Overview</h5>
                    <p className="text-secondary text-sm" data-testid="text-love-overview">
                      {result.lifeAreas.loveAndRelationships.overview}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Compatibility</h5>
                    <p className="text-secondary text-sm" data-testid="text-love-compatibility">
                      {result.lifeAreas.loveAndRelationships.compatibility}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Romantic Tendencies</h5>
                    <p className="text-secondary text-sm" data-testid="text-romantic-tendencies">
                      {result.lifeAreas.loveAndRelationships.romanticTendencies}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career & Finances */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-primary">Career & Finances</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-2">Career Path</h5>
                    <p className="text-secondary text-sm" data-testid="text-career-path">
                      {result.lifeAreas.careerAndFinances.careerPath}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Financial Prospects</h5>
                    <p className="text-secondary text-sm" data-testid="text-financial-luck">
                      {result.lifeAreas.careerAndFinances.financialLuck}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Professional Strengths</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.lifeAreas.careerAndFinances.professionalStrengths.map((strength, index) => (
                        <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health & Wellbeing */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-primary">Health & Wellbeing</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-2">Physical Health</h5>
                    <p className="text-secondary text-sm" data-testid="text-physical-health">
                      {result.lifeAreas.healthAndWellbeing.physicalHealth}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Mental Health</h5>
                    <p className="text-secondary text-sm" data-testid="text-mental-health">
                      {result.lifeAreas.healthAndWellbeing.mentalHealth}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Recommendations</h5>
                    <ul className="text-secondary text-sm space-y-1">
                      {result.lifeAreas.healthAndWellbeing.recommendations.map((recommendation, index) => (
                        <li key={index} data-testid={`text-health-recommendation-${index}`}>• {recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spiritual Growth */}
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Gem className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-primary">Spiritual Growth</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-primary mb-2">Life Lesson</h5>
                    <p className="text-secondary text-sm" data-testid="text-life-lesson">
                      {result.lifeAreas.spiritualGrowth.lifeLesson}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Spiritual Path</h5>
                    <p className="text-secondary text-sm" data-testid="text-spiritual-path">
                      {result.lifeAreas.spiritualGrowth.spiritualPath}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-2">Karma Insights</h5>
                    <p className="text-secondary text-sm" data-testid="text-karma-insights">
                      {result.lifeAreas.spiritualGrowth.karmaInsights}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Future Predictions */}
          <Card className="mb-8 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-primary">Future Predictions</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-primary mb-3">This Year</h5>
                  <p className="text-secondary text-sm" data-testid="text-this-year">
                    {result.predictions.thisYear}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-primary mb-3">Next Three Years</h5>
                  <p className="text-secondary text-sm" data-testid="text-next-three-years">
                    {result.predictions.nextThreeYears}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h5 className="font-medium text-primary mb-3">Major Life Events</h5>
                <ul className="text-secondary text-sm space-y-1">
                  {result.predictions.majorLifeEvents.map((event, index) => (
                    <li key={index} data-testid={`text-major-event-${index}`}>• {event}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDownloadReport}
                className="bg-accent hover:bg-blue-600"
                data-testid="button-download-astrology-report"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Full Report
              </Button>
              <Button 
                variant="outline"
                onClick={handleShareResults}
                data-testid="button-share-astrology-results"
              >
                <Share className="mr-2 h-4 w-4" />
                Share Results
              </Button>
              <Button 
                variant="ghost"
                onClick={onAnalyzeAnother}
                className="text-accent hover:text-blue-600"
                data-testid="button-analyze-another-astrology"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Analyze Another Chart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
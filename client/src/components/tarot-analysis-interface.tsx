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
import { Sparkles, Zap, Shuffle, Loader2 } from "lucide-react";
import { TarotAnalysisResult, TarotInput } from "@shared/schema";
import { CosmicLoader } from "@/components/cosmic-loader";

interface TarotAnalysisInterfaceProps {
  onAnalysisComplete: (result: TarotAnalysisResult, inputData: TarotInput, analysisId: string) => void;
}

// Predefined tarot cards for realistic simulation
const MAJOR_ARCANA = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];

const MINOR_ARCANA = [
  // Wands
  "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
  "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
  "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands",
  // Cups
  "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
  "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
  "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
  // Swords
  "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords",
  "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords",
  "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords",
  // Pentacles
  "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles",
  "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles",
  "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
];

const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export function TarotAnalysisInterface({ onAnalysisComplete }: TarotAnalysisInterfaceProps) {
  const [spreadType, setSpreadType] = useState<"single-card" | "three-card" | "celtic-cross">("three-card");
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<Array<{cardName: string; suit: string; position: string; reversed: boolean}>>([]);
  const [isDrawingCards, setIsDrawingCards] = useState(false);
  
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async (tarotData: TarotInput) => {
      const response = await apiRequest("POST", "/api/tarot/analyze", tarotData);
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data.result, data.inputData, data.id);
      toast({
        title: "Reading Complete!",
        description: "Your tarot reading is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Reading Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getSpreadPositions = (type: string) => {
    switch (type) {
      case "single-card":
        return ["Present Situation"];
      case "three-card":
        return ["Past", "Present", "Future"];
      case "celtic-cross":
        return [
          "Present Situation", "Challenge", "Distant Past", "Recent Past",
          "Possible Outcome", "Near Future", "Your Approach", "External Influences",
          "Hopes and Fears", "Final Outcome"
        ];
      default:
        return ["Past", "Present", "Future"];
    }
  };

  const drawCards = () => {
    setIsDrawingCards(true);
    const positions = getSpreadPositions(spreadType);
    const selectedCards: Array<{cardName: string; suit: string; position: string; reversed: boolean}> = [];
    const availableCards = [...ALL_CARDS];

    // Simulate card drawing with animation delay
    setTimeout(() => {
      for (let i = 0; i < positions.length; i++) {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const cardName = availableCards.splice(randomIndex, 1)[0];
        const reversed = Math.random() < 0.3; // 30% chance of reversed card
        
        // Determine suit for minor arcana
        let suit = "";
        if (cardName.includes("Wands")) suit = "Wands";
        else if (cardName.includes("Cups")) suit = "Cups";
        else if (cardName.includes("Swords")) suit = "Swords";
        else if (cardName.includes("Pentacles")) suit = "Pentacles";
        else suit = "Major Arcana";

        selectedCards.push({
          cardName,
          suit,
          position: positions[i],
          reversed
        });
      }
      
      setDrawnCards(selectedCards);
      setIsDrawingCards(false);
    }, 1500);
  };

  const handleAnalyze = () => {
    if (drawnCards.length === 0) {
      toast({
        title: "No Cards Drawn",
        description: "Please draw cards first before analyzing.",
        variant: "destructive",
      });
      return;
    }

    const tarotData: TarotInput = {
      spreadType,
      question: question.trim() || undefined,
      drawnCards,
    };

    analysisMutation.mutate(tarotData);
  };

  const resetReading = () => {
    setQuestion("");
    setDrawnCards([]);
    setSpreadType("three-card");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur rounded-2xl">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
        <CardHeader className="text-center pt-9">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-violet-500" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Tarot Reading</CardTitle>
          <CardDescription className="text-gray-600">
            Discover guidance and insights through the ancient wisdom of tarot
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Spread Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="spreadType">Choose Your Spread</Label>
            <Select value={spreadType} onValueChange={(value: any) => setSpreadType(value)}>
              <SelectTrigger data-testid="select-tarot-spread">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-card">Single Card - Quick Insight</SelectItem>
                <SelectItem value="three-card">Three Card - Past, Present, Future</SelectItem>
                <SelectItem value="celtic-cross">Celtic Cross - Comprehensive Reading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Input */}
          <div className="space-y-2">
            <Label htmlFor="question">Your Question (Optional)</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask the cards for guidance on love, career, spirituality, or any area of your life..."
              rows={3}
              data-testid="textarea-tarot-question"
            />
            <p className="text-sm text-muted-foreground">
              Focus your intention while asking your question for more meaningful insights
            </p>
          </div>

          {/* Card Drawing Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Draw Your Cards</h4>
              <Button 
                onClick={drawCards}
                disabled={isDrawingCards}
                variant="outline"
                size="sm"
                data-testid="button-draw-tarot-cards"
              >
                {isDrawingCards ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Drawing...
                  </>
                ) : (
                  <>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Draw Cards
                  </>
                )}
              </Button>
            </div>

            {/* Display Drawn Cards */}
            {drawnCards.length > 0 && (
              <div className="grid gap-3">
                {drawnCards.map((card, index) => (
                  <Card key={index} className="bg-violet-50/70 border-violet-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{card.position}</p>
                          <p className="text-sm text-gray-600">
                            {card.cardName} {card.reversed && "(Reversed)"}
                          </p>
                          {card.suit && card.suit !== "Major Arcana" && (
                            <p className="text-xs text-muted-foreground">{card.suit}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Sparkles className={`h-5 w-5 ${card.reversed ? 'transform rotate-180 text-orange-500' : 'text-yellow-500'}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Spread Information */}
          <Card className="bg-violet-50/50 border-violet-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Zap className="mr-2 h-4 w-4 text-violet-500" />
                {spreadType === "single-card" && "Single Card Reading"}
                {spreadType === "three-card" && "Three Card Reading"}
                {spreadType === "celtic-cross" && "Celtic Cross Reading"}
              </h4>
              <p className="text-sm text-gray-600">
                {spreadType === "single-card" && "Perfect for quick daily guidance or focused questions about your current situation."}
                {spreadType === "three-card" && "Explores the past influences, present situation, and future potential around your question."}
                {spreadType === "celtic-cross" && "The most comprehensive spread, revealing complex layers of your situation with detailed guidance."}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleAnalyze}
              disabled={analysisMutation.isPending || drawnCards.length === 0}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              size="lg"
              data-testid="button-analyze-tarot"
            >
              {analysisMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {analysisMutation.isPending ? "Interpreting Cards..." : "Interpret Reading"}
            </Button>

            <Button 
              onClick={resetReading}
              variant="outline"
              className="w-full"
              data-testid="button-reset-tarot-reading"
            >
              New Reading
            </Button>
          </div>
        </CardContent>
      </Card>

      <CosmicLoader 
        analysisType="tarot"
        isVisible={analysisMutation.isPending}
      />
    </div>
  );
}
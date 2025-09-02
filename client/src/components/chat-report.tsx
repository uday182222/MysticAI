import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  MessageCircle, 
  Clock, 
  User, 
  Bot, 
  CreditCard,
  Brain,
  Shield,
  Calendar
} from "lucide-react";

interface ChatReportProps {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date | string;
    createdAt?: Date | string;
  }>;
  reportType: 'ai-chat' | 'post-analysis';
  analysisType?: 'palm' | 'astrology' | 'vastu' | 'numerology' | 'tarot';
  analysisData?: any;
  analysisId?: string;
  userCredits?: number;
  creditsUsed?: number;
  minutesUsed?: number;
  reportId?: string;
}

export function ChatReport({ 
  messages, 
  reportType, 
  analysisType, 
  analysisData, 
  analysisId,
  userCredits,
  creditsUsed,
  minutesUsed,
  reportId = 'chat-report'
}: ChatReportProps) {
  const userMessages = messages.filter(msg => msg.role === 'user').length;
  const aiMessages = messages.filter(msg => msg.role === 'assistant').length;
  const reportDate = new Date();

  const getAnalysisSummary = () => {
    if (!analysisType || !analysisData) return null;
    
    switch (analysisType) {
      case 'palm':
        return {
          title: "Palm Reading Analysis",
          summary: `Personality traits: ${analysisData?.traits?.join(', ') || 'N/A'}`,
          stats: [
            { label: "Life Energy", value: `${analysisData?.lifeEnergyPercentage || 'N/A'}%` },
            { label: "Career Potential", value: `${analysisData?.careerPotentialPercentage || 'N/A'}%` },
            { label: "Emotional Balance", value: `${analysisData?.emotionalBalancePercentage || 'N/A'}%` }
          ]
        };
      case 'astrology':
        return {
          title: "Astrology Chart Analysis", 
          summary: "Birth chart analysis with cosmic influences and planetary positions",
          stats: []
        };
      case 'vastu':
        return {
          title: "Vastu Analysis",
          summary: "Home/office energy flow analysis and recommendations",
          stats: []
        };
      case 'numerology':
        return {
          title: "Numerology Analysis",
          summary: "Life path numbers and personality insights through numerological patterns",
          stats: []
        };
      case 'tarot':
        return {
          title: "Tarot Reading",
          summary: "Card interpretations and spiritual guidance from the tarot",
          stats: []
        };
      default:
        return null;
    }
  };

  const analysisInfo = getAnalysisSummary();

  return (
    <div id={reportId} className="max-w-4xl mx-auto bg-white text-gray-900 font-sans" style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-purple-200 pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MysticRead AI
            </h1>
            <p className="text-sm text-gray-600">Your Mystical Analysis Platform</p>
          </div>
        </div>
        
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center text-gray-900">
              {reportType === 'ai-chat' ? 'AI Chat Conversation Report' : 'Post-Analysis Chat Report'}
            </CardTitle>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {reportDate.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {reportDate.toLocaleTimeString()}
              </div>
              {analysisId && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  ID: {analysisId.slice(0, 8)}...
                </div>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Analysis Context (for post-analysis reports) */}
      {analysisInfo && (
        <Card className="mb-6 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Original Analysis Context
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{analysisInfo.title}</h3>
                <p className="text-gray-700">{analysisInfo.summary}</p>
              </div>
              {analysisInfo.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {analysisInfo.stats.map((stat, index) => (
                    <div key={index} className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-lg font-semibold text-purple-600">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Statistics */}
      <Card className="mb-6 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MessageCircle className="h-5 w-5" />
            Conversation Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
              <p className="text-sm text-gray-600">Total Messages</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <User className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{userMessages}</p>
              <p className="text-sm text-gray-600">Your Questions</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Bot className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{aiMessages}</p>
              <p className="text-sm text-gray-600">AI Responses</p>
            </div>
            {reportType === 'ai-chat' && creditsUsed && (
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold text-orange-600">{creditsUsed}</p>
                <p className="text-sm text-gray-600">Credits Used</p>
              </div>
            )}
            {reportType === 'post-analysis' && (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-600">∞</p>
                <p className="text-sm text-gray-600">Unlimited Chat</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat History */}
      <Card className="mb-6 border-purple-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message, index) => {
              const timestamp = new Date(message.timestamp || message.createdAt || new Date()).toLocaleTimeString();
              const isUser = message.role === 'user';
              
              return (
                <div key={index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isUser ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                    }`}>
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      isUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{timestamp}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card className="mb-6 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Brain className="h-5 w-5" />
            Technical Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">AI Model Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <Badge variant="secondary">GPT-5</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Release Date:</span>
                  <span className="text-gray-900">August 7, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Context Length:</span>
                  <span className="text-gray-900">128k tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="text-gray-900">0.7</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Platform Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Frontend:</span>
                  <span className="text-gray-900">React + TypeScript</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backend:</span>
                  <span className="text-gray-900">Node.js + Express</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="text-gray-900">PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing:</span>
                  <span className="text-gray-900">Real-time AI</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Important Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>AI-Generated Content:</strong> This report contains AI-generated responses from OpenAI's GPT-5 model. 
              The insights, guidance, and interpretations provided are based on artificial intelligence analysis and should 
              be considered as guidance rather than definitive predictions or professional advice.
            </p>
            
            {reportType === 'post-analysis' && analysisType && (
              <p>
                <strong>Analysis Context:</strong> This conversation builds upon your original {analysisType} analysis. 
                The AI maintains awareness of your reading results to provide relevant and personalized follow-up responses.
              </p>
            )}
            
            <p>
              <strong>Intended Use:</strong> MysticRead AI is designed for entertainment, self-reflection, and spiritual 
              exploration purposes. The content should not replace professional counseling, medical advice, financial 
              guidance, or other expert consultation.
            </p>
            
            <p>
              <strong>Privacy & Security:</strong> All conversations are processed securely with encryption. Your privacy 
              and data security are our top priorities. This report is generated for your personal use and reference.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 pt-6 border-t-2 border-purple-200">
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Generated by MysticRead AI</strong></p>
          <p>Your Mystical Analysis Platform</p>
          <p>© {reportDate.getFullYear()} MysticRead AI. All rights reserved.</p>
          <p className="text-xs">Report generated on {reportDate.toISOString()}</p>
        </div>
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage, ChatConversation } from "@shared/schema";
import { 
  MessageCircle, 
  Send, 
  CreditCard, 
  Sparkles, 
  User, 
  Bot,
  Coins,
  Zap,
  Lock,
  Download
} from "lucide-react";

interface PostAnalysisChatProps {
  analysisId: string;
  analysisType: 'palm' | 'astrology' | 'vastu' | 'numerology' | 'tarot';
  analysisData: any;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
}

export function PostAnalysisChat({ 
  analysisId, 
  analysisType, 
  analysisData, 
  isAuthenticated,
  onLoginRequired 
}: PostAnalysisChatProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get conversation data
  const { data: conversation, isLoading } = useQuery<{messages: ChatMessage[]}>({
    queryKey: ['/api/chat/conversation', analysisId],
    enabled: isAuthenticated
  });

  // Get user credits
  const { data: userCredits } = useQuery<{credits: number}>({
    queryKey: ['/api/auth/me'],
    enabled: isAuthenticated
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", "/api/chat/send", {
        analysisId,
        analysisType,
        message: messageText,
        analysisData
      });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/chat/conversation', analysisId] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });


  const handleSendMessage = () => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    if (!message.trim()) return;

    sendMessageMutation.mutate(message.trim());
  };

  const handleDownloadChat = () => {
    const messages = conversation?.messages || [];
    
    if (messages.length === 0) {
      toast({
        title: "No Chat to Download",
        description: "Start a conversation first to download your chat history",
        variant: "destructive"
      });
      return;
    }

    // Calculate message statistics
    const userMessages = messages.filter(msg => msg.role === 'user').length;
    const aiMessages = messages.filter(msg => msg.role === 'assistant').length;
    
    // Get analysis summary for context
    const getAnalysisSummary = () => {
      switch (analysisType) {
        case 'palm':
          return `Palm Reading Analysis - Personality traits: ${analysisData?.traits?.join(', ') || 'N/A'}, Life Energy: ${analysisData?.lifeEnergyPercentage || 'N/A'}%, Career Potential: ${analysisData?.careerPotentialPercentage || 'N/A'}%`;
        case 'astrology':
          return `Astrology Chart Analysis - Birth details and cosmic influences`;
        case 'vastu':
          return `Vastu Analysis - Home/office energy flow and recommendations`;
        case 'numerology':
          return `Numerology Analysis - Life path numbers and personality insights`;
        case 'tarot':
          return `Tarot Reading - Card interpretations and spiritual guidance`;
        default:
          return `${analysisType} Analysis`;
      }
    };
    
    // Format chat content with analysis context
    const chatContent = `=== MYSTICREAD AI POST-ANALYSIS CHAT ===
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Analysis Type: ${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}
Analysis ID: ${analysisId}

--- ORIGINAL ANALYSIS CONTEXT ---
${getAnalysisSummary()}

--- CHAT STATISTICS ---
Total Messages: ${messages.length}
Your Questions: ${userMessages}
AI Responses: ${aiMessages}
Chat Status: Unlimited (Post-Analysis)

--- CONVERSATION HISTORY ---
${messages.map(msg => {
  const timestamp = new Date(msg.createdAt).toLocaleTimeString();
  const role = msg.role === 'user' ? 'You' : 'MysticRead AI';
  return `[${timestamp}] ${role}: ${msg.content}`;
}).join('\n\n')}

--- TECHNICAL INFORMATION ---
AI Model: GPT-5 (Released August 7, 2025)
Analysis Engine: MysticRead AI Multi-Modal Analysis
Response Generation: Real-time contextual AI processing with analysis history
Architecture: Node.js backend with React frontend
Database: PostgreSQL with secure conversation storage
Context Retention: Full analysis data available for enhanced responses

--- TECHNICAL SPECIFICATIONS ---
Model: GPT-5 (gpt-5)
Context Window: 128k tokens with full analysis context
Temperature: 0.7 (balanced creativity and accuracy)
Response Time: ~2-5 seconds average
Processing: Multi-turn conversation with original analysis context
Analysis Integration: Full access to your ${analysisType} reading results

--- AI DISCLAIMER ---
This report contains AI-generated responses based on OpenAI's GPT-5 model in 
conjunction with your original ${analysisType} analysis results. The follow-up 
insights, clarifications, and additional guidance provided are generated using 
artificial intelligence and your specific analysis data.

The AI responses build upon your original analysis to provide deeper insights 
and answer specific questions. These should be considered as guidance for 
self-reflection and spiritual exploration rather than definitive predictions 
or professional advice.

MysticRead AI provides contextual follow-up conversations to help you better 
understand your analysis results. The AI maintains awareness of your original 
reading to provide relevant and personalized responses.

This conversation should not replace professional counseling, medical advice, 
financial guidance, or other expert consultation. All insights are provided 
for entertainment, self-discovery, and spiritual exploration purposes.

Your conversation data is stored securely with encryption and privacy protection.

Generated by MysticRead AI - Your Mystical Analysis Platform
Original Analysis: ${new Date().toLocaleDateString()}
https://mysticread.ai

© ${new Date().getFullYear()} MysticRead AI. All rights reserved.
Report generated on ${new Date().toISOString()}`;

    // Create and download file
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MysticRead_${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}_Chat_${new Date().toISOString().split('T')[0]}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Chat Downloaded!",
      description: `Your ${analysisType} analysis conversation with ${messages.length} messages has been saved`,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  if (!isAuthenticated) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Want to Ask Follow-up Questions?
              </h3>
              <p className="text-blue-600 mb-4">
                Sign in to chat with our AI about your analysis results. Get personalized insights and answers!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
                <Sparkles className="h-4 w-4" />
                <span>Ask unlimited questions about your analysis</span>
              </div>
            </div>
            <Button onClick={onLoginRequired} className="bg-blue-600 hover:bg-blue-700">
              Sign In to Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const messages = conversation?.messages || [];
  const canSendMessage = true; // Simplified - no limits for now

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6" />
            <span>Chat About Your {analysisType} Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownloadChat}
              variant="secondary"
              size="sm"
              disabled={messages.length === 0}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              data-testid="button-download-post-chat"
            >
              <Download className="h-4 w-4 mr-1" />
              Download Chat
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Unlimited Chat
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages Area */}
        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                <p className="text-gray-900">
                  Ask me anything about your {analysisType} analysis!
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  I can provide deeper insights, clarify meanings, or answer specific questions.
                </p>
              </div>
            ) : (
              messages.map((msg: ChatMessage, index: number) => (
                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />


        {/* Input Area */}
        <div className="p-4 bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your analysis..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {sendMessageMutation.isPending ? (
                <Zap className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
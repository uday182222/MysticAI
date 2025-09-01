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
  Lock
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
  const [showPayment, setShowPayment] = useState(false);
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
      if (error.message?.includes('credits')) {
        setShowPayment(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Purchase credits mutation
  const purchaseCreditsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/payments/purchase-credits");
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;
    },
    onError: () => {
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
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

  const handlePurchaseCredits = () => {
    purchaseCreditsMutation.mutate();
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
                <span>5 Free Questions • $1 for 5 More</span>
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
  const freeQuestionsUsed = messages.filter((m: ChatMessage) => m.role === 'user').length;
  const creditsAvailable = userCredits?.credits || 0;
  const freeQuestionsRemaining = Math.max(0, 5 - freeQuestionsUsed);
  const canSendMessage = freeQuestionsRemaining > 0 || creditsAvailable >= 5;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6" />
            <span>Chat About Your {analysisType} Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            {freeQuestionsRemaining > 0 ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Sparkles className="h-3 w-3 mr-1" />
                {freeQuestionsRemaining} Free Left
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Coins className="h-3 w-3 mr-1" />
                {creditsAvailable} Credits
              </Badge>
            )}
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
                <p className="text-gray-600">
                  Ask me anything about your {analysisType} analysis!
                </p>
                <p className="text-sm text-gray-500 mt-1">
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
                        : 'bg-white border border-gray-200'
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

        {/* Payment Prompt */}
        {showPayment && !canSendMessage && (
          <div className="p-4 bg-orange-50 border-t border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    You've used your 5 free questions
                  </p>
                  <p className="text-xs text-orange-600">
                    Purchase 5 more questions for just $1 to continue chatting
                  </p>
                </div>
              </div>
              <Button 
                onClick={handlePurchaseCredits}
                disabled={purchaseCreditsMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {purchaseCreditsMutation.isPending ? 'Processing...' : 'Buy $1'}
              </Button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={canSendMessage ? "Ask about your analysis..." : "Purchase credits to continue chatting"}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!canSendMessage || sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!canSendMessage || !message.trim() || sendMessageMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {sendMessageMutation.isPending ? (
                <Zap className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {!canSendMessage && (
            <div className="mt-2 text-center">
              <Button 
                variant="outline"
                onClick={() => setShowPayment(true)}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Get 5 More Questions for $1
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
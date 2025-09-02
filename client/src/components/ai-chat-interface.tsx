import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Sparkles, 
  Clock, 
  CreditCard, 
  AlertCircle,
  Bot,
  User,
  Download
} from "lucide-react";
import { RazorpayPayment } from "./razorpay-payment";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface User {
  aiChatCredits: number;
  aiChatMinutesUsed: number;
}

export function AiChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user data including AI chat credits
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai-chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      // Add AI response to messages
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Update credits in user query
      queryClient.setQueryData(["/api/auth/me"], (oldData: any) => ({
        ...oldData,
        aiChatCredits: data.creditsRemaining
      }));

      toast({
        title: "Response Generated",
        description: `${data.creditsRemaining} credits remaining`,
      });
    },
    onError: (error: any) => {
      if (error.needsPayment) {
        setShowPayment(true);
        toast({
          title: "Credits Needed",
          description: "Purchase AI chat credits to continue the conversation",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Chat Error",
          description: error.message || "Failed to send message",
          variant: "destructive"
        });
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;

    // Add user message to messages
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user', 
      content: inputMessage.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to API
    sendMessageMutation.mutate(inputMessage.trim());
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    toast({
      title: "Credits Added!",
      description: "You can now continue your AI chat session",
    });
  };

  const handleDownloadChat = () => {
    if (messages.length === 0) {
      toast({
        title: "No Chat to Download",
        description: "Start a conversation first to download your chat history",
        variant: "destructive"
      });
      return;
    }

    // Calculate credits used
    const userMessages = messages.filter(msg => msg.role === 'user').length;
    const totalCreditsUsed = userMessages; // 1 credit per message
    
    // Format chat content
    const chatContent = `=== MYSTICREAD AI CHAT CONVERSATION ===
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Total Messages: ${messages.length}
User Messages: ${userMessages}
Credits Used: ${totalCreditsUsed}
Minutes Used: ${user?.aiChatMinutesUsed?.toFixed(1) || '0.0'}

--- CONVERSATION ---
${messages.map(msg => {
  const timestamp = new Date(msg.timestamp).toLocaleTimeString();
  const role = msg.role === 'user' ? 'You' : 'MysticRead AI';
  return `[${timestamp}] ${role}: ${msg.content}`;
}).join('\n\n')}

--- TECHNICAL INFORMATION ---
AI Model: GPT-5 (Released August 7, 2025)
Response Generation: Real-time AI processing via OpenAI API
Data Processing: Contextual analysis with mystical and spiritual expertise
Architecture: Node.js backend with React frontend
Database: PostgreSQL for conversation storage

--- TECHNICAL SPECIFICATIONS ---
Model: GPT-5 (gpt-5)
Max Context Length: 128k tokens
Temperature: 0.7 (balanced creativity and consistency)
Response Time: ~2-5 seconds average
Processing: Multi-turn conversation with context retention

--- DISCLAIMER ---
This report contains AI-generated content from OpenAI's GPT-5 model. 
The insights, guidance, and mystical interpretations provided are based on 
artificial intelligence analysis and should be considered as guidance rather 
than definitive predictions or professional advice.

MysticRead AI combines advanced language models with mystical knowledge 
for entertainment, self-reflection, and spiritual exploration purposes. 
The AI responses are generated based on patterns in training data and 
should not replace professional counseling, medical advice, or other 
expert consultation.

All conversations are processed securely and stored with encryption.
Your privacy and data security are our top priorities.

Generated by MysticRead AI - Your Mystical Analysis Platform
https://mysticread.ai

© ${new Date().getFullYear()} MysticRead AI. All rights reserved.
Report generated on ${new Date().toISOString()}`;

    // Create and download file
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MysticRead_Chat_${new Date().toISOString().split('T')[0]}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Chat Downloaded!",
      description: `Your conversation with ${messages.length} messages has been saved`,
    });
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  // Show payment interface if no credits or user explicitly requested it
  if (!user?.aiChatCredits || showPayment) {
    return (
      <div className="space-y-6">
        <Card className="border-accent/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl text-foreground">AI Mystical Assistant</CardTitle>
            <CardDescription>
              {user?.aiChatCredits ? (
                "Get more credits to continue your mystical journey"
              ) : (
                "Get personalized mystical guidance powered by AI. Purchase credits to start chatting."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {user?.aiChatCredits ? (
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {user.aiChatCredits} credits remaining
                  </Badge>
                  <Button
                    onClick={() => setShowPayment(false)}
                    variant="outline"
                    size="sm"
                  >
                    Back to Chat
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">No AI chat credits available</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <RazorpayPayment onPaymentSuccess={handlePaymentSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Credit Info */}
      <Card className="border-accent/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Mystical Assistant</CardTitle>
                <CardDescription>Your guide to mystical insights</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <CreditCard className="h-4 w-4 mr-1" />
                {user.aiChatCredits} credits
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {user.aiChatMinutesUsed.toFixed(1)}m used
              </Badge>
              <Button
                onClick={handleDownloadChat}
                variant="outline"
                size="sm"
                disabled={messages.length === 0}
                data-testid="button-download-chat"
              >
                <Download className="h-4 w-4 mr-1" />
                Download Chat
              </Button>
              <Button
                onClick={() => setShowPayment(true)}
                variant="outline"
                size="sm"
                data-testid="button-buy-credits"
              >
                Buy More Credits
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-accent/50" />
                  <h3 className="text-lg font-medium mb-2">Welcome to AI Mystical Chat</h3>
                  <p className="text-sm max-w-md mx-auto">
                    Ask me anything about spirituality, mysticism, or seek guidance on your life's journey. 
                    Each message uses 1 credit.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className={`rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything mystical..."
                disabled={sendMessageMutation.isPending}
                className="flex-1"
                data-testid="input-ai-chat-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                size="icon"
                data-testid="button-send-ai-chat"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Each message uses 1 credit • {user.aiChatCredits} credits remaining
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
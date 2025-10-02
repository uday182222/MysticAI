import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Sparkles, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  analysisId?: string;
  analysisType: string;
  analysisData: any;
  isAuthenticated: boolean;
  onLoginRequired?: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What does my fate line mean?",
  "How can I improve my career potential?",
  "What about my love life?",
  "Tell me more about my health indicators",
  "What should I focus on this year?",
];

export function ChatBox({
  analysisId,
  analysisType,
  analysisData,
  isAuthenticated,
  onLoginRequired,
}: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch conversation history
  const { data: conversation } = useQuery<{ messages: Message[] }>({
    queryKey: ["/api/chat/conversation", analysisId],
    enabled: isAuthenticated && !!analysisId,
  });

  // Update local messages when conversation loads
  useEffect(() => {
    if (conversation?.messages) {
      setLocalMessages(conversation.messages);
    }
  }, [conversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", "/api/chat/send", {
        analysisId,
        analysisType,
        message: messageText,
        analysisData,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      if (analysisId) {
        queryClient.invalidateQueries({ queryKey: ["/api/chat/conversation", analysisId] });
      }
    },
  });

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    // Add user message optimistically
    const userMessage: Message = { role: "user", content: textToSend };
    setLocalMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      await sendMessageMutation.mutateAsync(textToSend);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Card className="relative border-0 shadow-lg bg-card/70 backdrop-blur overflow-hidden">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400" />
        
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6 mt-1">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Palm Reader Assistant</h3>
                <p className="text-sm text-white/80">Ask me anything about your reading</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="p-6 bg-white">
            {localMessages.length === 0 ? (
              <div className="space-y-4">
                <p className="text-center text-white/80 mb-6">
                  Start a conversation! Here are some suggested questions:
                </p>
                <div className="grid gap-3">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-left p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border border-violet-200 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/90">{question}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <ScrollArea className="h-80 pr-4">
                <div className="space-y-4">
                  {localMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                            : "bg-gray-100 text-white/90"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {sendMessageMutation.isPending && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 items-center text-white/70"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-50 border-t">
            {!isAuthenticated ? (
              <Button
                onClick={onLoginRequired}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                Login to Chat with AI
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about your palm reading..."
                  className="flex-1 border-violet-200 focus-visible:ring-violet-500"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


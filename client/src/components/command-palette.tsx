import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Search, 
  Sparkles, 
  Navigation, 
  MessageCircle, 
  CreditCard, 
  Home, 
  BarChart3,
  Hand,
  Star,
  Building,
  Calculator,
  Heart,
  Bot,
  Settings,
  HelpCircle,
  Zap,
  Moon,
  Sun
} from 'lucide-react';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'navigation' | 'analysis' | 'chat' | 'account' | 'help';
  keywords: string[];
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setQuery(transcript);
        setIsListening(false);
        
        // Try to execute command directly if it's a clear match
        const matchedCommand = commands.find(cmd => 
          cmd.keywords.some(keyword => transcript.includes(keyword.toLowerCase()))
        );
        
        if (matchedCommand) {
          setTimeout(() => {
            matchedCommand.action();
            onClose();
          }, 500);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
  }, []);

  // Define commands
  const commands: Command[] = useMemo(() => [
    // Navigation Commands
    {
      id: 'go-home',
      title: 'Go to Home',
      description: 'Navigate to the landing page',
      icon: Home,
      category: 'navigation',
      keywords: ['home', 'landing', 'start'],
      shortcut: 'Ctrl+H',
      action: () => setLocation('/')
    },
    {
      id: 'go-dashboard',
      title: 'Go to Dashboard',
      description: 'Open your mystical dashboard',
      icon: BarChart3,
      category: 'navigation',
      keywords: ['dashboard', 'main', 'overview'],
      shortcut: 'Ctrl+D',
      action: () => setLocation('/dashboard')
    },
    
    // Analysis Commands  
    {
      id: 'palm-reading',
      title: 'Start Palm Reading',
      description: 'Begin a new palmistry analysis',
      icon: Hand,
      category: 'analysis',
      keywords: ['palm', 'palmistry', 'reading', 'hand'],
      action: () => {
        setLocation('/dashboard');
        // Focus palm tab after navigation
        setTimeout(() => {
          const palmTab = document.querySelector('[data-testid="tab-palm"]') as HTMLElement;
          if (palmTab) palmTab.click();
        }, 100);
      }
    },
    {
      id: 'astrology-chart',
      title: 'Create Astrology Chart',
      description: 'Generate your astrological insights',
      icon: Star,
      category: 'analysis',
      keywords: ['astrology', 'chart', 'horoscope', 'stars'],
      action: () => {
        setLocation('/dashboard');
        setTimeout(() => {
          const astrologyTab = document.querySelector('[data-testid="tab-astrology"]') as HTMLElement;
          if (astrologyTab) astrologyTab.click();
        }, 100);
      }
    },
    {
      id: 'vastu-analysis',
      title: 'Vastu Analysis',
      description: 'Analyze your space energy flow',
      icon: Building,
      category: 'analysis',
      keywords: ['vastu', 'space', 'energy', 'home'],
      action: () => {
        setLocation('/dashboard');
        setTimeout(() => {
          const vastuTab = document.querySelector('[data-testid="tab-vastu"]') as HTMLElement;
          if (vastuTab) vastuTab.click();
        }, 100);
      }
    },
    {
      id: 'numerology',
      title: 'Numerology Reading',
      description: 'Discover your numbers destiny',
      icon: Calculator,
      category: 'analysis',
      keywords: ['numerology', 'numbers', 'destiny', 'calculation'],
      action: () => {
        setLocation('/dashboard');
        setTimeout(() => {
          const numerologyTab = document.querySelector('[data-testid="tab-numerology"]') as HTMLElement;
          if (numerologyTab) numerologyTab.click();
        }, 100);
      }
    },
    {
      id: 'tarot-reading',
      title: 'Tarot Reading',
      description: 'Draw cards for spiritual guidance',
      icon: Heart,
      category: 'analysis',
      keywords: ['tarot', 'cards', 'reading', 'guidance'],
      action: () => {
        setLocation('/dashboard');
        setTimeout(() => {
          const tarotTab = document.querySelector('[data-testid="tab-tarot"]') as HTMLElement;
          if (tarotTab) tarotTab.click();
        }, 100);
      }
    },
    
    // Chat Commands
    {
      id: 'ai-chat',
      title: 'Open AI Chat',
      description: 'Start chatting with the mystical AI',
      icon: MessageCircle,
      category: 'chat',
      keywords: ['chat', 'ai', 'talk', 'assistant'],
      action: () => {
        setLocation('/dashboard');
        setTimeout(() => {
          const aiChatTab = document.querySelector('[data-testid="tab-ai-chat"]') as HTMLElement;
          if (aiChatTab) aiChatTab.click();
        }, 100);
      }
    },
    {
      id: 'mystical-guidance',
      title: 'Ask for Guidance',
      description: 'Get spiritual advice and insights',
      icon: Bot,
      category: 'chat',
      keywords: ['guidance', 'advice', 'help', 'spiritual'],
      action: () => {
        setLocation('/dashboard');
        setTimeout(() => {
          const aiChatTab = document.querySelector('[data-testid="tab-ai-chat"]') as HTMLElement;
          if (aiChatTab) aiChatTab.click();
          // Pre-fill with guidance request
          setTimeout(() => {
            const chatInput = document.querySelector('input[placeholder*="Ask"]') as HTMLInputElement;
            if (chatInput) {
              chatInput.value = 'I need spiritual guidance. Can you help me?';
              chatInput.focus();
            }
          }, 200);
        }, 100);
      }
    },
    
    // Account Commands
    {
      id: 'buy-credits',
      title: 'Buy Credits',
      description: 'Purchase credits for AI chat',
      icon: CreditCard,
      category: 'account',
      keywords: ['buy', 'credits', 'purchase', 'payment'],
      action: () => {
        setLocation('/dashboard');
        setTimeout(() => {
          const aiChatTab = document.querySelector('[data-testid="tab-ai-chat"]') as HTMLElement;
          if (aiChatTab) {
            aiChatTab.click();
            // Scroll to payment section
            setTimeout(() => {
              const paymentSection = document.querySelector('[data-testid="payment-plans"]');
              if (paymentSection) {
                paymentSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 200);
          }
        }, 100);
      }
    },
    
    // Help Commands
    {
      id: 'help',
      title: 'Show Help',
      description: 'Get help using MysticRead AI',
      icon: HelpCircle,
      category: 'help',
      keywords: ['help', 'support', 'how to', 'guide'],
      action: () => {
        // Open help dialog or navigate to help section
        alert('Welcome to MysticRead AI! Use voice commands or type to quickly navigate and perform actions. Try saying "analyze palm" or "go to dashboard".');
      }
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      icon: isDarkMode ? Sun : Moon,
      category: 'help',
      keywords: ['theme', 'dark', 'light', 'toggle'],
      action: () => {
        setIsDarkMode(!isDarkMode);
        // Implementation for theme toggle would go here
        document.documentElement.classList.toggle('dark');
      }
    }
  ], [setLocation, isDarkMode]);

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    
    return commands.filter(command =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.keywords.some(keyword => 
        keyword.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [commands, query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const getCategoryIcon = (category: Command['category']) => {
    switch (category) {
      case 'navigation': return Navigation;
      case 'analysis': return Sparkles;
      case 'chat': return MessageCircle;
      case 'account': return CreditCard;
      case 'help': return HelpCircle;
      default: return Search;
    }
  };

  const getCategoryColor = (category: Command['category']) => {
    switch (category) {
      case 'navigation': return 'bg-blue-100 text-blue-700';
      case 'analysis': return 'bg-purple-100 text-purple-700';
      case 'chat': return 'bg-green-100 text-green-700';
      case 'account': return 'bg-orange-100 text-orange-700';
      case 'help': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-gradient-to-b from-purple-50 to-indigo-50 border border-purple-200 shadow-2xl" 
                    onPointerDownOutside={(e) => e.preventDefault()}>
        {/* Mystical Header */}
        <div className="relative p-6 pb-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-t-lg"></div>
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent">
                Mystical Command Palette
              </h2>
              <p className="text-sm text-gray-600">
                Type a command or use voice to navigate MysticRead AI
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or click the mic to speak..."
              className="pl-10 pr-12 py-3 text-base bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
            <Button
              onClick={toggleVoiceRecognition}
              size="sm"
              variant="ghost"
              data-testid="voice-button"
              className={`absolute right-1 top-1 h-8 w-8 rounded-full ${
                isListening 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              {isListening ? (
                <div className="relative">
                  <MicOff className="h-4 w-4" />
                  <div className="absolute inset-0 animate-pulse bg-red-400 rounded-full opacity-30"></div>
                </div>
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {isListening && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Listening for voice command...</span>
              <Zap className="h-4 w-4 animate-bounce" />
            </div>
          )}
        </div>

        {/* Commands List */}
        <ScrollArea className="max-h-96 px-2">
          <div className="px-4 pb-4">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No commands found for "{query}"</p>
                <p className="text-sm text-gray-400 mt-1">Try "palm reading" or "go to dashboard"</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCommands.map((command, index) => {
                  const IconComponent = command.icon;
                  const CategoryIcon = getCategoryIcon(command.category);
                  
                  return (
                    <div
                      key={command.id}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        index === selectedIndex
                          ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300 shadow-md scale-[1.02]'
                          : 'bg-white/60 hover:bg-white/80 border border-gray-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === selectedIndex
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{command.title}</h3>
                          <Badge className={`text-xs ${getCategoryColor(command.category)}`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {command.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{command.description}</p>
                      </div>
                      
                      {command.shortcut && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {command.shortcut}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-purple-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Execute</span>
              <span>ESC Close</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Powered by Mystical AI</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommandPalette;
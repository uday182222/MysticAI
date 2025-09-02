import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Mic, Keyboard } from 'lucide-react';

interface CommandPaletteFABProps {
  onClick: () => void;
}

export function CommandPaletteFAB({ onClick }: CommandPaletteFABProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto-hide tooltip after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              onClick();
              setShowTooltip(false);
            }}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 group"
            data-testid="command-palette-fab"
          >
            <div className="relative">
              <Sparkles className="h-6 w-6 text-white group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <div className="h-3 w-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
              </div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="left" 
          sideOffset={10}
          className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white border-purple-600 shadow-xl max-w-xs"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">Mystical Command Palette</span>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <Keyboard className="h-3 w-3" />
                <span><kbd className="bg-purple-700 px-1 rounded text-xs">Ctrl+K</kbd> to open</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="h-3 w-3" />
                <span><kbd className="bg-purple-700 px-1 rounded text-xs">Ctrl+Shift+M</kbd> for voice</span>
              </div>
            </div>
            <div className="pt-1 border-t border-purple-600">
              <span className="text-xs text-purple-200">Navigate with voice or keyboard!</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
      
      {/* Mystical background glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-20 animate-ping" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-10 animate-pulse" />
    </div>
  );
}
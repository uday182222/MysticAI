import { useState, useEffect } from 'react';

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  // Handle global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Wake word detection for voice activation
      // Could be enhanced with more sophisticated wake word detection
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setIsOpen(true);
        // Automatically start voice recognition when opened with this shortcut
        setTimeout(() => {
          const micButton = document.querySelector('[data-testid="voice-button"]') as HTMLButtonElement;
          if (micButton) {
            micButton.click();
          }
        }, 200);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openPalette = () => setIsOpen(true);
  const closePalette = () => setIsOpen(false);

  return {
    isOpen,
    openPalette,
    closePalette
  };
}
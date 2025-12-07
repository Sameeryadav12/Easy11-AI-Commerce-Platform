'use client';

import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9"
      onClick={toggleTheme}
      aria-label="Toggle color mode"
      disabled={!isReady}
    >
      <Sun
        className={`h-5 w-5 transition-all ${
          theme === 'dark' ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      />
      <MoonStar
        className={`absolute h-5 w-5 transition-all ${
          theme === 'dark' ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}



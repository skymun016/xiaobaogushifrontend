import { useState, useEffect } from 'react';
import { Palette, Check, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { presets, applyTheme } from '@/lib/theme';

export default function ThemeSwitcher() {
  const [activeId, setActiveId] = useState(() => localStorage.getItem('theme-preset') || 'teal');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme-dark') === 'true');

  useEffect(() => {
    const preset = presets.find(p => p.id === activeId) || presets[0];
    applyTheme(preset.colors, isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme-preset', activeId);
    localStorage.setItem('theme-dark', String(isDark));
  }, [activeId, isDark]);

  const selectPreset = (id: string) => {
    setActiveId(id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Palette className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">主题配色</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsDark(!isDark)}
              title={isDark ? '切换亮色' : '切换暗色'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all hover:scale-105',
                  activeId === preset.id
                    ? 'border-primary shadow-sm'
                    : 'border-transparent hover:border-border'
                )}
              >
                <div
                  className="w-full h-10 rounded-md flex overflow-hidden"
                  style={{ background: preset.preview.bg }}
                >
                  <div
                    className="w-3 h-full"
                    style={{ background: preset.preview.sidebar }}
                  />
                  <div className="flex-1 flex items-center justify-center gap-0.5 px-1">
                    <div
                      className="w-4 h-2 rounded-sm"
                      style={{ background: preset.preview.accent }}
                    />
                    <div className="w-6 h-2 rounded-sm bg-gray-300" />
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground leading-none">{preset.name}</span>
                {activeId === preset.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

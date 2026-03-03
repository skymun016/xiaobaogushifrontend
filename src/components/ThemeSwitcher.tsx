import { useState, useEffect } from 'react';
import { Palette, Check, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ThemePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    accent: string;
    sidebarBg: string;
    sidebarFg: string;
    background: string;
  };
  preview: { bg: string; sidebar: string; accent: string };
}

const presets: ThemePreset[] = [
  {
    id: 'default-blue',
    name: '经典蓝',
    colors: {
      primary: '220 70% 45%',
      accent: '35 95% 55%',
      sidebarBg: '220 55% 25%',
      sidebarFg: '220 20% 92%',
      background: '220 25% 92%',
    },
    preview: { bg: '#dce1ea', sidebar: '#1d3461', accent: '#e8a317' },
  },
  {
    id: 'teal',
    name: '青翠绿',
    colors: {
      primary: '172 66% 32%',
      accent: '24 95% 58%',
      sidebarBg: '172 60% 18%',
      sidebarFg: '172 20% 92%',
      background: '170 25% 89%',
    },
    preview: { bg: '#c8ddd9', sidebar: '#123d36', accent: '#f09836' },
  },
  {
    id: 'indigo',
    name: '靛蓝紫',
    colors: {
      primary: '245 58% 51%',
      accent: '340 75% 55%',
      sidebarBg: '255 48% 26%',
      sidebarFg: '245 20% 92%',
      background: '245 22% 92%',
    },
    preview: { bg: '#dddbe9', sidebar: '#2d2362', accent: '#d63b6e' },
  },
  {
    id: 'warm',
    name: '暖橙棕',
    colors: {
      primary: '20 80% 48%',
      accent: '45 90% 50%',
      sidebarBg: '20 55% 24%',
      sidebarFg: '20 20% 92%',
      background: '30 28% 91%',
    },
    preview: { bg: '#e9e2d8', sidebar: '#5e3118', accent: '#d4a616' },
  },
  {
    id: 'slate',
    name: '石墨灰',
    colors: {
      primary: '210 15% 40%',
      accent: '200 70% 50%',
      sidebarBg: '210 25% 24%',
      sidebarFg: '210 15% 88%',
      background: '210 12% 90%',
    },
    preview: { bg: '#d9dcdf', sidebar: '#2e3640', accent: '#2692d4' },
  },
  {
    id: 'rose',
    name: '玫瑰红',
    colors: {
      primary: '350 65% 48%',
      accent: '190 70% 45%',
      sidebarBg: '350 42% 25%',
      sidebarFg: '350 15% 92%',
      background: '350 18% 91%',
    },
    preview: { bg: '#e8d9de', sidebar: '#5b2535', accent: '#1fa8b8' },
  },
];

function applyTheme(colors: ThemePreset['colors'], isDark: boolean) {
  const root = document.documentElement;
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--ring', colors.primary);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--sidebar-background', colors.sidebarBg);
  root.style.setProperty('--sidebar-foreground', colors.sidebarFg);
  root.style.setProperty('--sidebar-primary', colors.primary);

  // Derive sidebar accent from sidebar bg (slightly lighter)
  const parts = colors.sidebarBg.split(' ');
  const hue = parts[0];
  const sat = parseInt(parts[1]);
  const light = parseInt(parts[2]);
  root.style.setProperty('--sidebar-accent', `${hue} ${sat + 5}% ${light + 6}%`);
  root.style.setProperty('--sidebar-border', `${hue} ${sat + 5}% ${light + 8}%`);
  root.style.setProperty('--sidebar-ring', colors.primary);

  if (!isDark) {
    root.style.setProperty('--background', colors.background);
    // Derive card from background (slightly lighter)
    const bgParts = colors.background.split(' ');
    const bgHue = bgParts[0];
    const bgSat = parseInt(bgParts[1]);
    const bgLight = parseInt(bgParts[2]);
    root.style.setProperty('--card', `${bgHue} ${bgSat + 2}% ${Math.min(bgLight + 4, 98)}%`);
    root.style.setProperty('--popover', `${bgHue} ${bgSat + 2}% ${Math.min(bgLight + 4, 98)}%`);
    root.style.setProperty('--muted', `${bgHue} ${Math.max(bgSat - 5, 5)}% ${Math.max(bgLight - 4, 82)}%`);
    // Foreground colors - derive from theme hue for cohesion with good contrast
    root.style.setProperty('--foreground', `${bgHue} ${Math.min(bgSat + 10, 40)}% 12%`);
    root.style.setProperty('--card-foreground', `${bgHue} ${Math.min(bgSat + 10, 40)}% 12%`);
    root.style.setProperty('--popover-foreground', `${bgHue} ${Math.min(bgSat + 10, 40)}% 12%`);
    root.style.setProperty('--muted-foreground', `${bgHue} ${Math.min(bgSat + 5, 25)}% 35%`);
    // Derive chart-1 from primary
    root.style.setProperty('--chart-1', colors.primary.replace(/\d+%$/, (m) => `${parseInt(m) + 5}%`));
  }
}

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
                {/* Mini preview */}
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

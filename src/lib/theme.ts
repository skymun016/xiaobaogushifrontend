export interface ThemePreset {
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

export const presets: ThemePreset[] = [
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

export function applyTheme(colors: ThemePreset['colors'], isDark: boolean) {
  const root = document.documentElement;
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--ring', colors.primary);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--sidebar-background', colors.sidebarBg);
  root.style.setProperty('--sidebar-foreground', colors.sidebarFg);
  root.style.setProperty('--sidebar-primary', colors.primary);

  const parts = colors.sidebarBg.split(' ');
  const hue = parts[0];
  const sat = parseInt(parts[1]);
  const light = parseInt(parts[2]);
  root.style.setProperty('--sidebar-accent', `${hue} ${sat + 5}% ${light + 6}%`);
  root.style.setProperty('--sidebar-border', `${hue} ${sat + 5}% ${light + 8}%`);
  root.style.setProperty('--sidebar-ring', colors.primary);

  if (!isDark) {
    root.style.setProperty('--background', colors.background);
    const bgParts = colors.background.split(' ');
    const bgHue = bgParts[0];
    const bgSat = parseInt(bgParts[1]);
    const bgLight = parseInt(bgParts[2]);
    root.style.setProperty('--card', `${bgHue} ${bgSat + 2}% ${Math.min(bgLight + 4, 98)}%`);
    root.style.setProperty('--popover', `${bgHue} ${bgSat + 2}% ${Math.min(bgLight + 4, 98)}%`);
    root.style.setProperty('--muted', `${bgHue} ${Math.max(bgSat - 5, 5)}% ${Math.max(bgLight - 4, 82)}%`);
    root.style.setProperty('--foreground', `${bgHue} ${Math.min(bgSat + 10, 40)}% 12%`);
    root.style.setProperty('--card-foreground', `${bgHue} ${Math.min(bgSat + 10, 40)}% 12%`);
    root.style.setProperty('--popover-foreground', `${bgHue} ${Math.min(bgSat + 10, 40)}% 12%`);
    root.style.setProperty('--muted-foreground', `${bgHue} ${Math.min(bgSat + 5, 25)}% 35%`);
    root.style.setProperty('--chart-1', colors.primary.replace(/\d+%$/, (m) => `${parseInt(m) + 5}%`));
  }
}

/** Apply saved theme immediately on app startup */
export function initTheme() {
  const savedId = localStorage.getItem('theme-preset') || 'teal';
  const isDark = localStorage.getItem('theme-dark') === 'true';
  const preset = presets.find(p => p.id === savedId) || presets.find(p => p.id === 'teal')!;
  applyTheme(preset.colors, isDark);
  document.documentElement.classList.toggle('dark', isDark);
}

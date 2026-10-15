export type AppCategory = string;

export const DEFAULT_CATEGORIES: string[] = [
  'Productivity',
  'Navigation',
  'Utility',
  'Tools',
  'Health',
  'Media',
];

export interface RayBanApp {
  id: string;
  name: string;
  url: string;
  description?: string;
  category: AppCategory;
  icon: string; // Either a Lucide icon key or a direct favicon/image URL
  color?: string;
  createdAt: number;
  isBuiltIn?: boolean;
}

export type HudColorTheme = 'emerald' | 'monochrome' | 'cyan' | 'amber';

export interface HudThemeConfig {
  id: HudColorTheme;
  name: string;
  primary: string;
  primaryBg: string;
  border: string;
  accent: string;
  dim: string;
  highlightGlow: string;
}

export type GlassesViewScreen = 'launcher' | 'running_app' | 'settings';

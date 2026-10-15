import { HudColorTheme, HudThemeConfig } from '../types/app';

export const HUD_THEMES: Record<HudColorTheme, HudThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'MicroLED Green (High Contrast)',
    primary: 'text-emerald-400',
    primaryBg: 'bg-emerald-950/60',
    border: 'border-emerald-500/40',
    accent: 'text-emerald-300',
    dim: 'text-emerald-500/60',
    highlightGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400 bg-emerald-950/80',
  },
  monochrome: {
    id: 'monochrome',
    name: 'Pure White (Modern Waveguide)',
    primary: 'text-slate-100',
    primaryBg: 'bg-slate-900/80',
    border: 'border-slate-400/40',
    accent: 'text-white',
    dim: 'text-slate-400/70',
    highlightGlow: 'shadow-[0_0_20px_rgba(255,255,255,0.35)] ring-2 ring-slate-100 bg-slate-900/90',
  },
  cyan: {
    id: 'cyan',
    name: 'Aero Cyan (Optical HUD)',
    primary: 'text-cyan-400',
    primaryBg: 'bg-cyan-950/60',
    border: 'border-cyan-500/40',
    accent: 'text-cyan-300',
    dim: 'text-cyan-500/60',
    highlightGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400 bg-cyan-950/80',
  },
  amber: {
    id: 'amber',
    name: 'Night Amber (Low Eyestrain)',
    primary: 'text-amber-400',
    primaryBg: 'bg-amber-950/60',
    border: 'border-amber-500/40',
    accent: 'text-amber-300',
    dim: 'text-amber-500/60',
    highlightGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-2 ring-amber-400 bg-amber-950/80',
  },
};

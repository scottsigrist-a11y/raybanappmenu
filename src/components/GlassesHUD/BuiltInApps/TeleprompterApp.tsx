import React, { useState, useEffect } from 'react';
import { HudThemeConfig } from '../../../types/app';
import { Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';

interface TeleprompterAppProps {
  theme: HudThemeConfig;
  onExit: () => void;
}

const SAMPLE_SCRIPT = [
  "Welcome everyone to the quarterly product keynote.",
  "Today we are demonstrating the 600x600 Ray-Ban display.",
  "Waveguide optics allow optical see-through augmented reality.",
  "Hands-free navigation is powered strictly by D-Pad and temple swipes.",
  "Pagination eliminates awkward continuous scrolling.",
  "Latency is under 15 milliseconds for instant response.",
  "Thank you for attending today's presentation."
];

export const TeleprompterApp: React.FC<TeleprompterAppProps> = ({ theme }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => (prev < SAMPLE_SCRIPT.length - 1 ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Keyboard navigation for inside teleprompter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentLineIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentLineIndex((prev) => Math.min(SAMPLE_SCRIPT.length - 1, prev + 1));
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 select-none bg-black">
      {/* Script reader card */}
      <div className="flex-1 flex flex-col justify-center my-auto">
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-mono-nums">
          PROMPTER LINE {currentLineIndex + 1} OF {SAMPLE_SCRIPT.length}
        </div>
        
        {/* Previous line faint */}
        {currentLineIndex > 0 && (
          <div className="text-sm text-slate-500/70 mb-3 truncate font-medium">
            {SAMPLE_SCRIPT[currentLineIndex - 1]}
          </div>
        )}

        {/* Current focal line */}
        <div className={`p-4 rounded-xl border ${theme.border} ${theme.primaryBg} ${theme.highlightGlow} transition-all duration-150`}>
          <p className={`text-xl font-bold leading-snug ${theme.primary}`}>
            "{SAMPLE_SCRIPT[currentLineIndex]}"
          </p>
        </div>

        {/* Next line preview */}
        {currentLineIndex < SAMPLE_SCRIPT.length - 1 && (
          <div className="text-sm text-slate-500/70 mt-3 truncate font-medium">
            {SAMPLE_SCRIPT[currentLineIndex + 1]}
          </div>
        )}
      </div>

      {/* Prompter Controls Bar */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-nums">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg border ${theme.border} flex items-center gap-1.5 ${isPlaying ? theme.primaryBg : 'bg-slate-900'} ${theme.primary} transition-colors`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'AUTO-PLAY'}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <ChevronUp className="w-3 h-3 text-slate-400" />
            <ChevronDown className="w-3 h-3 text-slate-400" />
            <span>D-Pad Nudge</span>
          </span>
          <span className="text-slate-600">·</span>
          <span>Action: {isPlaying ? 'Pause' : 'Play'}</span>
        </div>
      </div>
    </div>
  );
};

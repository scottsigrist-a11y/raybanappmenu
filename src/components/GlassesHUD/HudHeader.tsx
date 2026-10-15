import React, { useState, useEffect } from 'react';
import { HudThemeConfig } from '../../types/app';
import { BatteryCharging, Wifi, ChevronLeft, ChevronRight } from 'lucide-react';

interface HudHeaderProps {
  theme: HudThemeConfig;
  currentPage: number;
  totalPages: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  showPageControls?: boolean;
}

export const HudHeader: React.FC<HudHeaderProps> = ({
  theme,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  showPageControls = true,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full h-14 px-6 flex items-center justify-between border-b border-slate-900 bg-black/90 select-none z-20 shrink-0">
      {/* Left: Time and Wireless */}
      <div className="flex items-center gap-3">
        <span className={`text-base font-bold font-mono-nums tracking-wider ${theme.primary} waveguide-glow`}>
          {timeStr || '12:00'}
        </span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Wifi className="w-3.5 h-3.5" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Center: Page indicator with swipe arrow cues */}
      {showPageControls && totalPages > 1 ? (
        <div className="flex items-center gap-1.5 font-mono-nums text-xs">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 0}
            aria-label="Previous Page"
            className={`p-1 rounded transition-colors ${
              currentPage > 0
                ? `${theme.primary} hover:bg-slate-900 cursor-pointer`
                : 'text-slate-700 cursor-not-allowed opacity-30'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-200 ${
                  i === currentPage
                    ? `w-4 h-1.5 rounded-full bg-current ${theme.primary}`
                    : 'w-1.5 h-1.5 rounded-full bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next Page"
            className={`p-1 rounded transition-colors ${
              currentPage < totalPages - 1
                ? `${theme.primary} hover:bg-slate-900 cursor-pointer`
                : 'text-slate-700 cursor-not-allowed opacity-30'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-xs font-mono-nums tracking-widest text-slate-500">
          RAY-BAN DISPLAY
        </div>
      )}

      {/* Right: Battery indicator */}
      <div className="flex items-center gap-1.5 font-mono-nums text-xs text-slate-400">
        <span className="font-semibold text-slate-300">84%</span>
        <BatteryCharging className="w-4 h-4 text-emerald-400" />
      </div>
    </header>
  );
};

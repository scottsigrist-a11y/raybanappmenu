import React, { useState, useEffect } from 'react';
import { HudThemeConfig } from '../../../types/app';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerAppProps {
  theme: HudThemeConfig;
  onExit: () => void;
}

export const TimerApp: React.FC<TimerAppProps> = ({ theme }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsRunning((r) => !r);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Record lap
        setLaps((prev) => [seconds, ...prev.slice(0, 2)]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Reset
        setIsRunning(false);
        setSeconds(0);
        setLaps([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [seconds]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 select-none bg-black text-white">
      <div className="flex items-center justify-between text-xs font-mono-nums text-slate-400">
        <span>HUD INTERVAL STOPWATCH</span>
        <span className={isRunning ? theme.primary : 'text-slate-500'}>
          {isRunning ? 'ACTIVE RUNNING' : 'PAUSED'}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center my-auto">
        <div className={`text-6xl font-black font-mono-nums tracking-wider ${theme.primary} waveguide-glow`}>
          {formatTime(seconds)}
        </div>

        {/* Action button in HUD */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-5 py-2 rounded-xl border ${theme.border} ${theme.primaryBg} ${theme.primary} font-bold text-sm flex items-center gap-2`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'PAUSE' : 'START'}</span>
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setSeconds(0);
              setLaps([]);
            }}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-sm flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>

        {/* Laps list */}
        {laps.length > 0 && (
          <div className="w-full max-w-xs mt-6 space-y-1 font-mono-nums text-xs">
            {laps.map((lap, i) => (
              <div key={i} className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                <span>LAP {laps.length - i}</span>
                <span className={theme.primary}>{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono-nums text-slate-400">
        <span>Enter: Start/Pause</span>
        <span>↓ D-Pad: Lap</span>
        <span>↑ D-Pad: Reset</span>
      </div>
    </div>
  );
};

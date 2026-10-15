import React, { useState, useEffect } from 'react';
import { HudThemeConfig } from '../../../types/app';
import { Navigation, Footprints } from 'lucide-react';

interface CompassAppProps {
  theme: HudThemeConfig;
  onExit: () => void;
}

export const CompassApp: React.FC<CompassAppProps> = ({ theme }) => {
  const [heading, setHeading] = useState(42);
  const [steps, setSteps] = useState(1420);

  useEffect(() => {
    // Subtle realistic wander for magnetic heading simulation
    const interval = setInterval(() => {
      setHeading((prev) => (prev + (Math.floor(Math.random() * 3) - 1) + 360) % 360);
      setSteps((s) => s + (Math.random() > 0.6 ? 1 : 0));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const getCardinal = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 select-none bg-black text-white">
      {/* Compass Dial Header */}
      <div className="flex items-center justify-between text-xs font-mono-nums text-slate-400">
        <span>MAGNETIC AZIMUTH</span>
        <span className={theme.primary}>CALIBRATED 3-AXIS</span>
      </div>

      {/* Main Dial View */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Compass ring */}
          <div className={`absolute inset-0 rounded-full border-2 ${theme.border} opacity-40`} />
          <div className={`absolute inset-2 rounded-full border border-dashed ${theme.border} opacity-30`} />

          {/* Heading Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotate(${heading}deg)` }}
          >
            <div className="w-1.5 h-20 bg-gradient-to-t from-transparent via-rose-500 to-rose-400 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.8)] -translate-y-8" />
          </div>

          {/* Center readout */}
          <div className="flex flex-col items-center justify-center z-10">
            <Navigation className={`w-6 h-6 ${theme.primary} mb-1`} />
            <div className={`text-4xl font-bold font-mono-nums tracking-tight ${theme.primary}`}>
              {heading.toString().padStart(3, '0')}°
            </div>
            <div className="text-sm font-semibold tracking-widest text-slate-300 mt-0.5">
              {getCardinal(heading)}
            </div>
          </div>
        </div>

        {/* Waypoint distance banner */}
        <div className={`mt-6 w-full max-w-xs p-3 rounded-xl border ${theme.border} ${theme.primaryBg} flex items-center justify-between text-xs font-mono-nums`}>
          <div className="flex items-center gap-2">
            <Footprints className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">WALKING CADENCE</span>
          </div>
          <span className={`font-bold ${theme.primary}`}>{steps.toLocaleString()} STEPS</span>
        </div>
      </div>

      {/* Bottom status */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono-nums text-slate-400">
        <span>WAYPOINT: MAIN ENTRANCE</span>
        <span className={theme.primary}>0.3 MI · 5 MIN</span>
      </div>
    </div>
  );
};

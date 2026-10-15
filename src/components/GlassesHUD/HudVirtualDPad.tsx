import React, { useRef, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CornerDownLeft, RotateCcw } from 'lucide-react';
import { HudThemeConfig } from '../../types/app';

interface HudVirtualDPadProps {
  theme: HudThemeConfig;
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onSelect: () => void;
  onBack: () => void;
}

export const HudVirtualDPad: React.FC<HudVirtualDPadProps> = ({
  theme,
  onUp,
  onDown,
  onLeft,
  onRight,
  onSelect,
  onBack,
}) => {
  const [touchFeedback, setTouchFeedback] = useState<string>('Ready for gestures');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchpadPointerDown = (e: React.PointerEvent) => {
    touchStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchpadPointerUp = (e: React.PointerEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.clientX - touchStartRef.current.x;
    const dy = e.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX < 15 && absY < 15) {
      // Tap
      setTouchFeedback('Temple Tap: Select');
      onSelect();
    } else if (absX > absY && absX > 25) {
      if (dx > 0) {
        setTouchFeedback('Swipe Forward: Prev Page');
        onLeft();
      } else {
        setTouchFeedback('Swipe Backward: Next Page');
        onRight();
      }
    } else if (absY > 25) {
      if (dy > 0) {
        setTouchFeedback('Swipe Down: Cursor Down');
        onDown();
      } else {
        setTouchFeedback('Swipe Up: Cursor Up');
        onUp();
      }
    }

    setTimeout(() => {
      setTouchFeedback('Temple Touchpad');
    }, 1400);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono-nums font-bold text-slate-300">
          RAY-BAN GLASSES CONTROLS (D-PAD & TEMPLE SWIPE)
        </span>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[11px] font-mono-nums text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80"
        >
          <RotateCcw className="w-3 h-3" />
          <span>ESC / Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Physical D-Pad */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Up Button */}
            <button
              onClick={onUp}
              aria-label="D-Pad Up"
              className="absolute top-0 w-11 h-11 rounded-t-xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-200 flex items-center justify-center border border-slate-700 transition-colors"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {/* Down Button */}
            <button
              onClick={onDown}
              aria-label="D-Pad Down"
              className="absolute bottom-0 w-11 h-11 rounded-b-xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-200 flex items-center justify-center border border-slate-700 transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* Left Button (Page Prev) */}
            <button
              onClick={onLeft}
              aria-label="D-Pad Left (Previous Page)"
              className="absolute left-0 w-11 h-11 rounded-l-xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-200 flex items-center justify-center border border-slate-700 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Button (Page Next) */}
            <button
              onClick={onRight}
              aria-label="D-Pad Right (Next Page)"
              className="absolute right-0 w-11 h-11 rounded-r-xl bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-200 flex items-center justify-center border border-slate-700 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Center Action Button */}
            <button
              onClick={onSelect}
              aria-label="D-Pad Select / Launch"
              className={`w-12 h-12 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold flex items-center justify-center shadow-lg transition-transform`}
              title="Select / Launch App"
            >
              <CornerDownLeft className="w-5 h-5" />
            </button>
          </div>
          <span className="text-[10px] font-mono-nums text-slate-500 mt-2">
            ↑/↓: Cursor · ←/→: Flip Page · Center: Launch
          </span>
        </div>

        {/* Temple Touchpad Emulation */}
        <div className="flex flex-col items-center justify-center h-full">
          <div
            onPointerDown={handleTouchpadPointerDown}
            onPointerUp={handleTouchpadPointerUp}
            className="w-full h-28 rounded-xl border border-slate-700/80 bg-slate-950/80 hover:border-emerald-500/50 flex flex-col items-center justify-center p-3 cursor-grab active:cursor-grabbing text-center touch-none transition-colors"
          >
            <div className="text-xs font-mono-nums font-semibold text-slate-300">
              {touchFeedback}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
              Swipe ← / → for Page Turn
              <br />
              Tap to Launch · Swipe ↑ / ↓ to Select
            </p>
          </div>
          <span className="text-[10px] font-mono-nums text-slate-500 mt-2">
            Simulates Right Temple Touchpad
          </span>
        </div>
      </div>
    </div>
  );
};

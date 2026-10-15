import React, { useState, useEffect, useRef } from 'react';
import { RayBanApp, HudColorTheme } from '../../types/app';
import { HUD_THEMES } from '../../utils/theme';
import { HudHeader } from './HudHeader';
import { HudMenuPage } from './HudMenuPage';
import { HudActiveApp } from './HudActiveApp';
import { HudVirtualDPad } from './HudVirtualDPad';
import { Glasses, Sliders, Maximize2, Minimize2 } from 'lucide-react';

interface GlassesContainerProps {
  apps: RayBanApp[];
  themeKey?: HudColorTheme;
  onChangeTheme?: (theme: HudColorTheme) => void;
  showVirtualController?: boolean;
  standalone?: boolean;
}

const PAGE_SIZE = 4;

export const GlassesContainer: React.FC<GlassesContainerProps> = ({
  apps,
  themeKey = 'emerald',
  onChangeTheme,
  showVirtualController = true,
  standalone = false,
}) => {
  const theme = HUD_THEMES[themeKey] || HUD_THEMES.emerald;

  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeApp, setActiveApp] = useState<RayBanApp | null>(null);
  const [showLensFrame, setShowLensFrame] = useState(!standalone);
  const [isDpadVisible, setIsDpadVisible] = useState(showVirtualController);

  const totalPages = Math.max(1, Math.ceil(apps.length / PAGE_SIZE));

  // Ensure page is within bounds when apps list changes
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
      setSelectedIndex(0);
    }
  }, [totalPages, currentPage]);

  const startIndex = currentPage * PAGE_SIZE;
  const currentApps = apps.slice(startIndex, startIndex + PAGE_SIZE);

  // Ensure selectedIndex is within current page apps
  useEffect(() => {
    if (selectedIndex >= currentApps.length && currentApps.length > 0) {
      setSelectedIndex(currentApps.length - 1);
    }
  }, [currentApps.length, selectedIndex]);

  // Touch & Swipe gesture handling directly on the 600x600 screen
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!touchStartPos.current) return;
    const dx = e.clientX - touchStartPos.current.x;
    const dy = e.clientY - touchStartPos.current.y;
    touchStartPos.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // If swipe distance is substantial (> 35px)
    if (absX > absY && absX > 35) {
      if (dx < 0) {
        // Swiped Left -> Next page
        handleNextPage();
      } else {
        // Swiped Right -> Previous page
        handlePrevPage();
      }
    } else if (absY > 35) {
      if (dy > 0) {
        // Swiped Down -> Next item
        handleDown();
      } else {
        // Swiped Up -> Prev item
        handleUp();
      }
    }
  };

  // Navigation handlers
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
      setSelectedIndex(0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      setSelectedIndex(0);
    }
  };

  const handleUp = () => {
    if (activeApp) return;
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, currentApps.length - 1)));
  };

  const handleDown = () => {
    if (activeApp) return;
    setSelectedIndex((prev) => (prev < currentApps.length - 1 ? prev + 1 : 0));
  };

  const handleSelect = () => {
    if (activeApp) return;
    const targetApp = currentApps[selectedIndex];
    if (targetApp) {
      setActiveApp(targetApp);
    }
  };

  const handleBack = () => {
    if (activeApp) {
      setActiveApp(null);
    }
  };

  // Keyboard navigation for Meta Ray-Ban display
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused in desktop mode
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDown();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, currentApps, selectedIndex, activeApp]);

  return (
    <div className="flex flex-col items-center">
      {/* Top HUD Simulator Bar */}
      <div className="w-[600px] flex items-center justify-between pb-3 text-xs font-mono-nums text-slate-400">
        <div className="flex items-center gap-2">
          <Glasses className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">META RAY-BAN DISPLAY</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400">600×600 MICRO-LED</span>
        </div>

        <div className="flex items-center gap-3">
          {onChangeTheme && (
            <div className="flex items-center gap-1">
              {(['emerald', 'monochrome', 'cyan', 'amber'] as HudColorTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => onChangeTheme(t)}
                  title={`HUD Mode: ${t}`}
                  className={`w-3.5 h-3.5 rounded-full border ${
                    themeKey === t ? 'border-white scale-110 ring-2 ring-emerald-400/50' : 'border-transparent opacity-60 hover:opacity-100'
                  } ${
                    t === 'emerald'
                      ? 'bg-emerald-500'
                      : t === 'monochrome'
                      ? 'bg-slate-200'
                      : t === 'cyan'
                      ? 'bg-cyan-400'
                      : 'bg-amber-400'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setShowLensFrame(!showLensFrame)}
            className="text-[11px] hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
            title="Toggle Glasses Frame silhouette"
          >
            {showLensFrame ? 'Frame: ON' : 'Frame: RAW'}
          </button>

          <button
            onClick={() => setIsDpadVisible(!isDpadVisible)}
            className="text-[11px] hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
            title="Toggle On-screen D-Pad"
          >
            {isDpadVisible ? 'D-Pad: ON' : 'D-Pad: HIDE'}
          </button>
        </div>
      </div>

      {/* The Meta Ray-Ban Eyewear Frame Simulation Wrapper */}
      <div
        className={`relative transition-all duration-200 ${
          showLensFrame
            ? 'p-5 bg-gradient-to-b from-stone-900 to-black rounded-[48px] border-4 border-stone-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] ring-1 ring-stone-700/60'
            : 'p-0'
        }`}
      >
        {/* Eyewear frame details: top Ray-Ban hinge accent */}
        {showLensFrame && (
          <div className="absolute top-2 left-10 flex items-center gap-1.5 opacity-60">
            <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase font-mono-nums">
              Ray·Ban | Meta
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-stone-600" />
          </div>
        )}

        {/* STRICT 600x600 DISPLAY CONTAINER - NO SCROLLING */}
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="rayban-viewport-600 w-[600px] h-[600px] min-w-[600px] max-w-[600px] min-h-[600px] max-h-[600px] bg-black text-white rounded-[24px] border border-slate-900 overflow-hidden flex flex-col relative shadow-2xl select-none"
          style={{ width: '600px', height: '600px' }}
        >
          {activeApp ? (
            <HudActiveApp app={activeApp} theme={theme} onExit={handleBack} />
          ) : (
            <>
              <HudHeader
                theme={theme}
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
              />
              <HudMenuPage
                apps={currentApps}
                selectedIndex={selectedIndex}
                theme={theme}
                onSelectIndex={setSelectedIndex}
                onLaunchApp={setActiveApp}
                pageNumber={currentPage}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
              />
            </>
          )}

          {/* Optical Waveguide Subtle Reticle Corner Guides */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-800 pointer-events-none opacity-40" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-slate-800 pointer-events-none opacity-40" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-slate-800 pointer-events-none opacity-40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-800 pointer-events-none opacity-40" />
        </div>
      </div>

      {/* D-Pad and Swipe Controller below display */}
      {isDpadVisible && (
        <div className="w-[600px] mt-4">
          <HudVirtualDPad
            theme={theme}
            onUp={handleUp}
            onDown={handleDown}
            onLeft={handlePrevPage}
            onRight={handleNextPage}
            onSelect={handleSelect}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
};

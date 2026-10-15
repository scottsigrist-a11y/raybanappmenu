import React from 'react';
import { RayBanApp, HudThemeConfig } from '../../types/app';
import { AppIcon } from '../common/AppIcon';
import { ChevronRight } from 'lucide-react';

interface HudMenuPageProps {
  apps: RayBanApp[];
  selectedIndex: number;
  theme: HudThemeConfig;
  onSelectIndex: (index: number) => void;
  onLaunchApp: (app: RayBanApp) => void;
  pageNumber: number;
  totalPages: number;
  pageSize: number;
}

export const HudMenuPage: React.FC<HudMenuPageProps> = ({
  apps,
  selectedIndex,
  theme,
  onSelectIndex,
  onLaunchApp,
  pageNumber,
  totalPages,
  pageSize,
}) => {
  if (apps.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black">
        <div className={`p-4 rounded-2xl border ${theme.border} ${theme.primaryBg} mb-4`}>
          <AppIcon name="Layers" className={`w-10 h-10 ${theme.primary}`} />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">No Apps Installed</h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Add web applications from the Desktop Browser display. They will instantly sync here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-black select-none overflow-hidden">
      {/* Page Title & Category Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-900/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-nums font-bold tracking-widest text-slate-400">
            PAGE {pageNumber + 1} OF {totalPages}
          </span>
          <span className="text-slate-700">/</span>
          <span className={`text-xs font-mono-nums uppercase ${theme.primary}`}>
            {apps.length} {apps.length === 1 ? 'APP' : 'APPS'}
          </span>
        </div>

        <div className="text-[11px] font-mono-nums text-slate-500">
          D-PAD ↑/↓ TO NAVIGATE
        </div>
      </div>

      {/* App list cards: exactly 4 slots engineered for 600x600 without overflow */}
      <div className="flex-1 flex flex-col justify-center gap-3 my-auto py-2">
        {apps.map((app, idx) => {
          const isSelected = idx === selectedIndex;
          const globalNumber = pageNumber * pageSize + idx + 1;

          return (
            <div
              key={app.id}
              onClick={() => {
                if (isSelected) {
                  onLaunchApp(app);
                } else {
                  onSelectIndex(idx);
                }
              }}
              onDoubleClick={() => onLaunchApp(app)}
              className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? `${theme.border} ${theme.primaryBg} ${theme.highlightGlow} scale-[1.01]`
                  : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/30'
              }`}
            >
              {/* Left: Index badge + Icon + Details */}
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <span
                  className={`text-xs font-mono-nums font-bold px-1.5 py-0.5 rounded border transition-colors ${
                    isSelected
                      ? `border-current ${theme.primary} bg-black/40`
                      : 'border-slate-800 text-slate-500 bg-slate-900/40'
                  }`}
                >
                  {globalNumber.toString().padStart(2, '0')}
                </span>

                <div
                  className={`w-9 h-9 rounded-lg border transition-colors shrink-0 flex items-center justify-center p-1.5 ${
                    isSelected
                      ? `border-current ${theme.primary} bg-black/50`
                      : 'border-slate-800 text-slate-400 bg-slate-900/60'
                  }`}
                >
                  <AppIcon name={app.icon} className="w-5 h-5" isHudWaveguide={true} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-semibold truncate ${
                        isSelected ? theme.primary : 'text-slate-100'
                      }`}
                    >
                      {app.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate mt-0.5 max-w-[340px]">
                    <span className="text-slate-300 font-mono-nums font-medium">{app.category}</span>
                    <span>·</span>
                    <span className="truncate">{app.description || app.url}</span>
                  </div>
                </div>
              </div>

              {/* Right: Launch Cue */}
              <div className="flex items-center gap-1 shrink-0 pl-2">
                {isSelected ? (
                  <div className={`flex items-center gap-1 text-xs font-mono-nums font-bold ${theme.primary}`}>
                    <span>LAUNCH</span>
                    <ChevronRight className="w-4 h-4 animate-pulse" />
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation cues banner at bottom */}
      <div className="pt-3 border-t border-slate-900/90 flex items-center justify-between text-[11px] font-mono-nums text-slate-400">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
            ENTER / TAP
          </span>
          <span>Open App</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
            SWIPE ← / →
          </span>
          <span>Switch Page</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { RayBanApp, HudThemeConfig } from '../../types/app';
import { TeleprompterApp } from './BuiltInApps/TeleprompterApp';
import { CompassApp } from './BuiltInApps/CompassApp';
import { TimerApp } from './BuiltInApps/TimerApp';
import { ChecklistApp } from './BuiltInApps/ChecklistApp';
import { ArrowLeft, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

interface HudActiveAppProps {
  app: RayBanApp;
  theme: HudThemeConfig;
  onExit: () => void;
}

export const HudActiveApp: React.FC<HudActiveAppProps> = ({ app, theme, onExit }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Render built-in apps if URL matches builtin scheme
  if (app.url === 'builtin:teleprompter') {
    return (
      <div className="w-full h-full flex flex-col bg-black overflow-hidden">
        <HudAppTopBar app={app} theme={theme} onExit={onExit} />
        <div className="flex-1 overflow-hidden">
          <TeleprompterApp theme={theme} onExit={onExit} />
        </div>
      </div>
    );
  }

  if (app.url === 'builtin:compass') {
    return (
      <div className="w-full h-full flex flex-col bg-black overflow-hidden">
        <HudAppTopBar app={app} theme={theme} onExit={onExit} />
        <div className="flex-1 overflow-hidden">
          <CompassApp theme={theme} onExit={onExit} />
        </div>
      </div>
    );
  }

  if (app.url === 'builtin:timer') {
    return (
      <div className="w-full h-full flex flex-col bg-black overflow-hidden">
        <HudAppTopBar app={app} theme={theme} onExit={onExit} />
        <div className="flex-1 overflow-hidden">
          <TimerApp theme={theme} onExit={onExit} />
        </div>
      </div>
    );
  }

  if (app.url === 'builtin:checklist') {
    return (
      <div className="w-full h-full flex flex-col bg-black overflow-hidden">
        <HudAppTopBar app={app} theme={theme} onExit={onExit} />
        <div className="flex-1 overflow-hidden">
          <ChecklistApp theme={theme} onExit={onExit} />
        </div>
      </div>
    );
  }

  // Otherwise, render web app inside 600x600 iframe
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      <HudAppTopBar app={app} theme={theme} onExit={onExit} isExternal />

      <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black">
            <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
            <h4 className="text-sm font-bold text-slate-100 mb-1">Frame Access Notice</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
              This external site may restrict embedded iframe previews via X-Frame-Options or CSP headers.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={app.url}
                target="_blank"
                rel="noreferrer noopener"
                className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.primaryBg} ${theme.primary} font-bold text-xs flex items-center gap-2`}
              >
                <span>Launch in Full Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  setHasError(false);
                  setIframeKey((k) => k + 1);
                }}
                className="px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-300 hover:bg-slate-900"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={app.url}
            title={app.name}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
};

interface HudAppTopBarProps {
  app: RayBanApp;
  theme: HudThemeConfig;
  onExit: () => void;
  isExternal?: boolean;
}

const HudAppTopBar: React.FC<HudAppTopBarProps> = ({ app, theme, onExit, isExternal }) => {
  return (
    <div className="w-full h-11 px-4 flex items-center justify-between border-b border-slate-900 bg-black text-white shrink-0 z-30 select-none">
      {/* Back button */}
      <button
        onClick={onExit}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono-nums ${theme.primary} hover:bg-slate-900 transition-colors`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK (ESC)</span>
      </button>

      {/* App title */}
      <div className="flex items-center gap-2 min-w-0 px-2">
        <span className="text-xs font-bold font-mono-nums text-slate-200 truncate">
          {app.name}
        </span>
      </div>

      {/* External action / status */}
      <div className="flex items-center gap-2">
        {isExternal && (
          <a
            href={app.url}
            target="_blank"
            rel="noreferrer noopener"
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

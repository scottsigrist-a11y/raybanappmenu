import React from 'react';
import { Plus, Glasses, Monitor, BookOpen, Download } from 'lucide-react';

interface DesktopNavbarProps {
  activeTab: 'directory' | 'simulator' | 'specs';
  onSelectTab: (tab: 'directory' | 'simulator' | 'specs') => void;
  onAddApp: () => void;
  onOpenPureGlassesMode: () => void;
  onExport: () => void;
}

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  activeTab,
  onSelectTab,
  onAddApp,
  onOpenPureGlassesMode,
  onExport,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('directory');
        }}
        className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 rotate-45" />
        <span>RayLauncher</span>
      </a>

      {/* Zone 2: Concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('directory')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'directory' ? 'text-slate-100 font-semibold underline underline-offset-8 decoration-emerald-400' : ''
          }`}
        >
          App Directory
        </button>
        <button
          onClick={() => onSelectTab('simulator')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'simulator' ? 'text-slate-100 font-semibold underline underline-offset-8 decoration-emerald-400' : ''
          }`}
        >
          <Glasses className="w-4 h-4 text-emerald-400" />
          <span>Glasses HUD</span>
        </button>
        <button
          onClick={() => onSelectTab('specs')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'specs' ? 'text-slate-100 font-semibold underline underline-offset-8 decoration-emerald-400' : ''
          }`}
        >
          600×600 Specs
        </button>
        <button
          onClick={onOpenPureGlassesMode}
          className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 text-emerald-400"
          title="Open Pure 600x600 Glasses HUD Mode"
        >
          Pure Glasses View
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          title="Export Apps JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
        <button
          onClick={onAddApp}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { RayBanApp, HudColorTheme, DEFAULT_CATEGORIES } from './types/app';
import {
  loadApps,
  saveApps,
  subscribeToAppsUpdates,
  loadCategories,
  saveCategories,
  subscribeToCategoriesUpdates,
  loadTheme,
  saveTheme,
  subscribeToThemeUpdates,
} from './utils/storage';
import { DEFAULT_APPS } from './data/defaultApps';
import { DesktopNavbar } from './components/DesktopManager/DesktopNavbar';
import { AppList } from './components/DesktopManager/AppList';
import { AppModal } from './components/DesktopManager/AppModal';
import { SpecsDrawer } from './components/DesktopManager/SpecsDrawer';
import { GlassesContainer } from './components/GlassesHUD/GlassesContainer';
import {
  Glasses,
  RotateCcw,
  Check,
} from 'lucide-react';

export default function App() {
  const [apps, setApps] = useState<RayBanApp[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [themeKey, setThemeKey] = useState<HudColorTheme>('emerald');
  const [activeTab, setActiveTab] = useState<'directory' | 'simulator' | 'specs'>('directory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<RayBanApp | null>(null);
  const [showSidePreview, setShowSidePreview] = useState(true);
  const [isPureGlassesMode, setIsPureGlassesMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize apps, categories, and check URL param (?view=glasses)
  useEffect(() => {
    setApps(loadApps());
    setCategories(loadCategories());
    setThemeKey(loadTheme());

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'glasses') {
        setIsPureGlassesMode(true);
      }
    }

    const unsubApps = subscribeToAppsUpdates((updatedApps) => {
      setApps(updatedApps);
    });

    const unsubCategories = subscribeToCategoriesUpdates((updatedCategories) => {
      setCategories(updatedCategories);
    });

    const unsubTheme = subscribeToThemeUpdates((updatedTheme) => {
      setThemeKey(updatedTheme);
    });

    return () => {
      unsubApps();
      unsubCategories();
      unsubTheme();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddCategory = (newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (!categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...categories, trimmed];
      setCategories(updated);
      saveCategories(updated);
      showToast(`Added custom category "${trimmed}"`);
    }
  };

  const handleSaveApp = (
    appData: Omit<RayBanApp, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    // If the app has a new category not in categories list, register it
    if (appData.category) {
      handleAddCategory(appData.category);
    }

    let newApps: RayBanApp[];
    if (existingId) {
      newApps = apps.map((app) =>
        app.id === existingId ? { ...app, ...appData } : app
      );
      showToast(`Updated "${appData.name}"`);
    } else {
      const newApp: RayBanApp = {
        ...appData,
        id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: Date.now(),
      };
      newApps = [...apps, newApp];
      showToast(`Added "${appData.name}" to Glasses`);
    }
    setApps(newApps);
    saveApps(newApps);
  };

  const handleDeleteApp = (appId: string) => {
    const target = apps.find((a) => a.id === appId);
    const newApps = apps.filter((app) => app.id !== appId);
    setApps(newApps);
    saveApps(newApps);
    if (target) {
      showToast(`Deleted "${target.name}"`);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newApps = [...apps];
    const temp = newApps[index - 1];
    newApps[index - 1] = newApps[index];
    newApps[index] = temp;
    setApps(newApps);
    saveApps(newApps);
  };

  const handleMoveDown = (index: number) => {
    if (index >= apps.length - 1) return;
    const newApps = [...apps];
    const temp = newApps[index + 1];
    newApps[index + 1] = newApps[index];
    newApps[index] = temp;
    setApps(newApps);
    saveApps(newApps);
  };

  const handleThemeChange = (newTheme: HudColorTheme) => {
    setThemeKey(newTheme);
    saveTheme(newTheme);
  };

  const handleExport = () => {
    const exportData = {
      apps,
      categories,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rayban-apps-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported apps configuration to JSON');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all apps and categories to original Meta Ray-Ban defaults?')) {
      setApps(DEFAULT_APPS);
      saveApps(DEFAULT_APPS);
      setCategories(DEFAULT_CATEGORIES);
      saveCategories(DEFAULT_CATEGORIES);
      showToast('Reset to default apps');
    }
  };

  // Pure 600x600 Glasses HUD Mode (no desktop chrome, centered in black field)
  if (isPureGlassesMode) {
    return (
      <div className="w-screen h-screen min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden relative select-none">
        {/* Floating exit control for pure mode */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
          <button
            onClick={() => {
              setIsPureGlassesMode(false);
              const url = new URL(window.location.href);
              url.searchParams.delete('view');
              window.history.pushState({}, '', url.toString());
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Switch to Desktop Dashboard
          </button>
        </div>

        <GlassesContainer
          apps={apps}
          themeKey={themeKey}
          onChangeTheme={handleThemeChange}
          showVirtualController={true}
          standalone={true}
        />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(apps.length / 4));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <DesktopNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onAddApp={() => {
          setEditingApp(null);
          setIsModalOpen(true);
        }}
        onOpenPureGlassesMode={() => setIsPureGlassesMode(true)}
        onExport={handleExport}
      />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section & Metrics Strip */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono-nums text-emerald-400 font-semibold tracking-wider uppercase mb-1 flex items-center gap-2">
                <span>WEARABLE APP RUNTIME</span>
                <span className="text-slate-600">·</span>
                <span>METARAY-BAN HUD SPEC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
                Meta Ray-Ban Display App Hub
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Configure web applications on desktop with auto-detected website favicons and custom categories. On glasses, apps render in a strict 600×600 micro-display with D-pad navigation and zero-scroll swipe pagination.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetDefaults}
                className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={() => setIsPureGlassesMode(true)}
                className="px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/60 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Glasses className="w-4 h-4" />
                <span>Launch Pure 600×600 Mode</span>
              </button>
            </div>
          </div>

          {/* 4-Column KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Installed Apps</span>
              <div className="text-2xl font-bold font-mono-nums text-slate-100 mt-1">
                {apps.length}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">{categories.length} Categories configured</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">HUD Pagination</span>
              <div className="text-2xl font-bold font-mono-nums text-emerald-400 mt-1">
                {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Swipe Left / Right to flip</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Display Resolution</span>
              <div className="text-2xl font-bold font-mono-nums text-slate-100 mt-1">
                600×600 px
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Strict zero-scrolling spec</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Input Method</span>
              <div className="text-2xl font-bold font-mono-nums text-slate-100 mt-1">
                D-Pad + Swipe
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Temple touchpad gestures</span>
            </div>
          </div>
        </div>

        {/* Tab 1: App Directory with optional side-by-side Glasses preview */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-200">
                Managed Applications
              </h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidePreview(!showSidePreview)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
                    showSidePreview
                      ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Glasses className="w-3.5 h-3.5" />
                  <span>{showSidePreview ? 'Side Preview: ON' : 'Side Preview: OFF'}</span>
                </button>
              </div>
            </div>

            {/* Split layout when Side Preview is ON */}
            <div className={`grid gap-8 ${showSidePreview ? 'grid-cols-1 xl:grid-cols-12' : 'grid-cols-1'}`}>
              <div className={showSidePreview ? 'xl:col-span-6' : 'w-full'}>
                <AppList
                  apps={apps}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onEditApp={(app) => {
                    setEditingApp(app);
                    setIsModalOpen(true);
                  }}
                  onDeleteApp={handleDeleteApp}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onAddApp={() => {
                    setEditingApp(null);
                    setIsModalOpen(true);
                  }}
                  onLaunchInSimulator={(app) => {
                    setActiveTab('simulator');
                  }}
                />
              </div>

              {showSidePreview && (
                <div className="xl:col-span-6 flex flex-col items-center">
                  <div className="sticky top-24 w-full flex flex-col items-center">
                    <GlassesContainer
                      apps={apps}
                      themeKey={themeKey}
                      onChangeTheme={handleThemeChange}
                      showVirtualController={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Dedicated Full Simulator Focus */}
        {activeTab === 'simulator' && (
          <div className="flex flex-col items-center justify-center py-6">
            <GlassesContainer
              apps={apps}
              themeKey={themeKey}
              onChangeTheme={handleThemeChange}
              showVirtualController={true}
            />
          </div>
        )}

        {/* Tab 3: Meta Ray-Ban Specs */}
        {activeTab === 'specs' && <SpecsDrawer />}
      </main>

      {/* Add / Edit App Modal */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
        editingApp={editingApp}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}

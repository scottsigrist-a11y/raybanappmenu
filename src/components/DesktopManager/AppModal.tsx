import React, { useState, useEffect } from 'react';
import { RayBanApp } from '../../types/app';
import { AVAILABLE_ICONS, AppIcon } from '../common/AppIcon';
import { getFaviconUrl, extractDomain } from '../../utils/favicon';
import { X, Globe, Plus, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Omit<RayBanApp, 'id' | 'createdAt'>, existingId?: string) => void;
  editingApp?: RayBanApp | null;
  categories: string[];
  onAddCategory: (categoryName: string) => void;
}

const PRESET_URLS = [
  { label: 'Built-in Prompter', url: 'builtin:teleprompter', icon: 'FileText', name: 'HUD Teleprompter', category: 'Productivity' },
  { label: 'Built-in Compass', url: 'builtin:compass', icon: 'Compass', name: 'Waypoint Compass', category: 'Navigation' },
  { label: 'Built-in Timer', url: 'builtin:timer', icon: 'Timer', name: 'Interval Stopwatch', category: 'Utility' },
  { label: 'Built-in Checklist', url: 'builtin:checklist', icon: 'CheckSquare', name: 'Daily Checklist', category: 'Productivity' },
  { label: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'auto', name: 'Hacker News Glance', category: 'Tools' },
  { label: 'Weather Forecast', url: 'https://wttr.in/?format=3', icon: 'Sun', name: 'Weather Glance', category: 'Utility' },
  { label: 'GitHub Mobile', url: 'https://github.com', icon: 'auto', name: 'GitHub Dashboard', category: 'Tools' },
  { label: 'Wikipedia', url: 'https://en.m.wikipedia.org/wiki/Special:Random', icon: 'auto', name: 'Wiki Knowledge', category: 'Media' },
];

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingApp,
  categories,
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Productivity');
  const [icon, setIcon] = useState('Globe');
  const [useFavicon, setUseFavicon] = useState(true);
  const [detectedFavicon, setDetectedFavicon] = useState<string | null>(null);

  // Custom Category creation state
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [errors, setErrors] = useState<{ name?: string; url?: string; category?: string }>({});

  // Detect favicon whenever URL changes
  useEffect(() => {
    const faviconUrl = getFaviconUrl(url);
    setDetectedFavicon(faviconUrl);

    if (faviconUrl && useFavicon) {
      setIcon(faviconUrl);
    } else if (!faviconUrl && useFavicon && !url.startsWith('builtin:')) {
      // Keep existing or default to Globe
      if (icon.startsWith('http')) {
        setIcon('Globe');
      }
    }
  }, [url, useFavicon]);

  useEffect(() => {
    if (editingApp) {
      setName(editingApp.name);
      setUrl(editingApp.url);
      setDescription(editingApp.description || '');
      setCategory(editingApp.category || 'Productivity');
      setIcon(editingApp.icon);
      const isUrlIcon =
        editingApp.icon.startsWith('http://') ||
        editingApp.icon.startsWith('https://') ||
        editingApp.icon.includes('favicons');
      setUseFavicon(isUrlIcon);
    } else {
      setName('');
      setUrl('');
      setDescription('');
      setCategory(categories[0] || 'Productivity');
      setIcon('Globe');
      setUseFavicon(true);
    }
    setIsAddingCustomCategory(false);
    setNewCategoryName('');
    setErrors({});
  }, [editingApp, isOpen, categories]);

  if (!isOpen) return null;

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));

    // If adding a new app and name is empty, auto-populate name from domain
    if (!editingApp && !name.trim()) {
      const domain = extractDomain(newUrl);
      if (domain) {
        // e.g., github.com -> GitHub
        const cleanName = domain.replace(/^www\./, '').split('.')[0];
        const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setName(formatted);
      }
    }
  };

  const validate = () => {
    const newErrors: { name?: string; url?: string; category?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'App name is required';
    }
    if (!url.trim()) {
      newErrors.url = 'App URL is required';
    } else if (!url.startsWith('builtin:') && !url.startsWith('http://') && !url.startsWith('https://')) {
      newErrors.url = 'URL must start with https://, http://, or builtin:';
    }
    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    onAddCategory(trimmed);
    setCategory(trimmed);
    setNewCategoryName('');
    setIsAddingCustomCategory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Determine final icon: if useFavicon and detected, use detected; else use selected icon
    let finalIcon = icon;
    if (useFavicon && detectedFavicon) {
      finalIcon = detectedFavicon;
    }

    onSave(
      {
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        category: category.trim(),
        icon: finalIcon,
        isBuiltIn: url.startsWith('builtin:'),
      },
      editingApp ? editingApp.id : undefined
    );
    onClose();
  };

  const applyPreset = (preset: typeof PRESET_URLS[0]) => {
    setName(preset.name);
    setUrl(preset.url);
    setCategory(preset.category);
    if (preset.icon === 'auto') {
      setUseFavicon(true);
      const fav = getFaviconUrl(preset.url);
      if (fav) setIcon(fav);
    } else {
      setUseFavicon(false);
      setIcon(preset.icon);
    }
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {editingApp ? 'Edit Application' : 'Add New Application'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure name, URL, icon, and custom category for Ray-Ban Display
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Quick presets */}
          {!editingApp && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Quick Presets & Built-in Apps
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_URLS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* App URL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Application URL *
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://github.com or builtin:compass"
                className={`w-full px-3.5 py-2.5 pl-9 rounded-xl border bg-slate-950 text-slate-100 text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  errors.url ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                }`}
              />
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
            {errors.url ? (
              <p className="text-xs text-rose-400 mt-1">{errors.url}</p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">
                Enter an HTTPS web address or a builtin app shortcut.
              </p>
            )}
          </div>

          {/* App Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Application Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. GitHub Activity"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-950 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Icon Selection Section with URL Favicon Detection */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Application Icon</span>
              </label>

              {/* Favicon vs Custom Toggle */}
              {detectedFavicon && (
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setUseFavicon(true);
                      setIcon(detectedFavicon);
                    }}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${
                      useFavicon
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Use Website Favicon
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUseFavicon(false);
                      if (icon.startsWith('http')) setIcon('Globe');
                    }}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${
                      !useFavicon
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Custom Icon
                  </button>
                </div>
              )}
            </div>

            {/* Display active icon preview */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center p-2 text-emerald-400 shrink-0">
                <AppIcon name={useFavicon && detectedFavicon ? detectedFavicon : icon} className="w-7 h-7" />
              </div>

              <div className="min-w-0 flex-1">
                {useFavicon && detectedFavicon ? (
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>URL Favicon Detected</span>
                    </span>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Auto-sourced from {extractDomain(url)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-medium text-slate-300">
                      Select Predefined Symbol
                    </span>
                    <select
                      value={icon.startsWith('http') ? 'Globe' : icon}
                      onChange={(e) => {
                        setUseFavicon(false);
                        setIcon(e.target.value);
                      }}
                      className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {AVAILABLE_ICONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom Category Section */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Category
              </label>

              {!isAddingCustomCategory && (
                <button
                  type="button"
                  onClick={() => setIsAddingCustomCategory(true)}
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ New Category</span>
                </button>
              )}
            </div>

            {isAddingCustomCategory ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Finance, Smart Home, Sports..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-emerald-500/60 bg-slate-900 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleCreateCategory()}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomCategory(false)}
                    className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  This custom category will be saved and available for filtering and display.
                </p>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Glanceable tech headlines"
              maxLength={70}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors shadow-sm"
            >
              {editingApp ? 'Save Changes' : 'Add to Glasses'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

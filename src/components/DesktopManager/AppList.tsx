import React, { useState } from 'react';
import { RayBanApp } from '../../types/app';
import { AppIcon } from '../common/AppIcon';
import {
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Glasses,
  Search,
  Plus,
  Tag,
  X,
} from 'lucide-react';

interface AppListProps {
  apps: RayBanApp[];
  categories: string[];
  onAddCategory: (categoryName: string) => void;
  onEditApp: (app: RayBanApp) => void;
  onDeleteApp: (appId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddApp: () => void;
  onLaunchInSimulator: (app: RayBanApp) => void;
}

export const AppList: React.FC<AppListProps> = ({
  apps,
  categories,
  onAddCategory,
  onEditApp,
  onDeleteApp,
  onMoveUp,
  onMoveDown,
  onAddApp,
  onLaunchInSimulator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isAddingCategoryInline, setIsAddingCategoryInline] = useState(false);
  const [inlineCategoryInput, setInlineCategoryInput] = useState('');

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat =
      selectedCategory === 'all' ||
      app.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleInlineAddCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inlineCategoryInput.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setSelectedCategory(trimmed);
    setInlineCategoryInput('');
    setIsAddingCategoryInline(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search apps by name, URL, or notes..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <button
            onClick={onAddApp}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add App</span>
          </button>
        </div>

        {/* Dynamic Category filter tabs including custom categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-800/60">
          <span className="text-[11px] font-mono-nums text-slate-500 shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>Category:</span>
          </span>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Inline Add Category Button */}
          {isAddingCategoryInline ? (
            <form onSubmit={handleInlineAddCategory} className="flex items-center gap-1 shrink-0 ml-1">
              <input
                type="text"
                value={inlineCategoryInput}
                onChange={(e) => setInlineCategoryInput(e.target.value)}
                placeholder="New category..."
                autoFocus
                className="px-2 py-0.5 text-xs rounded bg-slate-950 border border-emerald-500/70 text-slate-100 focus:outline-none w-28"
              />
              <button
                type="submit"
                className="px-2 py-0.5 text-xs bg-emerald-500 text-slate-950 font-bold rounded hover:bg-emerald-400"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCategoryInline(false)}
                className="p-0.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingCategoryInline(true)}
              className="px-2 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-lg whitespace-nowrap transition-colors shrink-0 flex items-center gap-1 border border-dashed border-emerald-800/60"
              title="Add Custom Category"
            >
              <Plus className="w-3 h-3" />
              <span>Category</span>
            </button>
          )}
        </div>
      </div>

      {/* App Cards List */}
      {filteredApps.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/60">
          <Glasses className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-200">No applications found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all'
              ? `No apps matching category "${selectedCategory}" or search query.`
              : 'Add your first web application to display on your Meta Ray-Ban glasses.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Clear Category Filter
              </button>
            )}
            <button
              onClick={onAddApp}
              className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New App</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {filteredApps.map((app) => {
            const actualIndex = apps.findIndex((a) => a.id === app.id);
            const pageNumber = Math.floor(actualIndex / 4) + 1;
            const slotNumber = (actualIndex % 4) + 1;
            const isConfirmingDelete = deleteConfirmId === app.id;
            const isFavicon =
              app.icon.startsWith('http://') ||
              app.icon.startsWith('https://') ||
              app.icon.includes('favicons');

            return (
              <div
                key={app.id}
                className="group p-4 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Icon, Name, URL, Category */}
                <div className="flex items-start md:items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 text-emerald-400 shrink-0">
                    <AppIcon name={app.icon} className="w-6 h-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-semibold text-slate-100 text-sm">
                        {app.name}
                      </span>
                      {/* Quiet unboxed metadata with separators (anti-slop rule) */}
                      <span className="text-xs text-slate-500 font-mono-nums flex items-center gap-1.5">
                        <span className="text-emerald-400 font-medium">Page {pageNumber}</span>
                        <span>·</span>
                        <span>Slot {slotNumber}</span>
                        <span>·</span>
                        <span className="text-slate-300 font-medium">{app.category}</span>
                        {isFavicon && (
                          <>
                            <span>·</span>
                            <span className="text-[10px] text-slate-400">URL Icon</span>
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono truncate mt-0.5 max-w-md">
                      {app.url}
                    </p>

                    {app.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {app.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  {/* Reorder buttons */}
                  <div className="flex items-center border border-slate-800 rounded-lg bg-slate-950 p-0.5">
                    <button
                      onClick={() => onMoveUp(actualIndex)}
                      disabled={actualIndex === 0}
                      title="Move Up"
                      className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMoveDown(actualIndex)}
                      disabled={actualIndex === apps.length - 1}
                      title="Move Down"
                      className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Launch in Simulator */}
                  <button
                    onClick={() => onLaunchInSimulator(app)}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 rounded-lg bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/50 transition-colors flex items-center gap-1.5"
                    title="Launch on Glasses Simulator"
                  >
                    <Glasses className="w-3.5 h-3.5" />
                    <span>Launch</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => onEditApp(app)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    title="Edit App"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Button / Confirmation */}
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1 bg-rose-950/60 border border-rose-800 p-1 rounded-lg">
                      <span className="text-[11px] text-rose-300 font-medium px-1">Delete?</span>
                      <button
                        onClick={() => {
                          onDeleteApp(app.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-0.5 text-[11px] font-bold bg-rose-600 text-white rounded hover:bg-rose-500"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 text-[11px] text-slate-400 hover:text-white"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(app.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete App"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

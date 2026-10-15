import React, { useState, useEffect } from 'react';
import { HudThemeConfig } from '../../../types/app';
import { Check, Square } from 'lucide-react';

interface ChecklistAppProps {
  theme: HudThemeConfig;
  onExit: () => void;
}

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: '1', text: 'Wearable audio connected', done: true },
  { id: '2', text: 'Waveguide display aligned', done: true },
  { id: '3', text: 'Camera privacy shutter check', done: false },
  { id: '4', text: 'Battery level above 50%', done: true },
  { id: '5', text: 'Review presentation slides', done: false },
];

export const ChecklistApp: React.FC<ChecklistAppProps> = ({ theme }) => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, done: !item.done } : item))
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(items.length - 1, i + 1));
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleItem(selectedIndex);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, items.length]);

  const completedCount = items.filter((i) => i.done).length;

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 select-none bg-black text-white">
      <div className="flex items-center justify-between text-xs font-mono-nums text-slate-400">
        <span>GLANCE CHECKLIST</span>
        <span className={theme.primary}>{completedCount}/{items.length} COMPLETED</span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2 my-auto">
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <div
              key={item.id}
              onClick={() => {
                setSelectedIndex(idx);
                toggleItem(idx);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? `${theme.border} ${theme.primaryBg} ${theme.highlightGlow}`
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className={item.done ? theme.primary : 'text-slate-600'}>
                {item.done ? (
                  <div className={`p-1 rounded bg-emerald-500/20 text-emerald-400`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  item.done ? 'line-through text-slate-500' : isSelected ? theme.primary : 'text-slate-200'
                }`}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono-nums text-slate-400">
        <span>↑/↓ D-Pad: Move Cursor</span>
        <span className={theme.primary}>Action: Toggle Item</span>
      </div>
    </div>
  );
};

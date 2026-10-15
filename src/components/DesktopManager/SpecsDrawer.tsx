import React from 'react';
import { Glasses, Cpu, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export const SpecsDrawer: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
            <Glasses className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Meta Ray-Ban Display & Waveguide Specifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict engineering guidelines for smart glasses web applications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono-nums text-emerald-400 font-bold">01. GEOMETRY</span>
            <h4 className="text-sm font-semibold text-slate-100 mt-1">Strict 600×600 px</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Square aspect ratio designed for monocular waveguide optical engines. Absolutely no variable height viewports or liquid scrolling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono-nums text-emerald-400 font-bold">02. NAVIGATION</span>
            <h4 className="text-sm font-semibold text-slate-100 mt-1">Page Swiping & D-Pad</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              When content exceeds one view, users flip entire pages left and right. Continuous vertical scrolling is strictly avoided.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono-nums text-emerald-400 font-bold">03. OPTICS</span>
            <h4 className="text-sm font-semibold text-slate-100 mt-1">OLED Pure Black (#000)</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              In optical waveguides, pure black pixels emit zero light, rendering as completely transparent to allow real-world vision.
            </p>
          </div>
        </div>
      </div>

      {/* Control mappings */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
          <span>Input Modality Mapping (Hardware & Emulation)</span>
        </h4>

        <div className="space-y-2 text-xs font-mono-nums">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Swipe Left / D-Pad Right</span>
            <span className="text-emerald-400 font-semibold">Advance to Next Page</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Swipe Right / D-Pad Left</span>
            <span className="text-emerald-400 font-semibold">Return to Previous Page</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Swipe Up/Down / D-Pad Up/Down</span>
            <span className="text-slate-200">Move Highlight Cursor between Apps</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Temple Tap / Enter / Space</span>
            <span className="text-emerald-400 font-semibold">Launch Selected Web App</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Two-Finger Tap / Escape</span>
            <span className="text-slate-400">Exit Running App & Return to Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

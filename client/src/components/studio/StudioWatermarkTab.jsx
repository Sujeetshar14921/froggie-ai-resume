import React from "react";

const StudioWatermarkTab = ({
  watermarkEnabled,
  setWatermarkEnabled,
  watermarkText,
  setWatermarkText,
  watermarkOpacity,
  setWatermarkOpacity,
  watermarkSize,
  setWatermarkSize,
  watermarkPosition,
  setWatermarkPosition,
}) => {
  return (
    <div className="space-y-3.5 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">Security Watermark</h4>
          <p className="text-[11px] text-slate-500">Stamp confidential or verification notice</p>
        </div>
        <button
          type="button"
          onClick={() => setWatermarkEnabled((v) => !v)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${
            watermarkEnabled
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          {watermarkEnabled ? "Active" : "Disabled"}
        </button>
      </div>

      {watermarkEnabled && (
        <div className="space-y-3">
          <input
            type="text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="Watermark Text"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                Opacity: {watermarkOpacity}%
              </span>
              <input
                type="range"
                min="10"
                max="90"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                Font Size: {watermarkSize}px
              </span>
              <input
                type="range"
                min="14"
                max="60"
                value={watermarkSize}
                onChange={(e) => setWatermarkSize(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "center", label: "Center" },
              { id: "diagonal", label: "Diagonal" },
              { id: "bottom-right", label: "Bottom Corner" },
            ].map((pos) => (
              <button
                key={pos.id}
                type="button"
                onClick={() => setWatermarkPosition(pos.id)}
                className={`py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${
                  watermarkPosition === pos.id
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioWatermarkTab;

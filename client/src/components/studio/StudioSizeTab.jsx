import React from "react";
import { Link2, Unlink2 } from "lucide-react";

const StudioSizeTab = ({
  targetSizeVal,
  setTargetSizeVal,
  targetSizeUnit,
  setTargetSizeUnit,
  handleConvergeToExactTarget,
  fileMeta,
  lockAspectRatio,
  setLockAspectRatio,
  customWidth,
  handleWidthChange,
  customHeight,
  handleHeightChange,
  quality,
  setQuality,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Exact Target Size Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Target Storage Limit
          </h4>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            Exact Fit ⚡
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="99999"
            value={targetSizeVal}
            onChange={(e) => setTargetSizeVal(e.target.value)}
            placeholder="e.g. 150"
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
          />
          <select
            value={targetSizeUnit}
            onChange={(e) => setTargetSizeUnit(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="KB">KB</option>
            <option value="MB">MB</option>
          </select>
          <button
            type="button"
            onClick={() => {
              const multiplier = targetSizeUnit === "MB" ? 1024 : 1;
              handleConvergeToExactTarget(Number(targetSizeVal) * multiplier);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Auto Fit ⚡
          </button>
        </div>
      </div>

      {fileMeta?.isImage && (
        <>
          {/* Custom Dimensions (Width x Height px with Lock) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Custom Resolution (px)
              </h4>
              <button
                type="button"
                onClick={() => setLockAspectRatio((l) => !l)}
                className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
              >
                {lockAspectRatio ? (
                  <Link2 size={13} className="text-indigo-600" />
                ) : (
                  <Unlink2 size={13} />
                )}
                <span>{lockAspectRatio ? "Locked Ratio" : "Free Dimensions"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  Width (px)
                </span>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={customWidth}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  Height (px)
                </span>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={customHeight}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Compression Quality Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Compression Quality</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StudioSizeTab;

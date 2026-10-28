import React from "react";
import { Sparkles, Check, RotateCcw, Loader2, Wand2 } from "lucide-react";
import { GRADIENT_PRESETS } from "./studioConstants";

const StudioBackgroundTab = ({
  bgRemoved,
  handleCloudAiBgRemove,
  isRemovingBgCloud,
  handleRestoreBg,
  backdropType,
  setBackdropType,
  solidColor,
  setSolidColor,
  gradientPreset,
  setGradientPreset,
  portraitBlurAmount,
  setPortraitBlurAmount,
  cloudCutoutDataUrl,
  bgSensitivity,
  setBgSensitivity,
  bgFeather,
  setBgFeather,
}) => {
  return (
    <div className="space-y-3.5 animate-in fade-in duration-150">
      {/* Vision AI Hero Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/15 dark:bg-emerald-400/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                Vision AI Cutout
              </h4>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Instant Neural
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Automated subject segmentation & alpha cutout
            </p>
          </div>
        </div>

        {/* Main Cutout Action Button */}
        {bgRemoved ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] px-1 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <Check size={12} />
                Cutout Active
              </span>
              <button
                type="button"
                onClick={handleCloudAiBgRemove}
                disabled={isRemovingBgCloud}
                className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer text-[10px]"
              >
                Re-run Cutout
              </button>
            </div>
            <button
              type="button"
              onClick={handleRestoreBg}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Restore Original Background</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCloudAiBgRemove}
            disabled={isRemovingBgCloud}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRemovingBgCloud ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>AI Cutout Processing...</span>
              </>
            ) : (
              <>
                <Wand2 size={14} />
                <span>Remove Background ✨</span>
              </>
            )}
          </button>
        )}
      </div>

      {bgRemoved && (
        <div className="space-y-3 pt-1">
          {/* Replace Backdrop Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Backdrop Studio
            </h4>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              {backdropType === "transparent" ? "Alpha PNG" : "Custom Background"}
            </span>
          </div>

          {/* 2x2 Grid for Backdrop Types */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "transparent", label: "Transparent", icon: "🏁" },
              { id: "solid", label: "Solid Color", icon: "🎨" },
              { id: "gradient", label: "Gradient", icon: "🌈" },
              { id: "blur", label: "Portrait Blur", icon: "🌫️" },
            ].map((bm) => (
              <button
                key={bm.id}
                type="button"
                onClick={() => setBackdropType(bm.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 truncate ${
                  backdropType === bm.id
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span>{bm.icon}</span>
                <span className="truncate">{bm.label}</span>
              </button>
            ))}
          </div>

          {/* Solid Color Picker */}
          {backdropType === "solid" && (
            <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold block">Preset Palettes</span>
              <div className="flex items-center gap-2 flex-wrap">
                {["#ffffff", "#0f172a", "#1e3a8a", "#059669", "#f1f5f9", "#fee2e2"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSolidColor(c)}
                    className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${
                      solidColor === c
                        ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-bold">Custom Hex:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-7 h-7 rounded-md cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    placeholder="#ffffff"
                    className="w-20 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gradient Presets */}
          {backdropType === "gradient" && (
            <div className="grid grid-cols-2 gap-1.5">
              {GRADIENT_PRESETS.map((gp) => (
                <button
                  key={gp.label}
                  type="button"
                  onClick={() => setGradientPreset(gp)}
                  className={`p-2 rounded-xl text-[10px] font-semibold border cursor-pointer flex items-center gap-1.5 transition-colors truncate ${
                    gradientPreset.label === gp.label
                      ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${gp.from}, ${gp.to})`,
                    }}
                  />
                  <span className="truncate text-slate-700 dark:text-slate-300">{gp.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Portrait Bokeh Blur Slider */}
          {backdropType === "blur" && (
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <span>Bokeh Blur Radius</span>
                <span className="font-mono text-emerald-600">{portraitBlurAmount}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                value={portraitBlurAmount}
                onChange={(e) => setPortraitBlurAmount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          )}

          {/* Optional Edge Matting Adjustments (if not using cloud) */}
          {!cloudCutoutDataUrl && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block">
                Local Edge Matting Sensitivity
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    <span>Sensitivity</span>
                    <span>{bgSensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={bgSensitivity}
                    onChange={(e) => setBgSensitivity(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    <span>Feather</span>
                    <span>{bgFeather}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={bgFeather}
                    onChange={(e) => setBgFeather(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudioBackgroundTab;

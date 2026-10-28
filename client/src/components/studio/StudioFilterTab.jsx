import React from "react";
import { Check, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { FILTER_PRESETS } from "./studioConstants";

const StudioFilterTab = ({
  previewUrl,
  selectedPreset,
  setSelectedPreset,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  exposure,
  setExposure,
  warmth,
  setWarmth,
  sharpness,
  setSharpness,
  vignette,
  setVignette,
  isGrayscale,
  setIsGrayscale,
  isInverted,
  setIsInverted,
}) => {
  return (
    <div className="space-y-3.5 animate-in fade-in duration-150">
      {/* PRESET FILTER CARDS WITH MINI IMAGE PREVIEWS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Preset Filters
          </h4>
          <button
            type="button"
            onClick={() => {
              setBrightness(0);
              setContrast(0);
              setSaturation(0);
              setExposure(0);
              setWarmth(0);
              setSharpness(0);
              setVignette(0);
              setIsGrayscale(false);
              setIsInverted(false);
              setSelectedPreset("Natural Original");
              toast.success("Color filters reset to original");
            }}
            className="text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Reset ↺
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {FILTER_PRESETS.map((fp) => {
            const isActive = selectedPreset === fp.label;
            return (
              <button
                key={fp.label}
                type="button"
                onClick={() => {
                  setBrightness(fp.b);
                  setContrast(fp.c);
                  setSaturation(fp.s);
                  setExposure(fp.exp);
                  setWarmth(fp.warm);
                  setSharpness(fp.sharp);
                  setIsGrayscale(fp.gray);
                  setIsInverted(fp.inv);
                  setSelectedPreset(fp.label);
                  toast.success(`Applied ${fp.label}`);
                }}
                className={`group flex flex-col items-center gap-1 p-1 rounded-xl border transition-colors cursor-pointer ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 ring-1 ring-emerald-500"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title={fp.label}
              >
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={fp.label}
                      style={{ filter: fp.cssFilter }}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      style={{ filter: fp.cssFilter }}
                      className="w-full h-full bg-gradient-to-tr from-indigo-500 via-emerald-400 to-amber-300 flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      Aa
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute top-1 right-1 size-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check size={9} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold truncate max-w-full leading-tight transition-colors ${
                    isActive
                      ? "text-emerald-700 dark:text-emerald-300 font-extrabold"
                      : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                  }`}
                >
                  {fp.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MANUAL ADJUSTMENTS & LIGHT CONTROLS */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Light & Color Sliders
          </h4>
          <button
            type="button"
            onClick={() => {
              setBrightness(6);
              setContrast(14);
              setSaturation(10);
              setExposure(4);
              setWarmth(4);
              setSelectedPreset(null);
              toast.success("Applied Auto Light Enhancement ⚡");
            }}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={11} />
            <span>Auto Enhance</span>
          </button>
        </div>

        {/* QUICK SPECIAL EFFECT TOGGLES */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setIsGrayscale((g) => !g);
              setSelectedPreset(null);
            }}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              isGrayscale
                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <span>Black & White</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsInverted((inv) => !inv);
              setSelectedPreset(null);
            }}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              isInverted
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <span>Invert Negative</span>
          </button>
        </div>

        {/* SLIDERS LIST */}
        <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1 no-scrollbar">
          {[
            { label: "Brightness", val: brightness, set: setBrightness, min: -60, max: 60 },
            { label: "Contrast", val: contrast, set: setContrast, min: -60, max: 60 },
            { label: "Saturation", val: saturation, set: setSaturation, min: -60, max: 60 },
            { label: "Exposure", val: exposure, set: setExposure, min: -50, max: 50 },
            { label: "Warmth", val: warmth, set: setWarmth, min: -50, max: 50 },
            { label: "Vignette", val: vignette, set: setVignette, min: 0, max: 80 },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-300">
                <span
                  onClick={() => {
                    item.set(0);
                    setSelectedPreset(null);
                  }}
                  className="cursor-pointer hover:text-emerald-600"
                  title="Click to reset to 0"
                >
                  {item.label}
                </span>
                <span
                  onClick={() => {
                    item.set(0);
                    setSelectedPreset(null);
                  }}
                  className={`font-mono text-[10px] px-1.5 py-0.2 rounded cursor-pointer ${
                    item.val !== 0
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold"
                      : "text-slate-400"
                  }`}
                  title="Click to reset"
                >
                  {item.val > 0 ? `+${item.val}` : item.val}
                </span>
              </div>
              <input
                type="range"
                min={item.min}
                max={item.max}
                value={item.val}
                onChange={(e) => {
                  item.set(Number(e.target.value));
                  setSelectedPreset(null);
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudioFilterTab;

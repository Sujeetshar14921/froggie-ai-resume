import React from "react";
import { Palette, Sun, Moon, Laptop, CheckCircle2, Lock, Globe, Check } from "lucide-react";

const THEME_OPTIONS = [
  { id: "light", label: "Light Mode", icon: Sun, desc: "Clean bright palette" },
  { id: "dark", label: "Dark Mode", icon: Moon, desc: "Low-light obsidian style" },
  { id: "system", label: "System Auto", icon: Laptop, desc: "Matches OS preferences" },
];

const AppearanceTab = ({
  currentTheme,
  handleThemeChange,
  defaultVisibility,
  handleVisibilityChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-6 shadow-xs">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="size-5 text-emerald-500" />
          <span>Theme & Display Preferences</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize light/dark styling and default resume sharing privacy.
        </p>
      </div>

      {/* THEME SELECTOR TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {THEME_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isSelected = currentTheme === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleThemeChange(item.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="size-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-500" : "text-slate-500"}`} />
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* RESUME DEFAULT VISIBILITY */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Default Resume Visibility
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <button
            type="button"
            onClick={() => handleVisibilityChange("private")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              defaultVisibility === "private"
                ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/15"
                : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-slate-400" />
              <span className="text-sm">Private by default</span>
            </div>
            {defaultVisibility === "private" && (
              <Check className="w-4 h-4 text-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleVisibilityChange("public")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              defaultVisibility === "public"
                ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/15"
                : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="text-sm">Public by default</span>
            </div>
            {defaultVisibility === "public" && (
              <Check className="w-4 h-4 text-emerald-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;

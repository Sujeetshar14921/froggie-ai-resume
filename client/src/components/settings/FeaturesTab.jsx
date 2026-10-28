import React from "react";
import {
  Sliders,
  RefreshCw,
  Check,
  Sparkles,
  FileText,
  Cloud,
  Globe,
  Zap,
  Bell,
  Volume2,
  Maximize2,
} from "lucide-react";
import SmoothToggle from "./SmoothToggle";

const FEATURES_CONFIG = [
  {
    key: "atsOptimizer",
    title: "ATS Smart Keyword Matcher",
    description: "Extract industry keywords from target job descriptions and suggest real-time placements in your resume.",
    badge: "RECOMMENDED",
    icon: Sparkles,
    gradient: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    key: "realTimeScore",
    title: "Live ATS Score Meter",
    description: "Display an active floating score dial in the builder that computes compliance with recruiter scanners.",
    badge: "POPULAR",
    icon: FileText,
    gradient: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    key: "autoSave",
    title: "Auto-Save Drafts to Cloud",
    description: "Continuously back up resume progress every 10 seconds to prevent accidental data loss.",
    badge: "ESSENTIAL",
    icon: Cloud,
    gradient: "from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  {
    key: "talentDiscovery",
    title: "Public Talent Directory Discovery",
    description: "Publish your verified candidate profile to froggie's talent pool for recruiters to discover you.",
    badge: "GET HIRED",
    icon: Globe,
    gradient: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    key: "aiBulletEnhancer",
    title: "AI STAR Bullet Enhancer",
    description: "1-Click rewrite of work experience into quantifiable, action-oriented STAR accomplishment statements.",
    badge: "AI POWERED",
    icon: Zap,
    gradient: "from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30",
  },
  {
    key: "emailNotifications",
    title: "Email Status & Interview Alerts",
    description: "Receive timely updates when your public resume is viewed or an employer requests contact.",
    badge: "ALERTS",
    icon: Bell,
    gradient: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    key: "soundEffects",
    title: "UI Sound Feedback & Chimes",
    description: "Play subtle audio cues when exporting PDFs, running AI scans, or completing achievements.",
    badge: "AUDIO",
    icon: Volume2,
    gradient: "from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
  {
    key: "compactWorkspace",
    title: "Compact Resume Workspace",
    description: "Reduce padding across builder inputs to show more content simultaneously on laptop screens.",
    badge: "LAYOUT",
    icon: Maximize2,
    gradient: "from-slate-500/20 to-slate-600/20 text-slate-600 dark:text-slate-300 border-slate-500/30",
  },
];

const FeaturesTab = ({
  features,
  toggleFeature,
  onResetFeatures,
  onEnableAll,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-6 shadow-xs">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="size-5 text-emerald-500" />
            <span>Feature Controls & Automation</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Activate or deactivate platform capabilities, AI copilot assistants, and background sync.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onResetFeatures}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Restore default flags"
          >
            <RefreshCw className="size-3" />
            <span>Defaults</span>
          </button>
          <button
            type="button"
            onClick={onEnableAll}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="size-3" />
            <span>Enable All</span>
          </button>
        </div>
      </div>

      {/* FEATURE CARDS GRID */}
      <div className="grid grid-cols-1 gap-3.5">
        {FEATURES_CONFIG.map((feat) => {
          const Icon = feat.icon;
          const isEnabled = Boolean(features[feat.key]);

          return (
            <div
              key={feat.key}
              onClick={() => toggleFeature(feat.key, feat.title)}
              className={`p-4 sm:p-5 rounded-2xl border transition-colors duration-200 cursor-pointer flex items-center justify-between gap-4 group ${
                isEnabled
                  ? "bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/40"
                  : "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
              }`}
            >
              {/* Left Icon & Text */}
              <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                <div
                  className={`size-11 sm:size-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-200 bg-gradient-to-br ${feat.gradient}`}
                >
                  <Icon className="size-5 sm:size-5.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {feat.title}
                    </h3>
                    <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>

              {/* Right Toggle & Status Indicator */}
              <div
                className="flex items-center gap-3 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none ${
                    isEnabled
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {isEnabled ? (
                    <>
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active</span>
                    </>
                  ) : (
                    <span>Inactive</span>
                  )}
                </span>

                <SmoothToggle
                  checked={isEnabled}
                  onChange={() => toggleFeature(feat.key, feat.title)}
                  label={feat.title}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesTab;

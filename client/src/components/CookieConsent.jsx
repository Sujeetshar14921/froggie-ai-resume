import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  BarChart3,
  Sparkles,
  Globe,
  X,
  SlidersHorizontal,
  Check,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  hasConsentedToCookies,
  getCookiePreferences,
  acceptAllCookies,
  acceptNecessaryCookiesOnly,
  saveCookiePreferences,
} from "../utils/cookieConsent";
import toast from "react-hot-toast";

/**
 * CookieConsent
 * Enterprise-grade, GDPR & CCPA compliant privacy and cookie consent tray.
 * Engineered with mature, professional styling, dark mode support,
 * granular category toggles, and zero intrusive cartoon elements.
 */
const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState(getCookiePreferences());

  useEffect(() => {
    // Check if user has already granted consent
    const consented = hasConsentedToCookies();
    if (!consented) {
      const timer = setTimeout(() => setIsVisible(true), 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Listen for custom triggers to reopen consent management (e.g., from Settings or Footer)
    const handleReopen = () => {
      setPreferences(getCookiePreferences());
      setIsVisible(true);
      setIsExpanded(true);
    };

    const handleConsentChanged = (e) => {
      if (e.detail) {
        setPreferences(e.detail);
      } else {
        setIsVisible(true);
        setIsExpanded(false);
      }
    };

    window.addEventListener("froggie:open-cookie-banner", handleReopen);
    window.addEventListener("froggie:cookie-consent-changed", handleConsentChanged);

    return () => {
      window.removeEventListener("froggie:open-cookie-banner", handleReopen);
      window.removeEventListener("froggie:cookie-consent-changed", handleConsentChanged);
    };
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
    toast.success("Privacy preferences saved.", { duration: 2500 });
  };

  const handleNecessaryOnly = () => {
    acceptNecessaryCookiesOnly();
    setIsVisible(false);
    toast.success("Essential cookies enabled.", { duration: 2500 });
  };

  const handleSaveCustom = () => {
    saveCookiePreferences(preferences);
    setIsVisible(false);
    toast.success("Custom cookie preferences saved.", { duration: 2500 });
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-auto sm:max-w-md z-45 animate-in fade-in slide-in-from-bottom-5 duration-300 select-none"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-950/20 dark:shadow-black/60 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* VIEW 1: EXPANDED DETAILED PREFERENCES */}
        {isExpanded ? (
          <div className="space-y-4">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Back to summary"
                  aria-label="Back to summary"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 id="cookie-consent-title" className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                    Privacy Preferences
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Manage granular data collection
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            {/* CATEGORIES LIST */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              
              {/* 1. STRICTLY ESSENTIAL */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Strictly Necessary
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Always Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Required for user authentication, CSRF security, resume auto-save state, and encryption. Cannot be disabled.
                </p>
              </div>

              {/* 2. ANALYTICS & TELEMETRY */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 flex items-center justify-between gap-3">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Performance & Diagnostics
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Anonymized ATS scanner throughput, load speeds, and error diagnostics to optimize platform reliability.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.analytics}
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }))
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    preferences.analytics ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      preferences.analytics ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 3. FUNCTIONAL & AI ENHANCEMENTS */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 flex items-center justify-between gap-3">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Functional & AI Experience
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Caches AI enhancement suggestions, workspace editor zoom, and personalized template preferences.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.personalization}
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, personalization: !prev.personalization }))
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    preferences.personalization ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      preferences.personalization ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 4. TALENT POOL DISCOVERY */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 flex items-center justify-between gap-3">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Talent Directory Insights
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tracks candidate view counters, recruiter search trends, and public portfolio analytics.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.marketing}
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }))
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    preferences.marketing ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      preferences.marketing ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* EXPANDED ACTIONS */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-center"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: MATURE SUMMARY TRAY */
          <div className="space-y-3.5">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 id="cookie-consent-title" className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                    <span>Privacy & Cookie Preferences</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    <span>GDPR & CCPA Compliant</span>
                    <span>•</span>
                    <span>Strictly Encrypted</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Dismiss cookie notice"
              >
                <X size={16} />
              </button>
            </div>

            {/* DESCRIPTION */}
            <p id="cookie-consent-desc" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              We use strictly necessary cookies to maintain secure sessions and preserve your builder state. With your consent, we also utilize privacy-first telemetry to monitor ATS parser speed and optimize platform performance.
            </p>

            {/* ACTION BUTTONS & PREFERENCE LINK */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-center"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleNecessaryOnly}
                  className="py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Necessary Only
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <SlidersHorizontal size={12} />
                  <span>Customize Preferences</span>
                </button>

                <Link
                  to="/faq"
                  className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  <span>Privacy FAQ</span>
                  <ExternalLink size={10} />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CookieConsent;

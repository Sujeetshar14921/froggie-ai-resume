import React, { useState, useEffect } from "react";
import {
  Cookie,
  ShieldCheck,
  Check,
  X,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  Lock,
  ExternalLink,
} from "lucide-react";
import {
  hasConsentedToCookies,
  getCookiePreferences,
  acceptAllCookies,
  acceptNecessaryCookiesOnly,
  saveCookiePreferences,
} from "../utils/cookieConsent";
import toast from "react-hot-toast";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState(getCookiePreferences());

  useEffect(() => {
    // Check if user has already given consent
    const consented = hasConsentedToCookies();
    if (!consented) {
      // Small delay for smooth entry animation
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Listen for custom trigger to re-open banner from settings or footer
    const handleReopen = () => {
      setPreferences(getCookiePreferences());
      setIsVisible(true);
      setIsExpanded(true);
    };

    const handleConsentChanged = (e) => {
      if (e.detail) {
        setPreferences(e.detail);
      } else {
        // Reset triggered
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
    toast.success("All cookies accepted. Thank you for supporting Froggie!", {
      icon: "🍪",
    });
  };

  const handleNecessaryOnly = () => {
    acceptNecessaryCookiesOnly();
    setIsVisible(false);
    toast.success("Essential cookies enabled. Non-essential cookies blocked.", {
      icon: "🛡️",
    });
  };

  const handleSaveCustom = () => {
    saveCookiePreferences(preferences);
    setIsVisible(false);
    toast.success("Your custom cookie preferences have been saved!");
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-900/15 space-y-4">
        {/* HEADER BAR */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="icon-3d-pod icon-3d-pod-amber size-10 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
              <Cookie size={20} className="lucide-3d" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>Cookie & Privacy Choice</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={10} className="text-emerald-600" />
                  GDPR Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                We respect your data and privacy controls
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X size={16} />
          </button>
        </div>

        {/* SUMMARY PARAGRAPH */}
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          Froggie uses cookies to keep you signed in, remember your dark mode settings, boost ATS resume parsing speed, and deliver smart AI suggestions.
        </p>

        {/* ACCORDION: DETAILED PREFERENCES TOGGLES */}
        {isExpanded && (
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3 animate-in fade-in duration-200">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Granular Cookie Controls
            </p>

            {/* 1. ESSENTIAL COOKIES */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Lock size={14} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Strictly Essential</span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                      Required
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-500">Auth, sessions, security tokens & theme</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase px-2 py-1 bg-emerald-50 rounded-lg shrink-0">
                Active
              </span>
            </div>

            {/* 2. ANALYTICS & ATS SPEED */}
            <label className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <BarChart3 size={14} className="text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">ATS Analytics & Telemetry</p>
                  <p className="text-[10px] text-slate-500">Anonymous parser performance metrics</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences({ ...preferences, analytics: e.target.checked })
                }
                className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
            </label>

            {/* 3. AI COPILOT SUGGESTIONS */}
            <label className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <Sparkles size={14} className="text-purple-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">AI Copilot Personalization</p>
                  <p className="text-[10px] text-slate-500">Cache suggestions & custom wording hints</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.personalization}
                onChange={(e) =>
                  setPreferences({ ...preferences, personalization: e.target.checked })
                }
                className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
            </label>

            {/* 4. MARKETING / TALENT POOL */}
            <label className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <Cookie size={14} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Talent Pool Insights</p>
                  <p className="text-[10px] text-slate-500">Recruiter search discovery cookies</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences({ ...preferences, marketing: e.target.checked })
                }
                className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
            </label>
          </div>
        )}

        {/* CUSTOMIZE TOGGLE LINK */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
          >
            <Sliders size={12} />
            <span>{isExpanded ? "Hide Details" : "Customize Cookie Settings"}</span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <span className="text-[10px] text-slate-400 font-medium">Privacy Guaranteed</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 pt-1 flex-wrap sm:flex-nowrap">
          {isExpanded ? (
            <>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="shimmer-button btn-3d-emerald flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white cursor-pointer shadow-md text-center"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="btn-3d-light py-2.5 px-3.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 cursor-pointer shadow-xs"
              >
                Accept All
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="shimmer-button btn-3d-emerald flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white cursor-pointer shadow-md text-center"
              >
                Accept All 🍪
              </button>
              <button
                type="button"
                onClick={handleNecessaryOnly}
                className="btn-3d-light py-2.5 px-3.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 cursor-pointer shadow-xs whitespace-nowrap"
              >
                Necessary Only
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

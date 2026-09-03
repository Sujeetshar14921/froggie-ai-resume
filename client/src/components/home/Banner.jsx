import React, { useState } from "react";
import { Sparkles, ArrowRight, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FrogFace from "../FrogLogo";

const Banner = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Announcement" className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 text-white z-40">
      {/* Background radiant glows */}
      <div className="absolute left-1/4 -top-10 w-96 h-24 bg-emerald-500/15 blur-[60px] pointer-events-none" />
      <div className="absolute right-1/4 -top-10 w-96 h-24 bg-teal-500/15 blur-[60px] pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">

          {/* LEFT BADGE & TEXT */}
          <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-emerald-400 font-semibold text-[11px] tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <Zap size={12} />
              froggie AI 1.0
            </span>

            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <FrogFace size={15} className="hidden sm:inline shrink-0" />
              Create 100% ATS-compliant resumes with real-time scoring and job keyword matching.
            </span>

            <button
              onClick={() => navigate("/app")}
              className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors ml-1 group cursor-pointer"
            >
              <span>Try Free</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* DISMISS BUTTON */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors shrink-0"
            aria-label="Dismiss Announcement"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Banner;
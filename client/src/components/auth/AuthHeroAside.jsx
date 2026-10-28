import React from "react";
import { Link } from "react-router-dom";
import { BrandIcon } from "../FrogLogo";

const AuthHeroAside = () => {
  return (
    <aside className="hidden lg:flex lg:w-5/12 xl:w-1/2 h-full flex-col justify-between p-6 xl:p-8 bg-gradient-to-br from-[#060a12] via-[#091222] to-[#040810] text-white relative overflow-hidden border-r border-slate-800/80 select-none">
      {/* Subtle background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/4 -left-16 w-64 h-64 bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* TOP: Brand Header */}
      <div className="relative z-10 shrink-0">
        <Link to="/" className="inline-flex items-center gap-2.5 group focus:outline-none">
          <BrandIcon
            size="sm"
            className="group-hover:scale-105 transition-transform"
            iconClassName="group-hover:rotate-6 transition-transform"
          />
          <div className="leading-tight">
            <span className="text-xl font-black tracking-tight text-white">
              froggie<span className="text-emerald-400">.</span>
            </span>
            <p className="text-[9px] text-emerald-400/90 font-bold uppercase tracking-wider">
              ATS Smart Resume Studio
            </p>
          </div>
        </Link>
      </div>

      {/* CENTER: Full Mascot Image & Clean Copy */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2 text-center max-w-sm xl:max-w-md mx-auto w-full">
        <div className="relative group mb-3 flex items-center justify-center">
          <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-400/25 transition-all duration-500 pointer-events-none" />

          <img
            src="/froggie_logo.png"
            alt="froggie AI Mascot"
            className="relative max-h-[24vh] xl:max-h-[30vh] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 ease-out select-none"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl xl:text-2xl font-black text-white tracking-tight leading-tight">
            Build resumes that <span className="text-emerald-400">stand out</span>.
          </h2>
          <p className="text-xs text-slate-300 max-w-xs xl:max-w-sm mx-auto leading-relaxed">
            100% ATS compliant, AI powered, and engineered to pass recruiter screenings.
          </p>

          {/* Quick Feature Badges */}
          <div className="flex items-center justify-center gap-1.5 pt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] xl:text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% ATS Pass
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] xl:text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
              AI Bullet Enhancer
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] xl:text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
              Free Forever
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM: Minimal Proof */}
      <div className="relative z-10 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span>Trusted by 15,000+ candidates</span>
        <span className="text-emerald-400/90 font-medium">Free & Open Studio</span>
      </div>
    </aside>
  );
};

export default AuthHeroAside;

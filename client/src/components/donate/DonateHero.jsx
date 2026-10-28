import React from "react";
import { ShieldCheck, Zap, Lock } from "lucide-react";
import FrogFace from "../FrogLogo";

const DonateHero = () => {
  return (
    <section className="relative pt-12 sm:pt-16 pb-20 overflow-hidden bg-slate-950 text-white text-left group">
      {/* Ambient Glows & Half-circle environment auras */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-emerald-500/25 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/20 via-indigo-400/10 to-transparent rounded-tr-full pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full px-3.5 sm:px-8 lg:px-12 xl:px-16 relative z-10 space-y-3.5 sm:space-y-6 text-center">
        {/* BADGE */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-black tracking-widest uppercase shadow-xs">
          <FrogFace size={14} />
          <span>COMMUNITY SUPPORT & DONATION</span>
        </div>

        {/* MAIN HEADLINE */}
        <h1 className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
          Keep froggie{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300">
            100% Free Forever
          </span>
          .
        </h1>

        {/* SUBTITLE */}
        <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          We believe quality career tools and ATS-friendly resumes should be accessible to every student and jobseeker worldwide with zero paywalls.
        </p>

        {/* TRUST HIGHLIGHTS BAR */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-semibold shadow-xs">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>0% Hidden Fees</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-semibold shadow-xs">
            <Zap size={14} className="text-amber-400" />
            <span>Instant Direct UPI</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-semibold shadow-xs">
            <Lock size={14} className="text-blue-400" />
            <span>Direct Bank Transfer</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonateHero;

import React from "react";
import { Award, Zap, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { BrandIcon } from "../../FrogLogo";

const XRayRecruiterImpression = ({ geminiReport }) => {
  if (!geminiReport) return null;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-emerald-500/40 shadow-xl relative overflow-hidden space-y-4 text-left">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER WITH SCORE GAUGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <BrandIcon size="xs" />
            <span>EXECUTIVE HIRING PERSPECTIVE</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>6-Second Recruiter Impression</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {geminiReport.recruiterImpression?.readinessVerdict || "Ready"}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Recruiter Score
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {geminiReport.recruiterImpression?.scoreOutOf100 || 85}
              <span className="text-xs text-slate-400 font-normal">/100</span>
            </span>
          </div>

          <div className="size-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* 6-SECOND SUMMARY */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 relative z-10 space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap size={13} className="text-amber-400" />
          <span>What a Recruiter Glances in 6 Seconds:</span>
        </span>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          "{geminiReport.recruiterImpression?.summary || "Strong candidate presentation with well-structured accomplishments."}"
        </p>
      </div>

      {/* STRENGTHS & RED FLAGS GRID */}
      <div className="grid sm:grid-cols-2 gap-3 relative z-10 text-xs">
        {/* TOP HOOKS */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>Top Recruiter Hooks</span>
          </span>
          <ul className="space-y-1.5 text-slate-300">
            {(geminiReport.recruiterImpression?.topHooks || []).map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 text-xs">✓</span>
                <span className="leading-snug">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* POTENTIAL RED FLAGS */}
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
          <span className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <AlertTriangle size={13} className="text-amber-400" />
            <span>Recruiter Questions / Red Flags</span>
          </span>
          <ul className="space-y-1.5 text-slate-300">
            {(geminiReport.recruiterImpression?.potentialRedFlags || []).map((rf, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 text-xs">!</span>
                <span className="leading-snug">{rf}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default XRayRecruiterImpression;

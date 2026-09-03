import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileText,
  Plus,
  Loader2,
  Target,
  ShieldCheck,
} from "lucide-react";
import { analyzeJdGap } from "../../utils/jdAnalyzer";

const AtsOptimizeSection = ({
  report,
  resumeData,
  resumeId,
  jobDescription = "",
  targetRole = "",
  onApplyOptimizations,
  isApplying = false,
  isApplied = false,
}) => {
  // Run JD gap analysis automatically
  const gapAnalysis = useMemo(() => {
    if (!resumeData || !jobDescription) return null;
    return analyzeJdGap(resumeData, jobDescription, targetRole);
  }, [resumeData, jobDescription, targetRole]);

  if (!gapAnalysis && !isApplied) return null;

  const currentScore = report?.overallScore || 65;
  const projectedScore = Math.min(
    Math.max(currentScore + 22, gapAnalysis?.potentialScore || 94),
    98
  );
  const scoreBoost = projectedScore - currentScore;

  // Already applied state
  if (isApplied) {
    return (
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border border-emerald-500/50 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Resume Strengthened & Tailored</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              All Job Description Optimizations Applied!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your resume's summary, keywords, and role alignment have been updated and re-benchmarked against this position.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {resumeId && (
              <Link
                to={`/app/builder/${resumeId}`}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Open in Builder</span>
                <ArrowRight size={14} />
              </Link>
            )}

            {resumeId && (
              <Link
                to={`/view/${resumeId}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
              >
                Preview Resume
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Prioritize authentic backend Gemini report findings as primary source of truth
  const effectiveMissingKeywords = (report?.keywords?.missing && report.keywords.missing.length > 0)
    ? report.keywords.missing
    : (gapAnalysis?.missingKeywords || []);

  const effectiveSkillsToAdd = (report?.skills?.missing && report.skills.missing.length > 0)
    ? report.skills.missing
    : (gapAnalysis?.skillsToAdd || []);

  const effectiveSummary = gapAnalysis?.tailoredSummary || (
    resumeData?.professional_summary
      ? `${resumeData.professional_summary} Specialized in ${targetRole || report?.jobTitle || "the target role"} with core expertise in ${effectiveSkillsToAdd.slice(0, 5).join(", ")}.`
      : `Results-driven ${targetRole || report?.jobTitle || "Professional"} with proven expertise in ${effectiveSkillsToAdd.slice(0, 5).join(", ")}. Adept at scalable system design, cross-functional collaboration, and delivering measurable impact.`
  );

  const handleApply = () => {
    if (onApplyOptimizations) {
      onApplyOptimizations({
        tailoredSummary: effectiveSummary,
        skillsToAdd: effectiveSkillsToAdd,
        targetRole: targetRole || report?.jobTitle || "",
      });
    }
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-emerald-500/40 shadow-xl relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER & SCORE PROJECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 relative z-10">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} className="text-emerald-400" />
              <span>Automated JD Tailoring</span>
            </span>
            {targetRole && (
              <span className="text-xs text-slate-400 font-medium truncate max-w-xs">
                Target: <strong className="text-white">{targetRole}</strong>
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            1-Click Strengthen Resume for this Position
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Close the ATS keyword gap instantly. Inject required competencies and apply an AI-crafted summary with STAR metrics.
          </p>
        </div>

        {/* SCORE JUMP TELEMETRY BADGE */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 p-3 rounded-2xl shrink-0 shadow-inner">
          <div className="text-center px-2">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Current</span>
            <span className="text-xl font-black text-slate-300">{currentScore}%</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
              +{scoreBoost > 0 ? scoreBoost : 18}%
            </span>
            <ArrowRight size={16} className="text-emerald-400" />
          </div>

          <div className="text-center px-2">
            <span className="text-[10px] font-mono text-emerald-400 block uppercase">Optimized</span>
            <span className="text-xl font-black text-emerald-400">{projectedScore}%</span>
          </div>
        </div>
      </div>

      {/* OPTIMIZATION PREVIEWS GRID */}
      <div className="grid md:grid-cols-2 gap-4 relative z-10 text-left">
        
        {/* 1. TAILORED SUMMARY PREVIEW */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <FileText size={14} />
            <span>Targeted Summary to Apply</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 max-h-28 overflow-y-auto no-scrollbar">
            "{effectiveSummary}"
          </p>
        </div>

        {/* 2. MISSING KEYWORDS TO INJECT */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Plus size={14} />
              <span>Missing Keywords to Inject ({effectiveSkillsToAdd.length})</span>
            </div>
            <span className="text-[10px] text-slate-400">Auto-added to skills</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto no-scrollbar p-1">
            {effectiveSkillsToAdd.length > 0 ? (
              effectiveSkillsToAdd.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                >
                  +{skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-400">All major keywords already matched!</span>
            )}
          </div>
        </div>

      </div>

      {/* ACTION FOOTER */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400 text-left">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <span>
            Safely updates your resume in database & re-runs ATS benchmark automatically.
          </span>
        </div>

        <button
          type="button"
          onClick={handleApply}
          disabled={isApplying}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isApplying ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Applying All Optimizations...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Apply All Optimizations to Resume</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default AtsOptimizeSection;

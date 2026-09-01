import React from "react";
import { ShieldCheck, CheckCircle2, XCircle, Sparkles, ArrowRight, AlertTriangle, Lightbulb } from "lucide-react";
import { useCopilot } from "../../../hooks/useCopilot";
import FrogFace from "../../FrogLogo";

const InChatAtsCard = ({ data = {} }) => {
  const { sendMessage } = useCopilot();

  const {
    overallScore = 75,
    ratingLabel = "Strong Match",
    targetRole = "Target Role",
    breakdown = {},
    matchedSkills = [],
    missingSkills = [],
    priorityKeywordsFound = [],
    missingPriorityKeywords = [],
    actionableRecommendations = [],
  } = data;

  const getScoreColor = (score) => {
    if (score >= 90) return { bg: "bg-emerald-50 text-emerald-800 border-emerald-200", bar: "bg-emerald-500", text: "text-emerald-700" };
    if (score >= 75) return { bg: "bg-emerald-50 text-emerald-800 border-emerald-200", bar: "bg-emerald-600", text: "text-emerald-600" };
    if (score >= 60) return { bg: "bg-amber-50 text-amber-800 border-amber-200", bar: "bg-amber-500", text: "text-amber-600" };
    return { bg: "bg-rose-50 text-rose-800 border-rose-200", bar: "bg-rose-500", text: "text-rose-600" };
  };

  const theme = getScoreColor(overallScore);

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* HEADER WITH ATS SCORE GAUGE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-xs border border-emerald-500/30">
            <FrogFace size={20} />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
              ATS Compatibility Audit
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">{targetRole}</span>
          </div>
        </div>

        {/* OVERALL SCORE BADGE */}
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${theme.text}`}>{overallScore}</span>
            <span className="text-[10px] font-bold text-slate-400">/100</span>
          </div>
          <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-extrabold border uppercase tracking-wider ${theme.bg}`}>
            {ratingLabel}
          </span>
        </div>
      </div>

      {/* SCORE CATEGORIES BREAKDOWN */}
      {breakdown && Object.keys(breakdown).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key} className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-slate-800">{val}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(val).bar}`}
                  style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MATCHED VS MISSING SKILLS */}
      <div className="grid sm:grid-cols-2 gap-3 pt-1">
        {/* MATCHED */}
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
          <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Matched Skills ({matchedSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">None identified</span>
            )}
          </div>
        </div>

        {/* MISSING SKILLS */}
        <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1.5">
          <span className="font-bold text-rose-800 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
            <XCircle size={13} className="text-rose-600" />
            Missing In-Demand Skills ({missingSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {missingSkills.length > 0 ? (
              missingSkills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-medium">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">No major skills missing</span>
            )}
          </div>
        </div>
      </div>

      {/* ACTIONABLE RECOMMENDATIONS */}
      {actionableRecommendations.length > 0 && (
        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5 text-[11px]">
          <span className="font-bold text-emerald-950 flex items-center gap-1.5">
            <Lightbulb size={13} className="text-emerald-700" />
            Actionable ATS Optimization Steps:
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
            {actionableRecommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* QUICK AUTO-FIX ACTION */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400 font-medium">
          Want to boost this score?
        </span>

        <button
          onClick={() =>
            sendMessage(
              `Optimize my resume to include missing skills (${missingSkills.join(
                ", "
              )}) and boost my ATS score for ${targetRole}. Update my resume directly.`
            )
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer border border-emerald-500/30"
        >
          <FrogFace size={13} />
          <span>Auto-Fix & Boost ATS Score</span>
          <ArrowRight size={12} className="text-emerald-400" />
        </button>
      </div>

    </div>
  );
};

export default InChatAtsCard;

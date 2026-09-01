import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { useCopilot } from "../../../hooks/useCopilot";
import FrogFace from "../../FrogLogo";

const ShouldIApplyCard = ({ data = {} }) => {
  const { sendMessage } = useCopilot();
  const {
    recommendation = "possible_match",
    recommendationLabel = "Possible Match",
    technicalFit = 70,
    experienceFit = 70,
    projectRelevance = 70,
    verdictSummary,
    strengthsForRole = [],
    missingRequirements = [],
    actionPlan,
  } = data;

  const getBadgeStyle = () => {
    if (recommendation === "strong_match") {
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
    if (recommendation === "low_match") {
      return "bg-rose-100 text-rose-800 border-rose-300";
    }
    return "bg-amber-100 text-amber-800 border-amber-300";
  };

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* VERDICT BADGE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span className="font-bold text-slate-800">Job Match Recommendation:</span>
        </div>

        <span className={`px-2.5 py-1 rounded-full font-black text-[11px] border uppercase tracking-wider ${getBadgeStyle()}`}>
          {recommendationLabel}
        </span>
      </div>

      {verdictSummary && (
        <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          {verdictSummary}
        </p>
      )}

      {/* METRICS METERS */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Technical Fit</span>
          <span className="text-base font-black text-emerald-600">{technicalFit}%</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
          <span className="text-base font-black text-emerald-700">{experienceFit}%</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Projects</span>
          <span className="text-base font-black text-slate-900">{projectRelevance}%</span>
        </div>
      </div>

      {/* STRENGTHS VS GAPS */}
      <div className="space-y-2 pt-1">
        {strengthsForRole.length > 0 && (
          <div className="text-emerald-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 size={12} className="text-emerald-600" /> Key Strengths:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
              {strengthsForRole.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {missingRequirements.length > 0 && (
          <div className="text-rose-900 space-y-1 pt-1">
            <span className="font-bold flex items-center gap-1 text-[11px]">
              <AlertTriangle size={12} className="text-rose-600" /> Missing / Stretch Requirements:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
              {missingRequirements.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {actionPlan && (
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 font-medium">
          <strong>Recommended Next Step: </strong> {actionPlan}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => sendMessage("Generate a LinkedIn outreach message to the hiring manager for this role.")}
          className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer flex items-center gap-1 border border-emerald-500/30"
        >
          <FrogFace size={12} />
          <span>Draft Recruiter Message</span>
          <ArrowRight size={11} className="text-emerald-400" />
        </button>
      </div>
    </div>
  );
};

export default ShouldIApplyCard;

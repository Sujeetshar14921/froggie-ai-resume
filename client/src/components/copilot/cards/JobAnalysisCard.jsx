import React from "react";
import { CheckCircle2, XCircle, Sparkles, Briefcase, Lightbulb, ArrowRight } from "lucide-react";
import { useCopilot } from "../../../hooks/useCopilot";
import FrogFace from "../../FrogLogo";

const JobAnalysisCard = ({ data = {} }) => {
  const { sendMessage } = useCopilot();
  const {
    jobTitle = "Target Role",
    overview,
    requiredSkills = [],
    preferredSkills = [],
    whatYouHave = [],
    potentialGaps = [],
    whatToHighlight = [],
    recommendedResumeChanges = [],
  } = data;

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider text-[10px] border border-emerald-200">
            <FrogFace size={12} />
            Job Analysis
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-1">{jobTitle}</h4>
        </div>
      </div>

      {overview && <p className="text-slate-600 leading-relaxed">{overview}</p>}

      {/* SKILLS OVERLAP MATRIX */}
      <div className="grid sm:grid-cols-2 gap-3 pt-1">
        {/* WHAT YOU HAVE */}
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
          <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Skills You Have ({whatYouHave.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {whatYouHave.map((s, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* POTENTIAL GAPS */}
        <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2">
          <span className="font-bold text-rose-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <XCircle size={13} className="text-rose-600" />
            Potential Gaps ({potentialGaps.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {potentialGaps.map((s, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT TO HIGHLIGHT */}
      {whatToHighlight.length > 0 && (
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
          <span className="font-bold text-emerald-950 flex items-center gap-1 text-[11px]">
            <FrogFace size={13} />
            What to Highlight for this Role:
          </span>
          <ul className="list-disc list-inside space-y-1 text-emerald-950 text-[11px]">
            {whatToHighlight.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* QUICK FOLLOW-UP ACTIONS */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
        <button
          onClick={() => sendMessage("Should I apply for this role? Give me your honest fit breakdown.")}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer text-[11px]"
        >
          <span>Should I Apply?</span>
          <ArrowRight size={11} />
        </button>

        <button
          onClick={() => sendMessage("Write a tailored cover letter for this position based on my resume.")}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold transition-colors cursor-pointer text-[11px] border border-emerald-200/70"
        >
          <span>Generate Cover Letter</span>
          <ArrowRight size={11} />
        </button>

        <button
          onClick={() => sendMessage("Start a mock interview for this role.")}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold transition-colors cursor-pointer text-[11px]"
        >
          <span>Prepare Interview</span>
          <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
};

export default JobAnalysisCard;

import React, { useState } from "react";
import { Check, Copy, Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from "lucide-react";
import { useCopilot } from "../../../hooks/useCopilot";
import toast from "react-hot-toast";
import FrogFace from "../../FrogLogo";

const ResumeSuggestionCard = ({ data = {} }) => {
  const { applyToResume } = useCopilot();
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const section = data.section || "summary";
  const sectionIndex = data.sectionIndex !== undefined ? data.sectionIndex : -1;
  const original = data.original || data.originalContent || "";
  const suggested = data.suggested || data.improvedContent || data.content || "";
  const reason = data.reason || data.improvementRationale || data.rationale || "";
  const tips = Array.isArray(data.tips) ? data.tips : [];

  const handleCopy = () => {
    if (!suggested) return;
    navigator.clipboard.writeText(suggested);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (!suggested) {
      toast.error("No suggestion content to apply.");
      return;
    }
    applyToResume(section, suggested, sectionIndex);
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider text-[10px] border border-emerald-200">
          <FrogFace size={13} />
          Enhanced {section.toUpperCase()}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer font-semibold"
          >
            {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleApply}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all shadow-xs cursor-pointer ${
              applied
                ? "bg-emerald-600 text-white"
                : "bg-slate-950 hover:bg-slate-900 text-white border border-emerald-500/30"
            }`}
          >
            {applied ? <CheckCircle2 size={12} /> : <ArrowRight size={12} className="text-emerald-400" />}
            <span>{applied ? "Applied!" : "Apply to Resume"}</span>
          </button>
        </div>
      </div>

      {/* ORIGINAL VS SUGGESTED */}
      <div className="space-y-3">
        {original && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Draft:</span>
            <p className="line-through leading-relaxed">{original}</p>
          </div>
        )}

        {suggested && (
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-slate-900 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800">froggie AI Version:</span>
            <p className="font-medium text-emerald-950 leading-relaxed whitespace-pre-line">{suggested}</p>
          </div>
        )}
      </div>

      {/* RATIONALE */}
      {reason && (
        <div className="flex items-start gap-2 text-slate-600 leading-relaxed bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
          <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-900 font-semibold">Why this works: </strong>
            {reason}
          </span>
        </div>
      )}

      {/* ACTION TIPS */}
      {tips.length > 0 && (
        <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px] pt-1">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResumeSuggestionCard;

import React from "react";
import { FileSearch, Sparkles, RefreshCw, X } from "lucide-react";
import { SAMPLE_JDS } from "./talentConstants";

const TalentJdMatcherModal = ({
  isOpen,
  onClose,
  jdText,
  setJdText,
  isAnalyzingJd,
  onApplyJdMatching,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-left relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <FileSearch size={22} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-950">AI Job Description Matcher</h3>
            <p className="text-xs text-slate-500 font-semibold">
              Paste requirements or job description to find compatible candidate resumes
            </p>
          </div>
        </div>

        {/* QUICK PRESET TEMPLATES */}
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            Quick Sample JDs (Click to Test):
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SAMPLE_JDS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setJdText(sample.text)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 text-[11px] font-bold border border-slate-200 transition-all cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Paste Job Description / Requirements:
          </label>
          <textarea
            rows={6}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="e.g. Looking for a Senior Full Stack Engineer with 3+ years in React, Node.js, AWS, and MongoDB. Must have experience building scalable web applications..."
            className="w-full text-xs font-medium p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none resize-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            disabled={isAnalyzingJd || !jdText.trim()}
            onClick={onApplyJdMatching}
            className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs shadow-md transition-all border border-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isAnalyzingJd ? (
              <>
                <RefreshCw size={14} className="text-emerald-400 animate-spin" />
                <span>AI Analyzing JD & Matching Candidates...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-emerald-400" />
                <span>Extract & Match Candidates</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isAnalyzingJd}
            onClick={() => {
              setJdText("");
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalentJdMatcherModal;

import React, { useState } from "react";
import { Copy, Check, FileText, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import FrogFace from "../../FrogLogo";

const CoverLetterCard = ({ data = {} }) => {
  const [activeTab, setActiveTab] = useState("professional");
  const [copied, setCopied] = useState(false);

  const {
    targetRole = "Target Role",
    targetCompany = "Hiring Team",
    shortVersion,
    professionalVersion,
    startupVersion,
    keyHighlights = [],
  } = data;

  const currentContent =
    activeTab === "short"
      ? shortVersion || data.body || data.coverLetter
      : activeTab === "startup"
      ? startupVersion || data.body || data.coverLetter
      : professionalVersion || data.body || data.coverLetter || shortVersion || startupVersion;

  const handleCopy = () => {
    if (!currentContent) return;
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* HEADER & TONE TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider text-[10px] border border-emerald-200">
            <FrogFace size={13} />
            Cover Letter
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-1">
            {targetRole} {targetCompany ? `at ${targetCompany}` : ""}
          </h4>
        </div>

        {/* TONE SWITCHER */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/70 shrink-0">
          <button
            onClick={() => setActiveTab("short")}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "short"
                ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Short (150w)
          </button>
          <button
            onClick={() => setActiveTab("professional")}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "professional"
                ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Professional
          </button>
          <button
            onClick={() => setActiveTab("startup")}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "startup"
                ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Startup
          </button>
        </div>
      </div>

      {/* LETTER CONTENT BOX */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 font-serif whitespace-pre-line leading-relaxed text-xs sm:text-[13px] relative group">
        {currentContent || "Cover letter generating..."}
      </div>

      {/* HIGHLIGHTS */}
      {keyHighlights.length > 0 && (
        <div className="text-[11px] text-slate-500 space-y-1">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <FrogFace size={12} /> Key Value Propositions Highlighted:
          </span>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            {keyHighlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* COPY ACTION */}
      <div className="flex justify-end pt-1">
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span>{copied ? "Copied Letter!" : "Copy Cover Letter"}</span>
        </button>
      </div>
    </div>
  );
};

export default CoverLetterCard;

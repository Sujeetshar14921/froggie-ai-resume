import React, { useState } from "react";
import { Copy, Check, MessageSquareText, Mail, Users, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import FrogFace from "../../FrogLogo";

const RecruiterMessageCard = ({ data = {} }) => {
  const [activeTab, setActiveTab] = useState("linkedin");
  const [copied, setCopied] = useState(false);

  const {
    targetRole = "Role",
    linkedinMessage,
    coldEmail,
    referralRequest,
    followUp,
  } = data;

  const currentContent =
    activeTab === "linkedin"
      ? linkedinMessage
      : activeTab === "coldEmail"
      ? coldEmail
      : activeTab === "referral"
      ? referralRequest
      : followUp || linkedinMessage;

  const handleCopy = () => {
    if (!currentContent) return;
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    toast.success("Outreach message copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider text-[10px] border border-emerald-200">
            <FrogFace size={12} />
            Recruiter Outreach
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-1">{targetRole} Outreach</h4>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl border border-slate-200/70 shrink-0">
          <button
            onClick={() => setActiveTab("linkedin")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "linkedin"
                ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            LinkedIn (300c)
          </button>
          <button
            onClick={() => setActiveTab("coldEmail")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "coldEmail"
                ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Cold Email
          </button>
          <button
            onClick={() => setActiveTab("referral")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "referral"
                ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Referral
          </button>
          <button
            onClick={() => setActiveTab("followUp")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "followUp"
                ? "bg-white text-emerald-800 shadow-2xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Follow-Up
          </button>
        </div>
      </div>

      {/* MESSAGE BOX */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 whitespace-pre-line leading-relaxed text-xs sm:text-[13px]">
        {currentContent || "Outreach message generating..."}
      </div>

      {/* COPY ACTION */}
      <div className="flex justify-end pt-1">
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span>{copied ? "Copied Message!" : "Copy to Clipboard"}</span>
        </button>
      </div>
    </div>
  );
};

export default RecruiterMessageCard;

import React, { useState } from "react";
import { Copy, Check, Linkedin, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import FrogFace from "../../FrogLogo";

const LinkedInProfileCard = ({ data = {} }) => {
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedAbout, setCopiedAbout] = useState(false);

  const {
    headline = "",
    about = "",
    topSkills = [],
    featuredExperienceSummary = "",
  } = data;

  const copyText = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "headline") {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
      toast.success("Copied headline to clipboard!");
    } else {
      setCopiedAbout(true);
      setTimeout(() => setCopiedAbout(false), 2000);
      toast.success("Copied About section to clipboard!");
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4 text-xs animate-in fade-in duration-200">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 font-extrabold uppercase tracking-wider text-[10px]">
            <Linkedin size={13} className="text-sky-600" />
            <span>LinkedIn Profile Package</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600">
          <FrogFace size={13} />
          <span>froggie AI</span>
        </div>
      </div>

      {/* HEADLINE */}
      {headline && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wider">
              Optimized Headline (Under 220 Chars)
            </span>
            <button
              type="button"
              onClick={() => copyText(headline, "headline")}
              className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-bold text-[11px] cursor-pointer"
            >
              {copiedHeadline ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copiedHeadline ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
            {headline}
          </p>
        </div>
      )}

      {/* ABOUT SECTION */}
      {about && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wider">
              About Section / Bio
            </span>
            <button
              type="button"
              onClick={() => copyText(about, "about")}
              className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-bold text-[11px] cursor-pointer"
            >
              {copiedAbout ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copiedAbout ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
            {about}
          </p>
        </div>
      )}

      {/* TOP SKILLS */}
      {topSkills.length > 0 && (
        <div className="space-y-1.5">
          <span className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wider block">
            Featured Skills to Endorse
          </span>
          <div className="flex flex-wrap gap-1">
            {topSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default LinkedInProfileCard;

import React from "react";
import { Plus } from "lucide-react";

const XRayKeywords = ({ keywords = [] }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Plus size={14} className="text-amber-500" />
          <span>High-Gravity Missing Industry Keywords ({keywords.length})</span>
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Add to Skills or Summary</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {keywords.map((kw, i) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs"
          >
            +{kw}
          </span>
        ))}
      </div>
    </div>
  );
};

export default XRayKeywords;

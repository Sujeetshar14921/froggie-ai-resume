import React from "react";
import { Tag, Check, AlertCircle } from "lucide-react";

const AtsKeywordsCard = ({ keywords = {} }) => {
  const matched = keywords.matched || [];
  const missing = keywords.missing || [];
  const important = keywords.important || [];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Tag size={18} className="text-emerald-600" />
          ATS Keyword Coverage
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Applicant Tracking Systems scan for specific terms and industry buzzwords found in the job description
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* FOUND KEYWORDS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Keywords Present in Resume ({matched.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {matched.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific keywords detected.</p>
            ) : (
              matched.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/80"
                >
                  <Check size={12} className="text-emerald-600" />
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* MISSING KEYWORDS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Missing Target Keywords ({missing.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {missing.length === 0 ? (
              <p className="text-xs text-emerald-600 font-semibold">
                ✓ Full target keyword density achieved!
              </p>
            ) : (
              missing.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                >
                  <AlertCircle size={12} className="text-amber-500" />
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsKeywordsCard;

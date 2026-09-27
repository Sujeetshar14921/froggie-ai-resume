import React from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

const AtsSkillsMatch = ({ skills = {} }) => {
  const matched = skills.matched || [];
  const missing = skills.missing || [];
  const partial = skills.partial || [];

  const totalSkills = matched.length + missing.length + partial.length;
  const matchRate = totalSkills > 0 ? Math.round((matched.length / totalSkills) * 100) : 0;

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6 group text-left">
      {/* Half circle ambient glows */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Skills Alignment</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparison of technical & role competencies extracted from the Job Description
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400">Match Rate: </span>
          <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
            {matchRate}%
          </span>
        </div>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-6">
        {/* MATCHED SKILLS */}
        <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Matched Skills ({matched.length})
            </h4>
          </div>

          {matched.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">
              No direct required skill matches detected.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {matched.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100/90 text-emerald-800 text-xs font-semibold border border-emerald-200/80 shadow-2xs"
                >
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* MISSING SKILLS */}
        <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle size={16} className="text-rose-600" />
              Missing Competencies ({missing.length})
            </h4>
          </div>

          {missing.length === 0 ? (
            <p className="text-xs text-emerald-600 font-semibold py-2">
              ✓ All major required skills detected in your resume!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {missing.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-100/90 text-rose-800 text-xs font-semibold border border-rose-200/80 shadow-2xs"
                >
                  <XCircle size={12} className="text-rose-600" />
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PARTIAL MATCHES */}
      {partial.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2">
          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle size={15} className="text-amber-600" />
            Related / Partial Mentions ({partial.length})
          </h4>
          <p className="text-xs text-slate-500 mb-2">
            These terms or similar concepts were mentioned in context, but could be made more prominent:
          </p>
          <div className="flex flex-wrap gap-2">
            {partial.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100/80 text-amber-800 text-xs font-medium border border-amber-200/70"
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

export default AtsSkillsMatch;

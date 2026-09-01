import React from "react";
import { Briefcase, UserCheck, Clock, CheckCircle2 } from "lucide-react";

const AtsExperienceCard = ({ experience = {}, jobTitle = "", resumeTitle = "" }) => {
  const reqYears = experience.requiredYears || 0;
  const resYears = experience.resumeYears || 0;
  const score = experience.score || 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Briefcase size={18} className="text-emerald-600" />
          Experience & Role Alignment
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Seniority, required tenure, and title consistency check
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {/* TARGET JOB TITLE */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <UserCheck size={13} className="text-emerald-600" />
            Target Role Title
          </span>
          <p className="text-sm font-extrabold text-slate-900 truncate">{jobTitle || "Not Specified"}</p>
        </div>

        {/* YEARS REQUIRED */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock size={13} className="text-emerald-700" />
            Experience Match
          </span>
          <p className="text-sm font-extrabold text-slate-900">
            {resYears} yrs <span className="text-xs font-normal text-slate-400">/ {reqYears > 0 ? `${reqYears}+ yrs req` : "No min yrs"}</span>
          </p>
        </div>

        {/* EXPERIENCE SCORE */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Experience Match Score
          </span>
          <p className="text-sm font-extrabold text-emerald-600">{score}%</p>
        </div>
      </div>

      {/* ANALYSIS TEXT */}
      {experience.analysis && (
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
          <strong>Experience Evaluation: </strong>
          {experience.analysis}
        </div>
      )}
    </div>
  );
};

export default AtsExperienceCard;

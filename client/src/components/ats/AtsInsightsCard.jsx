import React from "react";
import { CheckCircle2, Lightbulb, AlertTriangle, ShieldAlert } from "lucide-react";
import FrogFace from "../FrogLogo";

const AtsInsightsCard = ({
  strengths = [],
  improvements = [],
  atsIssues = [],
  recommendations = [],
}) => {
  const getSeverityBadge = (sev) => {
    switch (sev) {
      case "high":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* 2-COLUMN GRID: STRENGTHS & IMPROVEMENTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* STRENGTHS */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-600" />
            Resume Strengths
          </h3>
          <p className="text-xs text-slate-500">
            Competencies and formatting elements where your resume excels
          </p>

          <ul className="space-y-2.5 pt-1">
            {strengths.length === 0 ? (
              <li className="text-xs text-slate-400 italic">No specific strengths recorded.</li>
            ) : (
              strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 text-xs text-emerald-900 leading-relaxed font-medium"
                >
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* IMPROVEMENT OPPORTUNITIES */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-500" />
            Actionable Improvements
          </h3>
          <p className="text-xs text-slate-500">
            Highest-impact adjustments to increase your resume ranking
          </p>

          <ul className="space-y-2.5 pt-1">
            {improvements.length === 0 ? (
              <li className="text-xs text-emerald-600 font-semibold">
                ✓ No immediate critical improvements needed!
              </li>
            ) : (
              improvements.map((imp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/40 border border-amber-100/70 text-xs text-amber-950 leading-relaxed font-medium"
                >
                  <Lightbulb size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* ATS FORMATTING & PARSING ISSUES */}
      {atsIssues.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert size={20} className="text-rose-600" />
              ATS Readability & Formatting Checks
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              {atsIssues.length} Check{atsIssues.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {atsIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
              >
                <AlertTriangle
                  size={16}
                  className={`shrink-0 mt-0.5 ${
                    issue.severity === "high"
                      ? "text-rose-600"
                      : issue.severity === "medium"
                      ? "text-amber-500"
                      : "text-emerald-600"
                  }`}
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded border ${getSeverityBadge(
                        issue.severity
                      )}`}
                    >
                      {issue.severity || "info"} priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{issue.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS LIST */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/70 rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
            <FrogFace size={18} />
            Strategic Resume Optimization Tips
          </h3>

          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-emerald-950 font-medium leading-relaxed"
              >
                <span className="font-bold text-emerald-700 shrink-0">{idx + 1}.</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AtsInsightsCard;

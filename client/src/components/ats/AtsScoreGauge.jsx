import React from "react";
import { Sparkles, ShieldCheck, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import FrogFace from "../FrogLogo";

const AtsScoreGauge = ({ score = 0, summary = {} }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  const getColorTheme = (val) => {
    if (val >= 90) {
      return {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        stroke: "#10B981",
        gradient: "from-emerald-500 to-teal-600",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: CheckCircle2,
      };
    }
    if (val >= 75) {
      return {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        stroke: "#059669",
        gradient: "from-emerald-600 to-teal-700",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: ShieldCheck,
      };
    }
    if (val >= 60) {
      return {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        stroke: "#F59E0B",
        gradient: "from-amber-500 to-orange-500",
        badge: "bg-amber-100 text-amber-800 border-amber-300",
        icon: AlertTriangle,
      };
    }
    if (val >= 40) {
      return {
        text: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
        stroke: "#EA580C",
        gradient: "from-orange-500 to-red-500",
        badge: "bg-orange-100 text-orange-800 border-orange-300",
        icon: AlertTriangle,
      };
    }
    return {
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      stroke: "#EF4444",
      gradient: "from-red-500 to-rose-600",
      badge: "bg-red-100 text-red-800 border-red-300",
      icon: XCircle,
    };
  };

  const theme = getColorTheme(score);
  const StatusIcon = theme.icon;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden">
      {/* Background soft orb */}
      <div
        className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.stroke }}
      />

      {/* CIRCULAR GAUGE */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      {/* SCORE SUMMARY & MESSAGE */}
      <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider ${theme.badge}`}
          >
            <StatusIcon size={14} />
            {summary.label || "ATS Score"}
          </span>

          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <FrogFace size={13} />
            froggie Weighted ATS Engine
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
          {summary.label === "Excellent Match" && "Outstanding Resume Match! 🚀"}
          {summary.label === "Strong Match" && "Great Resume Alignment! ⭐"}
          {summary.label === "Fair Match" && "Good Foundation with Room to Grow 📈"}
          {summary.label === "Needs Improvement" && "Moderate Match – Action Items Needed 💡"}
          {summary.label === "Poor Match" && "Low Role Match Detected ⚠️"}
        </h2>

        <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
          {summary.message ||
            "Your resume has been semantically evaluated against key job competencies, keyword coverage, and ATS formatting standards."}
        </p>
      </div>
    </div>
  );
};

export default AtsScoreGauge;

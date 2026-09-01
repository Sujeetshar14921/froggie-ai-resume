import React from "react";
import {
  Tag,
  Code2,
  Briefcase,
  UserCheck,
  GraduationCap,
  LayoutTemplate,
  FileCheck2,
} from "lucide-react";

const CATEGORIES = [
  {
    key: "keywordMatch",
    label: "Keyword Match",
    weight: "30%",
    icon: Tag,
    color: "bg-emerald-600",
    bgLight: "bg-emerald-50",
    textLight: "text-emerald-700",
  },
  {
    key: "skillsMatch",
    label: "Skills Alignment",
    weight: "25%",
    icon: Code2,
    color: "bg-teal-600",
    bgLight: "bg-teal-50",
    textLight: "text-teal-700",
  },
  {
    key: "experienceMatch",
    label: "Experience Relevance",
    weight: "15%",
    icon: Briefcase,
    color: "bg-slate-900",
    bgLight: "bg-slate-100",
    textLight: "text-slate-800",
  },
  {
    key: "titleMatch",
    label: "Job Title Alignment",
    weight: "10%",
    icon: UserCheck,
    color: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    textLight: "text-emerald-600",
  },
  {
    key: "educationMatch",
    label: "Education Requirements",
    weight: "10%",
    icon: GraduationCap,
    color: "bg-teal-700",
    bgLight: "bg-teal-50",
    textLight: "text-teal-800",
  },
  {
    key: "structure",
    label: "Resume Structure",
    weight: "5%",
    icon: LayoutTemplate,
    color: "bg-emerald-700",
    bgLight: "bg-emerald-50",
    textLight: "text-emerald-800",
  },
  {
    key: "readability",
    label: "ATS Readability",
    weight: "5%",
    icon: FileCheck2,
    color: "bg-slate-800",
    bgLight: "bg-slate-100",
    textLight: "text-slate-800",
  },
];

const AtsScoreBreakdown = ({ scores = {} }) => {
  const getScoreColor = (val) => {
    if (val >= 85) return "text-emerald-600";
    if (val >= 70) return "text-emerald-700";
    if (val >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Score Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent weighted analysis across 7 core hiring dimensions
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => {
          const val = Math.round(scores[cat.key] ?? 0);
          const Icon = cat.icon;

          return (
            <div
              key={cat.key}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${cat.bgLight} ${cat.textLight}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{cat.label}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Weight: {cat.weight}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-black ${getScoreColor(val)}`}>
                    {val}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AtsScoreBreakdown;

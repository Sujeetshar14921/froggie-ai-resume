import React from "react";
import { Sparkles, ShieldCheck, Briefcase, HelpCircle, ArrowRight } from "lucide-react";
import { useCopilot } from "../../hooks/useCopilot";
import FrogFace from "../FrogLogo";

const SUGGESTED_PROMPTS = [
  {
    icon: Sparkles,
    label: "Analyze My Resume",
    prompt: "Please analyze my active resume and give me a clear breakdown of my strengths, weaknesses, and actionable improvements.",
  },
  {
    icon: ShieldCheck,
    label: "Check ATS Score",
    prompt: "Calculate my resume ATS score and tell me what critical keywords and skills I should add to improve it.",
  },
  {
    icon: Briefcase,
    label: "What Job Roles Match Me?",
    prompt: "Based on my resume skills and experience, what job roles and career paths am I the best match for?",
  },
  {
    icon: HelpCircle,
    label: "Ask Me Interview Questions",
    prompt: "Start an interactive mock interview. Ask me 3 challenging technical and behavioral questions based on my resume.",
  },
];

const CopilotQuickActions = () => {
  const { sendMessage, user } = useCopilot();

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* WELCOME HERO CARD */}
      <div className="p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-md space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="size-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <FrogFace size={15} />
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            froggie AI Career Copilot
          </span>
        </div>

        <h3 className="relative z-10 font-black text-base sm:text-lg text-white leading-tight">
          Hi {user?.name?.split(" ")[0] || "there"} 👋
        </h3>

        <p className="relative z-10 text-xs text-slate-300 leading-relaxed">
          Ask me anything! I can analyze your resume, optimize your ATS score, generate bullet points, match jobs, or conduct mock interviews.
        </p>
      </div>

      {/* QUICK PROMPT CHIPS */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Suggested Prompts
        </span>

        <div className="grid sm:grid-cols-2 gap-2.5">
          {SUGGESTED_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => sendMessage(item.prompt)}
                className="text-left p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all duration-150 flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Icon size={14} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-950 transition-colors truncate">
                    {item.label}
                  </span>
                </div>

                <ArrowRight size={13} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CopilotQuickActions;

import React from "react";
import { Sparkles, ShieldCheck, Briefcase, HelpCircle, ArrowRight, Wand2, Zap } from "lucide-react";
import { useCopilot } from "../../hooks/useCopilot";
import FrogFace from "../FrogLogo";

const SUGGESTED_PROMPTS = [
  {
    icon: ShieldCheck,
    title: "ATS Health Audit",
    desc: "Calculate ATS score & missing keywords",
    prompt: "Perform a deep ATS health audit on my active resume. Break down strengths, missing keywords, and specific actionable improvements.",
    badge: "ATS Audit",
    color: "emerald",
  },
  {
    icon: Wand2,
    title: "STAR Bullet Rewriter",
    desc: "Transform bullets with quantifiable impact metrics",
    prompt: "Rewrite my work experience bullet points using the STAR method with quantifiable metric achievements (e.g. % performance, latency, scale).",
    badge: "STAR AI",
    color: "teal",
  },
  {
    icon: Briefcase,
    title: "Target Job Matching",
    desc: "Analyze best career roles suited for my profile",
    prompt: "Based on my resume skills and experience, what job roles and career paths am I the best match for?",
    badge: "Job Match",
    color: "blue",
  },
  {
    icon: HelpCircle,
    title: "Interactive Mock Prep",
    desc: "Practice interview questions tailored to your projects",
    prompt: "Start an interactive technical mock interview based on my resume projects. Ask one question at a time and evaluate my answers.",
    badge: "Mock Interview",
    color: "amber",
  },
];

const CopilotQuickActions = () => {
  const { sendMessage, user } = useCopilot();
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="p-2 sm:p-3 space-y-4 max-w-lg mx-auto">
      {/* WELCOME HERO CARD */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800/90 shadow-xl overflow-hidden">
        {/* Subtle ambient blur */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
            <FrogFace size={13} />
            <span>AI Career Copilot</span>
          </div>

          <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug">
            Hi {firstName} 👋 What can I help you build today?
          </h3>

          <p className="text-[11px] text-slate-300 leading-relaxed max-w-sm font-normal">
            Ask me to audit your ATS score, rewrite bullets with metrics, match target jobs, or conduct mock interviews.
          </p>
        </div>
      </div>

      {/* SUGGESTED PROMPT TILES */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap size={12} className="text-emerald-500" />
            Quick Actions
          </span>
          <span className="text-[10px] text-slate-400 font-medium">1-Click start</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5">
          {SUGGESTED_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => sendMessage(item.prompt)}
                className="text-left p-3.5 rounded-xl bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="size-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Icon size={14} />
                    </div>

                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-950 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                  <span>Run</span>
                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CopilotQuickActions;

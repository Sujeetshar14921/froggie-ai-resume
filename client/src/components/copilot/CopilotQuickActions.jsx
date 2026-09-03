import React from "react";
import { Sparkles, ShieldCheck, Briefcase, HelpCircle, ArrowRight, Wand2, Zap } from "lucide-react";
import { useCopilot } from "../../hooks/useCopilot";
import FrogFace from "../FrogLogo";

const SUGGESTED_PROMPTS = [
  {
    icon: ShieldCheck,
    title: "ATS Resume Health Audit",
    desc: "Calculate ATS score, missing keywords & formatting warnings",
    prompt: "Perform a deep ATS health audit on my active resume. Break down strengths, missing keywords, and specific actionable improvements.",
    badge: "Most Popular",
    color: "emerald",
  },
  {
    icon: Wand2,
    title: "Enhance Bullet Points",
    desc: "Rewrite experience using STAR method with measurable metrics",
    prompt: "Rewrite my work experience bullet points using the STAR method with quantifiable metric achievements (e.g. % performance, latency, scale).",
    badge: "AI Polish",
    color: "teal",
  },
  {
    icon: Briefcase,
    title: "Job Matching & Roles",
    desc: "Find which roles match my current skills and experience",
    prompt: "Based on my resume skills and experience, what job roles and career paths am I the best match for?",
    badge: "Career Match",
    color: "blue",
  },
  {
    icon: HelpCircle,
    title: "Interactive Mock Interview",
    desc: "Practice behavioral and technical questions with AI evaluation",
    prompt: "Start an interactive technical mock interview based on my resume projects. Ask one question at a time and evaluate my answers.",
    badge: "Interview Prep",
    color: "amber",
  },
];

const CopilotQuickActions = () => {
  const { sendMessage, user } = useCopilot();
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-xl mx-auto">
      {/* WELCOME HERO CARD */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl overflow-hidden">
        {/* Radiant ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Minimal dot matrix pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <FrogFace size={15} />
            <span>AI CAREER STRATEGIST</span>
          </div>

          <h3 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
            Hi {firstName} 👋 How can I help you land your dream job?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
            I understand your resume context. Ask me to audit your ATS score, rewrite bullets with metrics, match target jobs, or conduct mock interviews.
          </p>
        </div>
      </div>

      {/* SUGGESTED BENTO PROMPT CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap size={13} className="text-emerald-500" />
            Quick Prompts
          </span>
          <span className="text-[11px] text-slate-400 font-medium">1-Click start</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {SUGGESTED_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => sendMessage(item.prompt)}
                className="text-left p-4 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                      <Icon size={16} />
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-950 transition-colors leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                  <span>Start action</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
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

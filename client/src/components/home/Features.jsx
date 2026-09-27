import React, { useEffect, useRef } from "react";
import {
  Sparkles,
  Download,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  ArrowRight,
  Bot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FrogFace from "../FrogLogo";
import { initFeaturesAnimation } from "../../animations";

const pillars = [
  {
    id: "build",
    tag: "01 · Fast Resume Studio",
    title: "Instant Section Reordering & Layout Engine",
    description:
      "Craft professional resumes without layout breakages. Modular sections for Experience, Education, Projects, and Skills that automatically adapt to ATS single-column standards.",
    badge: "ATS Formatter",
  },
  {
    id: "optimize",
    tag: "02 · AI Copilot",
    title: "STAR-Method & XYZ Bullet Enhancer",
    description:
      "Transform weak descriptions into quantified career achievements. Automatically incorporate impact numbers, action verbs, and role-specific competencies.",
    badge: "AI Powered",
  },
  {
    id: "analyze",
    tag: "03 · Real-Time ATS Audit",
    title: "Pre-Flight ATS Scanner & Gap Detector",
    description:
      "Scan resumes against target job descriptions. Uncover missing industry keywords, parsing errors, and structural red flags before submitting to Workday or Greenhouse.",
    badge: "99.4% Pass Rate",
  },
  {
    id: "export",
    tag: "04 · Seamless Delivery",
    title: "1-Click PDF & Word Export + Tracker",
    description:
      "Download high-resolution ATS-optimized PDFs or editable DOCX files with zero watermarks. Track submitted applications directly within your unified dashboard.",
    badge: "Free Export",
  },
];

const Features = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cleanup = initFeaturesAnimation(containerRef.current);
    return cleanup;
  }, []);

  return (
    <section id="features" ref={containerRef} className="py-24 bg-slate-50/70 relative overflow-hidden border-t border-slate-200/60">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap size={13} className="text-emerald-600" />
            Core Architecture
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Engineered to Solve the{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              4 Biggest Hiring Roadblocks
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            From first draft to recruiter callback—everything you need in one cohesive platform.
          </p>
        </div>

        {/* 4-PILLAR FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* PILLAR 1: BUILD */}
          <div className="bento-card group rounded-3xl bg-white/90 border border-slate-200/80 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
            {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                  {pillars[0].tag}
                </span>
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Layers size={20} />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2.5">
                {pillars[0].title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {pillars[0].description}
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Live Section Sync
                </span>
                <span className="text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded text-[10px]">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-medium">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/80 shadow-2xs font-semibold">Experience</div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/80 shadow-2xs font-semibold">Skills</div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/80 shadow-2xs font-semibold">Education</div>
              </div>
            </div>
          </div>

          {/* PILLAR 2: OPTIMIZE (AI COPILOT) */}
          <div className="bento-card group rounded-3xl bg-slate-950 text-white border border-slate-800 p-7 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/25 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  {pillars[1].tag}
                </span>
                <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Sparkles size={20} />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2.5">
                {pillars[1].title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {pillars[1].description}
              </p>
            </div>

            {/* PRODUCT UI SNIPPET (AI GENERATOR BEFORE/AFTER) */}
            <div className="relative z-10 p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-1.5 text-xs backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                <Bot size={13} />
                <span>AI Rewritten Bullet</span>
              </div>
              <p className="text-slate-200 text-xs italic leading-relaxed">
                "Led API re-architecture reducing latency by 42% across 2.5M daily transactions."
              </p>
            </div>
          </div>

          {/* PILLAR 3: ANALYZE (ATS AUDIT) */}
          <div className="bento-card group rounded-3xl bg-white/90 border border-slate-200/80 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
            {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 via-indigo-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                  {pillars[2].tag}
                </span>
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2.5">
                {pillars[2].title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {pillars[2].description}
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                  96%
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">ATS Compatibility</p>
                  <p className="text-[10px] text-slate-500">Zero parsing bottlenecks</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Pass Verified</span>
            </div>
          </div>

          {/* PILLAR 4: EXPORT & MANAGE */}
          <div className="bento-card group rounded-3xl bg-white/90 border border-slate-200/80 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between backdrop-blur-sm relative overflow-hidden">
            {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 via-pink-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                  {pillars[3].tag}
                </span>
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Download size={20} />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2.5">
                {pillars[3].title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {pillars[3].description}
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span className="text-xs font-semibold">PDF & DOCX Generated Instantly</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">No Watermarks</span>
            </div>
          </div>

        </div>

        {/* BOTTOM QUICK ACTION */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/app")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-500/30"
          >
            <span>Explore All Resume Features</span>
            <ArrowRight size={14} className="text-emerald-400" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Features;
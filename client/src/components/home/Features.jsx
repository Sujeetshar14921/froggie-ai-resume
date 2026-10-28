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
    tag: "02 · AI Enhancer",
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
    <section id="features" ref={containerRef} className="py-10 sm:py-20 lg:py-24 bg-slate-50/70 dark:bg-[#0c1222] relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200/90 text-emerald-900 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4 shadow-2xs">
            <Zap size={14} className="text-emerald-600" />
            Core Architecture
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-slate-50 tracking-tight">
            Engineered to Solve the{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              4 Biggest Hiring Roadblocks
            </span>
          </h2>

          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal">
            From first draft to recruiter callback—everything you need in one cohesive platform.
          </p>
        </div>

        {/* 4-PILLAR FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {/* PILLAR 1: BUILD */}
          <div className="bento-card glass-card-elevated group rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/20 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-1 rounded-full shadow-2xs">
                  {pillars[0].tag}
                </span>
                <div className="icon-3d-pod icon-3d-pod-emerald size-12 rounded-2xl flex items-center justify-center">
                  <Layers size={22} className="lucide-3d" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2.5">
                {pillars[0].title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                {pillars[0].description}
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5 text-xs shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Live Section Sync
                </span>
                <span className="text-emerald-800 bg-emerald-100/90 font-black px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-bold">
                <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">Experience</div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">Skills</div>
                <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">Education</div>
              </div>
            </div>
          </div>

          {/* PILLAR 2: OPTIMIZE (AI COPILOT) */}
          <div className="bento-card glass-dark-elevated group rounded-2xl sm:rounded-3xl text-white p-5 sm:p-7 lg:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/25 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full shadow-2xs">
                  {pillars[1].tag}
                </span>
                <div className="icon-3d-pod icon-3d-pod-dark size-11 sm:size-12 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Sparkles size={20} className="lucide-3d" />
                </div>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mb-2 sm:mb-2.5">
                {pillars[1].title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-normal">
                {pillars[1].description}
              </p>
            </div>

            {/* PRODUCT UI SNIPPET (AI GENERATOR BEFORE/AFTER) */}
            <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2 text-xs backdrop-blur-md shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                <Bot size={13} />
                <span>AI Rewritten STAR Bullet</span>
              </div>
              <p className="text-slate-200 text-xs italic leading-relaxed">
                "Led API re-architecture reducing latency by 42% across 2.5M daily transactions."
              </p>
            </div>
          </div>

          {/* PILLAR 3: ANALYZE (ATS AUDIT) */}
          <div className="bento-card glass-card-elevated group rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-500/20 via-indigo-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-1 rounded-full shadow-2xs">
                  {pillars[2].tag}
                </span>
                <div className="icon-3d-pod icon-3d-pod-blue size-11 sm:size-12 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={20} className="lucide-3d text-white" />
                </div>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mb-2 sm:mb-2.5">
                {pillars[2].title}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-normal">
                {pillars[2].description}
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="size-9 sm:size-10 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs sm:text-sm flex items-center justify-center shadow-inner">
                  96%
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xs">ATS Compatibility</p>
                  <p className="text-[10px] text-slate-500 font-medium">Zero parsing bottlenecks</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-100/90 px-2 sm:px-2.5 py-1 rounded-lg">Pass Verified</span>
            </div>
          </div>

          {/* PILLAR 4: EXPORT & MANAGE */}
          <div className="bento-card glass-card-elevated group rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-purple-500/20 via-pink-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-1 rounded-full shadow-2xs">
                  {pillars[3].tag}
                </span>
                <div className="icon-3d-pod icon-3d-pod-purple size-11 sm:size-12 rounded-2xl flex items-center justify-center">
                  <Download size={20} className="lucide-3d text-white" />
                </div>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mb-2 sm:mb-2.5">
                {pillars[3].title}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-normal">
                {pillars[3].description}
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between text-xs font-medium text-slate-700 shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">PDF & DOCX Instant Engine</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">No Watermarks</span>
            </div>
          </div>

        </div>

        {/* BOTTOM QUICK ACTION */}
        <div className="mt-8 sm:mt-14 text-center">
          <button
            onClick={() => navigate("/app")}
            className="shimmer-button inline-flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-black shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-500/40"
          >
            <span>Explore All Resume Features</span>
            <ArrowRight size={15} className="text-emerald-400" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Features;
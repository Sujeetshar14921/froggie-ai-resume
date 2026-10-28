import React, { useEffect, useRef } from "react";
import {
  FileText,
  ShieldCheck,
  Briefcase,
  Crop,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Bell,
  Check,
  Search,
  ExternalLink,
  Bot,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initFeaturesAnimation } from "../../animations";

const Features = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cleanup = initFeaturesAnimation(containerRef.current);
    return cleanup;
  }, []);

  return (
    <section
      id="features"
      ref={containerRef}
      className="py-14 sm:py-20 lg:py-28 bg-slate-50/70 dark:bg-[#080d1a] relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800 transition-colors duration-200"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-72 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-200/90 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
            <Zap size={14} className="text-emerald-600 dark:text-emerald-400" />
            Complete Career Suite
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-slate-50 tracking-tight leading-tight">
            5 Integrated Powerhouse Tools To{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Land Your Next Offer
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto">
            Everything you need in one unified ecosystem—from writing and ATS auditing to private photo studio and recruiter discovery.
          </p>
        </div>

        {/* 5-MODULE BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
          
          {/* ======================================================== */}
          {/* CARD 1: DUAL-PANE AI RESUME BUILDER (HERO CARD - 7 COLS) */}
          {/* ======================================================== */}
          <div className="bento-card glass-card-elevated group rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden md:col-span-2 lg:col-span-7 border border-slate-200/80 dark:border-slate-800">
            {/* Colorful subtle accent corner */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/20 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800 px-3 py-1 rounded-full shadow-2xs">
                  01 · Live Resume Studio
                </span>
                <div className="icon-3d-pod icon-3d-pod-emerald size-11 sm:size-12 rounded-2xl flex items-center justify-center">
                  <FileText size={22} className="lucide-3d text-white" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2.5">
                Dual-Pane AI Resume Builder
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Build recruiter-ready resumes in real time with 10 ATS-optimized templates, dynamic section reordering, smart PDF/Word import, and STAR-method AI bullet enhancements with zero watermark PDF & Word exports.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 mb-6 text-[11px] font-bold">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                  <Check size={12} className="text-emerald-500" /> 10 ATS Templates
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                  <Bot size={12} className="text-teal-500" /> STAR & XYZ AI Bullets
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                  <SlidersHorizontal size={12} className="text-emerald-500" /> Drag & Reorder
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                  <Check size={12} className="text-emerald-500" /> Smart PDF Import
                </span>
              </div>
            </div>

            {/* PRODUCT UI PREVIEW MOCKUP */}
            <div className="relative z-10 mt-auto pt-2">
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs shadow-2xs">
                {/* Simulated Editor Toolbar */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Dual-Pane Sync</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      Auto-Saved
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      PDF & DOCX Ready
                    </span>
                  </div>
                </div>

                {/* Simulated Form Sections + Live Output */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-[11px]">
                  <div className="sm:col-span-5 bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700 space-y-1.5">
                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-400">Editor Pane</p>
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-md w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-md w-5/6" />
                  </div>
                  <div className="sm:col-span-7 bg-emerald-50/60 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-black text-emerald-800 dark:text-emerald-300">
                      <span>Pixel-Perfect Preview</span>
                      <span>Page 1 of 1</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-bold text-[11px] leading-tight">
                      Senior Software Engineer · Silicon Valley
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      • Spearheaded distributed microservices pipeline handling 3.2M requests/min with 99.98% uptime.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => navigate("/app")}
                  className="inline-flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors group-hover:translate-x-1 duration-200 cursor-pointer"
                >
                  <span>Open Resume Builder</span>
                  <ArrowRight size={14} />
                </button>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">100% Free to Build</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 2: ATS SCORE CHECKER (DARK ACCENT CARD - 5 COLS)     */}
          {/* ======================================================== */}
          <div className="bento-card glass-dark-elevated group rounded-3xl text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden md:col-span-2 lg:col-span-5 border border-emerald-500/30">
            {/* Subtle glow corner */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/25 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full shadow-2xs">
                  02 · 100% Public Scanner
                </span>
                <div className="icon-3d-pod icon-3d-pod-dark size-11 sm:size-12 rounded-2xl flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={22} className="lucide-3d" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2.5">
                ATS Score & Gap Checker
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Audit your resume against any Job Description without login. Uncover missing recruiter keywords, parsing bottlenecks, and get 1-click AI optimization recommendations.
              </p>
            </div>

            {/* PRODUCT UI SNIPPET (SCORE + GAP ANALYSIS) */}
            <div className="relative z-10 mt-auto pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 text-xs backdrop-blur-md shadow-2xs">
                {/* Score Dial + Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black text-base flex items-center justify-center shadow-lg">
                      94%
                    </div>
                    <div>
                      <p className="font-black text-white text-xs">High Recruiter Match</p>
                      <p className="text-[10px] text-emerald-400 font-medium">Ready for Workday & Greenhouse</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Passed
                  </span>
                </div>

                {/* Keyword Gap Breakdown */}
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Target JD Keywords</span>
                    <span className="text-emerald-400 font-bold">18 of 20 Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      ✓ React.js
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      ✓ System Design
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      ✓ TypeScript
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      + Add Docker
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => navigate("/ats-checker")}
                  className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-1 duration-200 cursor-pointer"
                >
                  <span>Check ATS Score Free</span>
                  <ArrowRight size={14} />
                </button>
                <span className="text-[11px] font-semibold text-slate-400">No Login Needed</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 3: APPLICATION & JOB TRACKER (4 COLS)                */}
          {/* ======================================================== */}
          <div className="bento-card glass-card-elevated group rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden md:col-span-1 lg:col-span-4 border border-slate-200/80 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-500/20 via-indigo-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800 px-3 py-1 rounded-full shadow-2xs">
                  03 · Job Pipeline
                </span>
                <div className="icon-3d-pod icon-3d-pod-blue size-11 rounded-2xl flex items-center justify-center">
                  <Briefcase size={20} className="lucide-3d text-white" />
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Job Application Tracker
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4 font-normal">
                Organize your entire job hunt with a visual Kanban pipeline. Set interview reminders with native browser notifications.
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 mt-auto pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs shadow-2xs">
                {/* Kanban mini stages */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black">
                  <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Applied <span className="text-blue-600 dark:text-blue-400 font-extrabold">(12)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Interview <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">(3)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Offer <span className="text-teal-600 dark:text-teal-400 font-extrabold">(1)</span>
                  </div>
                </div>

                {/* Reminder Alert Item */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900 text-[10px] text-blue-900 dark:text-blue-300 font-bold">
                  <Bell size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">Google Tech Round 2 · Tomorrow 3 PM</span>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-4">
                <button
                  onClick={() => navigate("/app/tracker")}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-200 cursor-pointer"
                >
                  <span>Manage Applications</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 4: FILE STUDIO & PHOTO CUTOUT (4 COLS)               */}
          {/* ======================================================== */}
          <div className="bento-card glass-card-elevated group rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden md:col-span-1 lg:col-span-4 border border-slate-200/80 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-purple-500/20 via-pink-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800 px-3 py-1 rounded-full shadow-2xs">
                  04 · Local Privacy First
                </span>
                <div className="icon-3d-pod icon-3d-pod-purple size-11 rounded-2xl flex items-center justify-center">
                  <Crop size={20} className="lucide-3d text-white" />
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                File Studio & Headshot Cutout
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4 font-normal">
                Crop corporate headshots, create AI background cutouts, and compress files for portals—100% processed locally in your browser.
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 mt-auto pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
                    Canvas Cutout Engine
                  </span>
                  <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-950 px-2 py-0.5 rounded">
                    Zero Uploads
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/70 dark:border-slate-700 text-center font-bold text-slate-600 dark:text-slate-300">
                    📸 1:1 Headshot Crop
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/70 dark:border-slate-700 text-center font-bold text-slate-600 dark:text-slate-300">
                    ✨ AI BG Remover
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-4">
                <button
                  onClick={() => navigate("/file-studio")}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors group-hover:translate-x-1 duration-200 cursor-pointer"
                >
                  <span>Launch File Studio</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 5: PUBLIC TALENT DIRECTORY (4 COLS)                  */}
          {/* ======================================================== */}
          <div className="bento-card glass-card-elevated group rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden md:col-span-2 lg:col-span-4 border border-slate-200/80 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-teal-500/20 via-emerald-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800 px-3 py-1 rounded-full shadow-2xs">
                  05 · Recruiter Discovery
                </span>
                <div className="icon-3d-pod icon-3d-pod-teal size-11 rounded-2xl flex items-center justify-center">
                  <Users size={20} className="lucide-3d text-white" />
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Public Talent Directory
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4 font-normal">
                Get discovered directly by hiring teams. Feature your verified skills and resume with full 1-click privacy controls.
              </p>
            </div>

            {/* PRODUCT UI SNIPPET */}
            <div className="relative z-10 mt-auto pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 font-black text-[10px] flex items-center justify-center">
                      JD
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Featured Candidate</p>
                      <p className="text-[9px] text-slate-500 dark:text-slate-400">Full Stack Engineer · 6+ Yrs</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-300 bg-teal-100/90 dark:bg-teal-950/80 px-2 py-0.5 rounded">
                    Open to Work
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 text-[9px] font-bold text-slate-600 dark:text-slate-300 pt-1">
                  <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">React</span>
                  <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">Node</span>
                  <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">AWS</span>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-4">
                <button
                  onClick={() => navigate("/talent")}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors group-hover:translate-x-1 duration-200 cursor-pointer"
                >
                  <span>Browse Talent Directory</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM QUICK CALLOUT BANNER */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-black tracking-tight">
              Ready to supercharge your career journey?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Start building your ATS-compliant resume or run an instant scan in less than 60 seconds.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/ats-checker")}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
            >
              Test ATS Score Free
            </button>
            <button
              onClick={() => navigate("/app")}
              className="shimmer-button inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer"
            >
              <span>Build Free Resume</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;

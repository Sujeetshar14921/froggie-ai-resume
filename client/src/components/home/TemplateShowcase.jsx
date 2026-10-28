import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Palette, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { resumeApi } from "../../api/resumeApi";
import { TEMPLATES } from "../../constants/templates";
import toast from "react-hot-toast";
import { initSectionHeaderReveal, animateTemplateSwitch } from "../../animations";

// 4 Selected Featured Templates for Home Showcase
const FEATURED_TEMPLATE_IDS = ["classic", "modern", "minimal", "executive"];
const FEATURED_TEMPLATES = TEMPLATES.filter((tpl) =>
  FEATURED_TEMPLATE_IDS.includes(tpl.id)
);

const TEMPLATE_META = {
  classic: {
    category: "Corporate & Finance",
    roleNote: "Time-tested standard for Fortune 500 & Corporate roles",
  },
  modern: {
    category: "Engineering & Tech",
    roleNote: "Tech-optimized with project cards & timeline markers",
  },
  minimal: {
    category: "Universal / All Industries",
    roleNote: "Zero-clutter Scandinavian design with 100% parsing rate",
  },
  executive: {
    category: "Leadership & C-Suite",
    roleNote: "Distinguished letterhead for Senior Managers & Executives",
  },
};

const colorOptions = [
  { name: "Emerald", value: "#10B981" },
  { name: "Forest", value: "#059669" },
  { name: "Teal", value: "#0F766E" },
  { name: "Ocean", value: "#0284C7" },
  { name: "Corporate Blue", value: "#1E3A8A" },
  { name: "Obsidian", value: "#0F172A" },
];

const TemplateShowcase = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(FEATURED_TEMPLATES[0] || TEMPLATES[0]);
  const [activeColor, setActiveColor] = useState(FEATURED_TEMPLATES[0]?.accent || "#10B981");
  const [isCreating, setIsCreating] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const cleanup = initSectionHeaderReveal(containerRef.current);
    return cleanup;
  }, []);

  const handleTemplateChange = (tpl) => {
    setSelectedTemplate(tpl);
    setActiveColor(tpl.accent || "#10B981");
    if (previewRef.current) {
      animateTemplateSwitch(previewRef.current);
    }
  };

  const handleColorChange = (color) => {
    setActiveColor(color);
    if (previewRef.current) {
      animateTemplateSwitch(previewRef.current);
    }
  };

  const handleUseTemplate = async () => {
    const resumeTitle = user?.name ? `${user.name}'s Resume` : "My Resume";

    if (token) {
      try {
        setIsCreating(true);
        const data = await resumeApi.createResume(
          {
            title: resumeTitle,
            template: selectedTemplate.id,
            accent_color: activeColor,
          },
          token
        );

        toast.success(`Template ${selectedTemplate.name} selected! Ready for editing.`);
        navigate(`/app/builder/${data.resume._id}`);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to initialize template");
      } finally {
        setIsCreating(false);
      }
    } else {
      sessionStorage.setItem(
        "pending_resume_create",
        JSON.stringify({
          template: selectedTemplate.id,
          accent_color: activeColor,
          title: "My Resume",
        })
      );
      toast.success("Please sign in or register to customize this template!");
      navigate("/login?state=register&redirect=template");
    }
  };

  return (
    <section id="templates" ref={containerRef} className="py-12 sm:py-20 lg:py-28 bg-white dark:bg-[#090d16] relative overflow-hidden">
      {/* VIBRANT AMBIENT GLOWS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none blur-2xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/15 via-indigo-400/5 to-transparent rounded-tr-full pointer-events-none blur-2xl" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="section-badge inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4 shadow-2xs">
            4 Featured ATS Templates
          </span>

          <h2 className="section-title text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-slate-50 tracking-tight">
            Choose a Template Designed to{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              Beat the ATS
            </span>
          </h2>

          <p className="section-subtitle mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-slate-600 dark:text-slate-300">
            Curated formats tested with real applicant tracking systems. Switch anytime with 1-click.
          </p>
        </div>

        {/* 4 FEATURED TEMPLATE SELECTOR CARDS (2x2 Mobile, 4-Col Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-8 sm:mb-12">
          {FEATURED_TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplate.id === tpl.id;
            const meta = TEMPLATE_META[tpl.id] || { category: "ATS Optimized" };
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleTemplateChange(tpl)}
                className={`group relative p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500/80 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                    : "bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.01]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 text-[9px] sm:text-[10px] font-black rounded-md uppercase tracking-wider ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tpl.badge || "Featured"}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {tpl.atsScore} ATS
                  </span>
                </div>

                <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {tpl.name}
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {meta.category}
                </div>

                {isSelected && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* INTERACTIVE PREVIEW CONTAINER */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-slate-900/90 dark:to-slate-950/90 backdrop-blur-xl rounded-3xl p-5 sm:p-8 lg:p-12 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl">

          {/* LEFT: DETAILS & COLOR PICKER */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3 border border-emerald-200/80 dark:border-emerald-800/60">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>{selectedTemplate.atsScore} Verified ATS Match Rate</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {selectedTemplate.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                {selectedTemplate.description}
              </p>
            </div>

            {/* BEST FOR */}
            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                Recommended For
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTemplate.bestFor.split(", ").map((role) => (
                  <span
                    key={role}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* FEATURES LIST */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Key Template Features
              </span>
              {selectedTemplate.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs transition-colors duration-200"
                    style={{ backgroundColor: activeColor }}
                  >
                    <Check size={12} />
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* COLOR ACCENT PICKER */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Palette size={13} />
                Customize Accent Color
              </span>
              <div className="flex items-center gap-2.5">
                {colorOptions.map((c) => {
                  const isCurrent = activeColor === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleColorChange(c.value)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-sm flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                        isCurrent
                          ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-offset-slate-900 dark:ring-white scale-105"
                          : ""
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                      aria-label={`Select ${c.name} color`}
                    >
                      {isCurrent && <Check size={13} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleUseTemplate}
                disabled={isCreating}
                className="shimmer-button w-full px-6 py-4 bg-slate-950 dark:bg-emerald-600 hover:bg-slate-900 dark:hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/40"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-emerald-300" />
                    <span>Preparing Template Studio...</span>
                  </>
                ) : (
                  <>
                    <span>Use {selectedTemplate.name} Studio</span>
                    <ArrowRight size={16} className="text-emerald-400 dark:text-white" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: REAL-TIME AUTHENTIC RESUME SHEET PREVIEW */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              ref={previewRef}
              className="w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-700/80 overflow-hidden text-[12px] sm:text-[13px] leading-snug transition-all"
            >
              {/* Sheet Window Header */}
              <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-2">
                  <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-400/80 inline-block" />
                    <span className="size-2.5 rounded-full bg-amber-400/80 inline-block" />
                    <span className="size-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  </span>
                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 ml-2 truncate">
                    {selectedTemplate.id}-resume.pdf
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{selectedTemplate.atsScore} ATS Approved</span>
                </div>
              </div>

              {/* SHEET CONTENT ACCORDING TO TEMPLATE */}
              {selectedTemplate.id === "modern" ? (
                /* 1. MODERN TECH FORMAT */
                <div>
                  <div
                    className="p-5 text-white transition-colors duration-300"
                    style={{ backgroundColor: activeColor }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-black tracking-tight">Alex Morgan</h4>
                        <p className="text-xs font-medium opacity-90 mt-0.5">Staff Software Engineer · Infrastructure</p>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 bg-white/20 rounded-md font-mono font-semibold">
                        San Francisco, CA
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] opacity-85 mt-2.5 font-mono">
                      <span>✉ alex@morgan.dev</span>
                      <span>⌥ github.com/alexmorgan</span>
                      <span>☎ +1 (415) 555-0192</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4 text-slate-800">
                    <div>
                      <h5
                        className="font-bold text-xs uppercase tracking-wider mb-1"
                        style={{ color: activeColor }}
                      >
                        Technical Summary
                      </h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Engineering lead with 6+ years driving distributed systems architecture, microservices scaling, and high-impact teams at hyper-growth scale.
                      </p>
                    </div>

                    <div>
                      <h5
                        className="font-bold text-xs uppercase tracking-wider mb-2"
                        style={{ color: activeColor }}
                      >
                        Experience
                      </h5>
                      <div className="space-y-2.5">
                        <div>
                          <div className="flex justify-between font-bold text-slate-900 text-xs">
                            <span className="flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full" style={{ backgroundColor: activeColor }} />
                              Staff Engineer · Stripe
                            </span>
                            <span className="text-slate-400 font-normal">2022 – Present</span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5 pl-3">
                            • Scaled payments engine throughput by 300% across international markets.
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5 pl-3">
                            • Decreased end-to-end API latency by 42% via optimized Go gRPC services.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5
                        className="font-bold text-xs uppercase tracking-wider mb-2"
                        style={{ color: activeColor }}
                      >
                        Core Tech Stack
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {["Go", "TypeScript", "React", "Kafka", "PostgreSQL", "AWS Cloud", "Kubernetes", "GraphQL"].map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedTemplate.id === "executive" ? (
                /* 2. EXECUTIVE LEADERSHIP FORMAT */
                <div>
                  <div className="p-5 bg-slate-950 text-white border-b-2" style={{ borderColor: activeColor }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="size-10 rounded-lg flex items-center justify-center font-black text-white text-sm shrink-0"
                        style={{ backgroundColor: activeColor }}
                      >
                        AM
                      </div>
                      <div>
                        <h4 className="text-lg font-black tracking-wide">ALEXANDER MORGAN, M.S.</h4>
                        <p className="text-xs text-slate-300 font-medium">VP of Engineering & Technology Strategy</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4 text-slate-800">
                    <div
                      className="border-l-3 pl-3 py-1.5 bg-slate-50 rounded-r text-xs text-slate-700 italic"
                      style={{ borderColor: activeColor }}
                    >
                      "Visionary technology executive with 10+ years scaling multi-tier organizations from Series B to $180M+ ARR public enterprise scale."
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center py-1">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-xs font-black text-slate-900">+300%</div>
                        <div className="text-[10px] text-slate-500">Platform Scale</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-xs font-black text-slate-900">$45M+</div>
                        <div className="text-[10px] text-slate-500">ARR Impact</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-xs font-black text-slate-900">140+</div>
                        <div className="text-[10px] text-slate-500">Engineers Led</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider mb-1.5" style={{ color: activeColor }}>
                        Executive Experience
                      </h5>
                      <div className="flex justify-between font-bold text-slate-900 text-xs">
                        <span>VP of Engineering · Enterprise Cloud</span>
                        <span className="text-slate-400 font-normal">2022 – Present</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        • Directing $24M engineering budget across distributed platform and infrastructure teams.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider mb-1.5" style={{ color: activeColor }}>
                        Leadership Competencies
                      </h5>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                        {["Organizational Architecture", "P&L Budget Oversight", "Cloud Transformation", "Executive Stakeholder Mgmt"].map((s) => (
                          <div key={s} className="flex items-center gap-1.5">
                            <span className="size-1 rounded-full" style={{ backgroundColor: activeColor }} />
                            <span className="font-semibold text-slate-700">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedTemplate.id === "minimal" ? (
                /* 3. ATS PRO MINIMAL FORMAT */
                <div className="p-6 space-y-4 text-slate-900">
                  <div className="border-b border-slate-200 pb-3">
                    <h4 className="text-2xl font-black tracking-tight text-slate-950">Alex Morgan</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Senior Software Engineer | System Architect</p>
                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono mt-2">
                      <span>alex@morgan.dev</span>
                      <span>•</span>
                      <span>+1 (415) 555-0192</span>
                      <span>•</span>
                      <span>San Francisco, CA</span>
                    </div>
                  </div>

                  <div>
                    <h5
                      className="font-bold text-xs uppercase tracking-widest pb-0.5 mb-1.5 border-b"
                      style={{ color: activeColor, borderColor: `${activeColor}40` }}
                    >
                      Summary
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      High-impact systems engineer with extensive background in scalable microservices, automated CI/CD pipelines, and high-reliability cloud architecture.
                    </p>
                  </div>

                  <div>
                    <h5
                      className="font-bold text-xs uppercase tracking-widest pb-0.5 mb-1.5 border-b"
                      style={{ color: activeColor, borderColor: `${activeColor}40` }}
                    >
                      Experience
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between font-bold text-xs">
                        <span className="text-slate-900">Staff Engineer — Stripe</span>
                        <span className="text-slate-500 font-normal">2022 – Present</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        • Led infrastructure re-architecture saving $1.2M in annual cloud compute costs.
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        • Standardized automated deployment pipelines across 40+ engineering squads.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5
                      className="font-bold text-xs uppercase tracking-widest pb-0.5 mb-1.5 border-b"
                      style={{ color: activeColor, borderColor: `${activeColor}40` }}
                    >
                      Technical Skills
                    </h5>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Go, TypeScript, Node.js, Python, PostgreSQL, Redis, Docker, Kubernetes, AWS, System Design, CI/CD
                    </p>
                  </div>
                </div>
              ) : (
                /* 4. CLASSIC CORPORATE (DEFAULT) */
                <div className="p-6 space-y-4 text-slate-800">
                  <div className="text-center pb-2">
                    <h4 className="text-xl font-bold tracking-wider text-slate-950 font-serif">ALEX MORGAN</h4>
                    <p className="text-[11px] font-semibold text-slate-500 tracking-wider mt-0.5 uppercase">
                      Senior Software Architect · Distributed Systems
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      San Francisco, CA · (415) 555-0192 · alex@morgan.dev · linkedin.com/in/alexmorgan
                    </p>
                    <div className="w-full h-[2px] mt-3" style={{ backgroundColor: activeColor }} />
                  </div>

                  <div>
                    <h5
                      className="font-bold text-xs uppercase tracking-wider mb-1"
                      style={{ color: activeColor }}
                    >
                      Professional Summary
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Time-tested standard format with elegant typography loved by Fortune 500 recruiters and corporate employers. Designed for maximum ATS parser accuracy.
                    </p>
                  </div>

                  <div>
                    <h5
                      className="font-bold text-xs uppercase tracking-wider mb-2"
                      style={{ color: activeColor }}
                    >
                      Professional Experience
                    </h5>
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-900 text-xs">
                        <span>Staff Software Engineer · Stripe</span>
                        <span className="text-slate-500 font-normal">2022 – Present</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        • Scaled payments engine throughput by 300% across international markets.
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        • Engineered distributed consensus caching reducing P99 latency by 45ms.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5
                      className="font-bold text-xs uppercase tracking-wider mb-1.5"
                      style={{ color: activeColor }}
                    >
                      Core Competencies
                    </h5>
                    <div className="flex flex-wrap items-center gap-y-1 text-xs text-slate-800">
                      {["Full-Stack Architecture", "Go & TypeScript", "Cloud Infrastructure", "Kubernetes", "System Design"].map((s, idx) => (
                        <span key={s} className="inline-flex items-center">
                          {idx > 0 && <span className="mx-2 text-slate-300 font-bold select-none">•</span>}
                          <span className="font-semibold text-slate-700 text-[11px]">{s}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM STUDIO DISCOVERY BADGE */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <Sparkles size={14} className="text-emerald-500" />
            <span>Looking for more styles? All 10+ battle-tested formats are available inside the studio.</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TemplateShowcase;

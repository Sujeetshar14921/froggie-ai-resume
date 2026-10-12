import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Check, Layout, Palette, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { resumeApi } from "../../api/resumeApi";
import { TEMPLATES } from "../../constants/templates";
import toast from "react-hot-toast";
import FrogFace from "../FrogLogo";
import { initSectionHeaderReveal, animateTemplateSwitch } from "../../animations";

const colorOptions = [
  { name: "Emerald", value: "#10B981" },
  { name: "Forest", value: "#059669" },
  { name: "Teal", value: "#0F766E" },
  { name: "Ocean", value: "#0284C7" },
  { name: "Corporate Blue", value: "#1E3A8A" },
  { name: "Obsidian", value: "#0F172A" },
];

const TemplateShowcase = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [activeColor, setActiveColor] = useState("#10B981");
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
    <section id="templates" ref={containerRef} className="py-10 sm:py-20 lg:py-28 bg-white dark:bg-[#090d16] relative overflow-hidden">
      {/* VIBRANT HALF-CIRCLE AMBIENT GLOWS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none blur-2xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/15 via-indigo-400/5 to-transparent rounded-tr-full pointer-events-none blur-2xl" />

      {/* Background radiant orbs */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <span className="section-badge inline-flex items-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4 shadow-2xs">
            <FrogFace size={15} />
            10 Battle-Tested ATS Formats
          </span>

          <h2 className="section-title text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-slate-50 tracking-tight">
            Choose a Template Designed to{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Beat the ATS
            </span>
          </h2>

          <p className="section-subtitle mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-slate-600 dark:text-slate-300">
            Switch templates with 1-click at any time. Your content seamlessly reformats.
          </p>
        </div>

        {/* TEMPLATE PICKER TABS - Native Horizontal Scroll On Mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-12 overflow-x-auto sm:flex-wrap sm:justify-center pb-2 sm:pb-0 no-scrollbar">
          {TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplate.id === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => handleTemplateChange(tpl)}
                className={`shrink-0 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-2xs ${
                  isSelected
                    ? "bg-slate-950 dark:bg-emerald-600 text-white shadow-md scale-102 sm:scale-105 border border-emerald-500/50"
                    : "bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-slate-200/80 dark:border-slate-800 hover:scale-102"
                }`}
              >
                <span>{tpl.name}</span>
                {tpl.badge && (
                  <span
                    className={`px-1.5 py-0.2 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] rounded-full font-bold uppercase tracking-wider ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent dark:border-slate-700"
                    }`}
                  >
                    {tpl.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* INTERACTIVE PREVIEW CARD */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center glass-card-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 border border-slate-200/90 shadow-2xl">

          {/* LEFT: DETAILS & COLOR PICKER */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3 border border-emerald-200/80 dark:border-emerald-800/60">
                <FrogFace size={14} />
                Selected: {selectedTemplate.name}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {selectedTemplate.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
                {selectedTemplate.description}
              </p>
            </div>

            {/* BEST FOR */}
            <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Recommended For
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">
                {selectedTemplate.bestFor}
              </p>
            </div>

            {/* FEATURES LIST */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Key Template Features
              </span>
              {selectedTemplate.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: activeColor }}
                  >
                    <Check size={12} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* COLOR ACCENT PICKER */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Palette size={13} />
                Customize Accent Color
              </span>
              <div className="flex items-center gap-2.5">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleColorChange(c.value)}
                    className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-all hover:scale-110 cursor-pointer ring-2"
                    style={{
                      backgroundColor: c.value,
                      borderColor: activeColor === c.value ? c.value : "transparent",
                    }}
                    title={c.name}
                  >
                    {activeColor === c.value && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-4">
              <button
                onClick={handleUseTemplate}
                disabled={isCreating}
                className="shimmer-button w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/40"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-emerald-400" />
                    <span>Preparing Template Studio...</span>
                  </>
                ) : (
                  <>
                    <span>Use {selectedTemplate.name} Studio</span>
                    <ArrowRight size={16} className="text-emerald-400" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: REAL-TIME TEMPLATE SHEET PREVIEW */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              ref={previewRef}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-[13px] leading-snug"
            >
              {/* Simulated Header */}
              <div
                className="p-6 text-white transition-colors duration-300"
                style={{
                  backgroundColor:
                    selectedTemplate.id === "modern"
                      ? activeColor
                      : selectedTemplate.id === "executive"
                      ? "#0f172a"
                      : "#0f172a",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold">Alex Morgan</h4>
                    <p className="text-xs opacity-90 font-medium">Senior Software Engineer</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded font-mono">
                    San Francisco, CA
                  </span>
                </div>
              </div>

              {/* Simulated Body */}
              <div className="p-6 space-y-4">
                {/* Summary */}
                <div>
                  <h5
                    className="font-bold text-xs uppercase tracking-wider mb-1"
                    style={{ color: activeColor }}
                  >
                    Professional Summary
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Engineering lead with 6+ years driving distributed systems architecture, microservices scaling, and high-impact teams.
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <h5
                    className="font-bold text-xs uppercase tracking-wider mb-2"
                    style={{ color: activeColor }}
                  >
                    Experience
                  </h5>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between font-bold text-slate-800 text-xs">
                        <span>Staff Engineer · Stripe</span>
                        <span className="text-slate-400 font-normal">2022 – Present</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        • Scaled payments engine throughput by 300% across international markets.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h5
                    className="font-bold text-xs uppercase tracking-wider mb-2"
                    style={{ color: activeColor }}
                  >
                    Skills & Competencies
                  </h5>
                  {selectedTemplate.id === "executive" ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {["Distributed Systems", "Cloud Infrastructure", "Engineering Leadership", "High-Scale APIs"].map((s) => (
                        <div key={s} className="flex items-center border-l-2 pl-2 py-0.5" style={{ borderColor: `${activeColor}80` }}>
                          <span className="font-semibold text-slate-800 text-[11px]">{s}</span>
                        </div>
                      ))}
                    </div>
                  ) : selectedTemplate.id === "boardroom" ? (
                    <div className="flex flex-wrap items-center gap-y-1.5 text-xs text-slate-800">
                      {["Node.js", "TypeScript", "PostgreSQL", "Docker", "Kubernetes", "AWS"].map((s, idx) => (
                        <span key={s} className="inline-flex items-center">
                          {idx > 0 && <span className="mx-2 font-mono text-slate-300 font-bold select-none">|</span>}
                          <span className="font-mono text-[11px] font-semibold text-slate-800">{s}</span>
                        </span>
                      ))}
                    </div>
                  ) : selectedTemplate.id === "minimal" || selectedTemplate.id === "classic" ? (
                    <div className="flex flex-wrap items-center gap-y-1 text-xs text-slate-800">
                      {["Full-Stack Architecture", "Next.js", "GraphQL", "CI/CD Pipelines", "System Design"].map((s, idx) => (
                        <span key={s} className="inline-flex items-center">
                          {idx > 0 && <span className="mx-2 text-slate-300 font-bold select-none">•</span>}
                          <span className="font-semibold text-slate-800 text-[11px]">{s}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-700 list-none pl-0">
                      {["React / Next.js", "Node.js / Express", "TypeScript", "PostgreSQL", "AWS Cloud", "Docker & CI/CD"].map((s) => (
                        <li key={s} className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: activeColor }} />
                          <span className="font-semibold text-slate-800 text-[11px]">{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TemplateShowcase;

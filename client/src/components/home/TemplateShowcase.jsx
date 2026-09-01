import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Check, Layout, Palette, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { resumeApi } from "../../api/resumeApi";
import { TEMPLATES } from "../../constants/templates";
import toast from "react-hot-toast";
import FrogFace from "../FrogLogo";

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
    <section id="templates" className="py-28 bg-white relative overflow-hidden">
      {/* Background radiant orbs */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FrogFace size={15} />
            7 Battle-Tested ATS Formats
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight"
          >
            Choose a Template Designed to{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Beat the ATS
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600"
          >
            Switch templates with 1-click at any time. Your content seamlessly reformats.
          </motion.p>
        </div>

        {/* TEMPLATE PICKER TABS */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplate.id === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => {
                  setSelectedTemplate(tpl);
                  setActiveColor(tpl.accent || "#10B981");
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-slate-950 text-white shadow-lg scale-105"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950"
                }`}
              >
                <span>{tpl.name}</span>
                {tpl.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-200 text-slate-600"
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
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl">

          {/* LEFT: DETAILS & COLOR PICKER */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200/80">
                <FrogFace size={14} />
                Selected: {selectedTemplate.name}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {selectedTemplate.name}
              </h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                {selectedTemplate.description}
              </p>
            </div>

            {/* BEST FOR */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recommended For
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {selectedTemplate.bestFor}
              </p>
            </div>

            {/* FEATURES LIST */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Key Template Features
              </span>
              {selectedTemplate.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
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
                    onClick={() => setActiveColor(c.value)}
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
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/30"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-emerald-400" />
                    <span>Preparing Template...</span>
                  </>
                ) : (
                  <>
                    <span>Use {selectedTemplate.name}</span>
                    <ArrowRight size={16} className="text-emerald-400" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: REAL-TIME TEMPLATE SHEET PREVIEW */}
          <div className="lg:col-span-7 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTemplate.id + activeColor}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
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
                      Skills
                    </h5>
                    {selectedTemplate.id === "skill-bullet" ? (
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-700">
                        {["React / Next.js", "Node.js / Express", "TypeScript", "PostgreSQL", "AWS Cloud", "Docker & CI/CD"].map((s) => (
                          <li key={s} className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full" style={{ backgroundColor: activeColor }} />
                            <span className="font-semibold">{s}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"].map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold"
                            style={{ backgroundColor: `${activeColor}15`, color: activeColor }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TemplateShowcase;

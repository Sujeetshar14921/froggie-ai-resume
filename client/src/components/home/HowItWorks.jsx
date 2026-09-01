import React from "react";
import { motion } from "framer-motion";
import { LayoutTemplate, Sparkles, DownloadCloud, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FrogFace from "../FrogLogo";

const steps = [
  {
    number: "01",
    icon: LayoutTemplate,
    title: "Choose a Proven ATS Template",
    description:
      "Select from 6+ recruiter-tested, ATS-friendly templates designed for corporate roles, tech engineers, executives, and designers.",
    color: "from-slate-900 to-slate-950",
    shadow: "shadow-slate-900/20",
    badge: "Step 1",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "froggie AI Enhances Content",
    description:
      "Our smart froggie AI assistant automatically polishes your summaries, generates impactful bullet points, and matches job keywords.",
    color: "from-emerald-600 to-teal-700",
    shadow: "shadow-emerald-600/25",
    badge: "Step 2",
  },
  {
    number: "03",
    icon: DownloadCloud,
    title: "Download & Land Interviews",
    description:
      "Export high-resolution PDF or Word documents instantly, share live public links with recruiters, and track job applications.",
    color: "from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/20",
    badge: "Step 3",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-28 bg-white relative overflow-hidden">
      {/* Background radiant orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FrogFace size={15} />
            Simple 3-Step Process
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight"
          >
            How to Build Your Resume in{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Under 5 Minutes
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600"
          >
            No complex formatting, no stress. Just pick, customize with froggie AI, and download.
          </motion.p>
        </div>

        {/* STEP CARDS */}
        <div className="grid md:grid-cols-3 gap-8 relative">

          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-300 -translate-y-12 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="relative z-10 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-lg shadow-slate-100/80 hover:shadow-2xl hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg ${step.shadow}`}
                    >
                      <Icon size={30} />
                    </div>
                    <span className="text-4xl font-black text-slate-200 font-mono">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold mb-3">
                    {step.badge}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <span>Quick & Effortless</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM CTA BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => {
              const el = document.getElementById("templates");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/app");
              }
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-500/30"
          >
            <span>Start Step 1: Choose a Template</span>
            <ArrowRight size={16} className="text-emerald-400" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;

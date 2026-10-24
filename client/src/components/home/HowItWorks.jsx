import React, { useEffect, useRef } from "react";
import { LayoutTemplate, Sparkles, DownloadCloud, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FrogFace from "../FrogLogo";
import { initHowItWorksAnimation } from "../../animations";

const steps = [
  {
    number: "01",
    icon: LayoutTemplate,
    title: "Select an ATS Template",
    description:
      "Choose from 7 recruiter-tested formats engineered for engineers, executives, designers, and career switchers.",
    badge: "Step 1",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Refine With AI Enhancer",
    description:
      "Auto-generate STAR-method bullet points with quantifiable business impact and target job keywords.",
    badge: "Step 2",
  },
  {
    number: "03",
    icon: DownloadCloud,
    title: "Verify Score & Export",
    description:
      "Review your live ATS audit score and export high-resolution PDF or editable Word documents with 1 click.",
    badge: "Step 3",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const cleanup = initHowItWorksAnimation(containerRef.current);
    return cleanup;
  }, []);

  return (
    <section id="how-it-works" ref={containerRef} className="py-10 sm:py-20 lg:py-24 bg-white dark:bg-[#090d16] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-emerald-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3 sm:mb-4 shadow-2xs">
            <FrogFace size={15} />
            Fast 3-Step Workflow
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-slate-50 tracking-tight">
            How to Build Your Resume in{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Under 5 Minutes
            </span>
          </h2>

          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal">
            No messy manual formatting. Input your experience, let AI polish your impact, and download.
          </p>
        </div>

        {/* STEP CARDS */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">

          {/* Connecting line on desktop */}
          <div className="how-connecting-line hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-300 -translate-y-12 z-0 opacity-70" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const gradients = [
              "from-blue-500/20 via-indigo-400/5",
              "from-amber-500/20 via-orange-400/5",
              "from-emerald-500/20 via-teal-400/5",
            ];
            const currentGrad = gradients[idx % gradients.length];

            return (
              <div
                key={step.number}
                className="how-step-card glass-card-elevated relative z-10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden group"
              >
                {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${currentGrad} to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div className="relative z-10 space-y-4">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="icon-3d-pod icon-3d-pod-dark size-14 sm:size-16 rounded-2xl flex items-center justify-center text-emerald-400">
                      <Icon size={26} className="lucide-3d" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 font-mono group-hover:text-emerald-300/40 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/70 rounded-full text-[11px] font-black uppercase tracking-wider">
                    {step.badge}
                  </span>

                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* MINI INTERACTIVE MOCKUP ELEMENT */}
                  <div className="pt-2">
                    {idx === 0 && (
                      <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-slate-700 shadow-2xs">
                        <span className="flex items-center gap-1.5 text-emerald-700">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          7 Formats Loaded
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                          100% Parser Safe
                        </span>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="p-3 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-1 text-[11px] shadow-2xs">
                        <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                          <span>STAR Bullet Polisher</span>
                          <span>+42% Impact</span>
                        </div>
                        <p className="text-slate-300 text-[11px] italic truncate">
                          "Architected API cutting latency by 42%..."
                        </p>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-slate-700 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>PDF & DOCX</span>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-200/80 text-slate-800 rounded font-black text-[10px]">
                          A4 Standard
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <ShieldCheck size={15} />
                  <span>Verified Instant Pipeline</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA BUTTON */}
        <div className="how-cta mt-8 sm:mt-14 text-center">
          <button
            onClick={() => {
              const el = document.getElementById("templates");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/app");
              }
            }}
            className="shimmer-button inline-flex items-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-500/40"
          >
            <span>Start Step 1: Choose a Template</span>
            <ArrowRight size={16} className="text-emerald-400" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;

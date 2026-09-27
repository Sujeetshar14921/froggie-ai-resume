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
    title: "Refine With AI Copilot",
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
    <section id="how-it-works" ref={containerRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-emerald-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <FrogFace size={15} />
            Fast 3-Step Workflow
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            How to Build Your Resume in{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Under 5 Minutes
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            No messy manual formatting. Input your experience, let AI polish your impact, and download.
          </p>
        </div>

        {/* STEP CARDS */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">

          {/* Connecting line on desktop */}
          <div className="how-connecting-line hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-300 -translate-y-10 z-0" />

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
                className="how-step-card relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* COLORFUL HALF-CIRCLE CORNER ACCENT */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${currentGrad} to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div className="relative z-10">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-14 rounded-2xl bg-slate-950 text-emerald-400 flex items-center justify-center shadow-md border border-emerald-500/30">
                      <Icon size={26} />
                    </div>
                    <span className="text-3xl font-black text-slate-200 font-mono">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
                    {step.badge}
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <ShieldCheck size={14} />
                  <span>Instant Verification</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA BUTTON */}
        <div className="how-cta mt-14 text-center">
          <button
            onClick={() => {
              const el = document.getElementById("templates");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/app");
              }
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-500/30"
          >
            <span>Start Step 1: Choose a Template</span>
            <ArrowRight size={15} className="text-emerald-400" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;

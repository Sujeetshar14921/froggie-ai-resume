import React, { useEffect, useRef } from "react";
import {
  Sparkles,
  Upload,
  FileCheck2,
  Download,
  Palette,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle,
} from "lucide-react";
import FrogFace, { BrandIcon } from "../FrogLogo";
import { initFeaturesAnimation } from "../../animations";

const Features = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const cleanup = initFeaturesAnimation(containerRef.current);
    return cleanup;
  }, []);

  return (
    <section id="features" ref={containerRef} className="py-28 bg-slate-50/70 relative overflow-hidden">

      {/* Decorative ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap size={14} />
            Engineered For Success
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Everything You Need to Get{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Hired Faster
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Powerful froggie AI automation paired with precision ATS formatting and designer templates.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[auto]">

          {/* CARD 1: AI WRITER (Large Hero Bento Card) */}
          <div className="bento-card md:col-span-2 lg:col-span-2 bg-slate-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
            {/* Emerald glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <BrandIcon size="lg" className="mb-6" />

              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300">
                froggie AI 2.0 Engine
              </span>

              <h3 className="text-2xl sm:text-3xl font-black mt-4 leading-tight">
                AI Summary & Bullet Point Enhancer
              </h3>

              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
                Turn plain descriptions into quantifiable, high-impact career statements. Generate tailored keywords tailored for your target job title in seconds.
              </p>
            </div>

            {/* Interactive Preview pill */}
            <div className="relative z-10 mt-8 bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle size={14} />
                <span>AI Enhancement Result</span>
              </div>
              <p className="text-xs text-slate-200 italic">
                "Spearheaded cloud architecture refactoring, reducing latency by 42% and driving 99.98% service reliability for 2M+ active users."
              </p>
            </div>
          </div>

          {/* CARD 2: ATS FRIENDLY SCORE */}
          <div className="bento-card bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck size={26} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                100% ATS Compliant
              </h3>

              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Standardized typography, single-column parsing, and clean metadata guaranteed to pass Workday, Taleo, and Greenhouse.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-600">99.2%</span>
              <span className="text-xs text-slate-400 font-medium">Average ATS Score</span>
            </div>
          </div>

          {/* CARD 3: PDF TO RESUME UPLOAD */}
          <div className="bento-card bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-700/10 text-emerald-700 flex items-center justify-center mb-6">
                <Upload size={26} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                PDF Resume Importer
              </h3>

              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Have an old resume? Upload your PDF and our AI will automatically parse sections, experience, and skills into editable templates.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Zap size={13} /> Auto-populate in 3 seconds
              </span>
            </div>
          </div>

          {/* CARD 4: ONE CLICK EXPORT (PDF + DOC) */}
          <div className="bento-card bg-slate-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center mb-6">
                <Download size={26} />
              </div>

              <h3 className="text-xl font-bold text-white">
                Multi-Format Export
              </h3>

              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Download high-resolution vector PDF or clean Word DOC formats anytime with zero watermark.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <span className="px-2.5 py-1 rounded-md bg-white/10">PDF</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10">DOC</span>
            </div>
          </div>

          {/* CARD 5: 6 DESIGNER TEMPLATES & ACCENTS */}
          <div className="bento-card md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Palette size={26} />
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200/80">
                  6 ATS Layouts
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                Custom Color Themes & Pro Templates
              </h3>

              <p className="text-slate-600 text-sm mt-2 leading-relaxed max-w-lg">
                Switch instantly between Classic Corporate, Modern Tech, ATS Pro Minimal, Executive Leadership, Technical, and Compact styles.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["#10B981", "#059669", "#0F766E", "#0284C7", "#1E3A8A", "#7C3AED", "#0F172A"].map((hex) => (
                <span
                  key={hex}
                  className="w-7 h-7 rounded-full shadow-xs hover:scale-125 transition-transform cursor-pointer ring-2 ring-white"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* CARD 6: SHAREABLE PUBLIC LINK */}
          <div className="bento-card bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Globe2 size={26} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Live Public Sharing
              </h3>

              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Toggle public visibility to generate an instant portfolio link to paste on LinkedIn, GitHub, or emails.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <FileCheck2 size={15} /> One-Click Link Copy
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Features;
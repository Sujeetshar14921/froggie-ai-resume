import React, { useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2, Briefcase, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FrogFace, { BrandIcon } from "../FrogLogo";
import { initCtaAnimation } from "../../animations";

const CallToAction = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const cleanup = initCtaAnimation(containerRef.current);
    return cleanup;
  }, []);

  return (
    <section ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">

        <div className="cta-banner relative overflow-hidden rounded-3xl bg-slate-950 p-8 sm:p-12 lg:p-16 text-white shadow-2xl border border-slate-800">

          {/* VIBRANT HALF-CIRCLE AMBIENT GLOWS */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/30 via-teal-400/15 to-transparent rounded-bl-full pointer-events-none blur-xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 via-teal-400/10 to-transparent rounded-tr-full pointer-events-none blur-xl" />

          {/* Background Radiant Glows */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-600/20 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-600/20 blur-[130px] pointer-events-none" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">

              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <FrogFace size={14} />
                Instant Resume Generation &middot; 100% Free
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.14]">
                Your Next Career Move Starts With a{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  Better Resume
                </span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Don't let rigid formatting and missing keywords hold you back. Build, optimize, and verify your resume with Froggie AI in minutes.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate("/app")}
                  className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Build My Resume Free</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  No Credit Card Required
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={15} className="text-emerald-400" />
                  Zero Watermarks
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  PDF & Word Export
                </span>
              </div>

            </div>

            {/* Right Side Mockup */}
            <div className="lg:col-span-5 relative flex justify-center">

              {/* Resume Approved Card */}
              <div className="cta-mockup-card bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-[320px] shadow-2xl text-slate-900 border border-slate-200/90 rotate-[-2deg] transition-all hover:scale-105 hover:rotate-0 cursor-default">
                <div className="flex items-center gap-3">
                  <BrandIcon size="sm" />

                  <div>
                    <h3 className="font-black text-slate-900 text-sm">
                      ATS Verified
                    </h3>
                    <p className="text-xs text-emerald-600 font-bold">
                      Match Score: 98%
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full w-4/5"></div>
                  <div className="h-2 bg-slate-100 rounded-full w-3/5"></div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>ATS Check: Passed</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Ready to Apply</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CallToAction;
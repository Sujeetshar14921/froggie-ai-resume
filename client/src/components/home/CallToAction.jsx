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
    <section ref={containerRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-8xl mx-auto">

        <div className="cta-banner relative overflow-hidden rounded-[36px] bg-slate-950 p-8 sm:p-14 lg:p-20 text-white shadow-2xl border border-slate-800">

          {/* Background Radiant Glows */}
          <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-emerald-600/20 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-teal-600/20 blur-[140px] pointer-events-none" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">

              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <FrogFace size={15} />
                Get 3x More Interviews With froggie
              </span>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Your Next Job Starts With a{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  Smarter Resume
                </span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Join over 50,000+ candidates who transformed their careers. Create ATS-ready resumes and land interview callbacks in record time.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => navigate("/app")}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-base flex items-center gap-3 shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Build My Resume Free</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  Free To Start
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={16} className="text-emerald-400" />
                  No Watermarks
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  PDF & Word Export
                </span>
              </div>

            </div>

            {/* Right Side Mockup */}
            <div className="lg:col-span-5 relative flex justify-center">

              {/* Resume Approved Card */}
              <div className="cta-mockup-card bg-white rounded-3xl p-7 w-full max-w-[340px] shadow-2xl text-slate-900 border border-slate-200 rotate-[-3deg] transition-all hover:scale-105 hover:rotate-0 cursor-default">
                <div className="flex items-center gap-4">
                  <BrandIcon size="lg" />

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      ATS Verified
                    </h3>
                    <p className="text-xs text-emerald-600 font-semibold">
                      Match Score: 99%
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <div className="h-2.5 bg-slate-200 rounded-full w-full"></div>
                  <div className="h-2.5 bg-slate-200 rounded-full w-4/5"></div>
                  <div className="h-2.5 bg-emerald-100 rounded-full w-3/5"></div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Job: Staff Engineer</span>
                  <span className="text-emerald-700 font-bold">Ready to Apply</span>
                </div>
              </div>

              {/* Recruiter Notification Pill */}
              <div className="cta-recruiter-pill absolute -bottom-4 -right-2 sm:-right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold">Recruiter Viewed CV</p>
                  <p className="text-[11px] text-emerald-400">Interview request received</p>
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
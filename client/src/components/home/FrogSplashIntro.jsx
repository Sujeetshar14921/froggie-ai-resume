import React, { useEffect, useRef, useCallback } from "react";
import FrogFace from "../FrogLogo";
import { Sparkles, ArrowRight } from "lucide-react";
import { initSplashAnimation } from "../../animations";

const FrogSplashIntro = ({ onComplete }) => {
  const containerRef = useRef(null);
  const controllerRef = useRef(null);

  const handleExit = useCallback(() => {
    sessionStorage.setItem("froggie_splash_seen", "true");
    if (typeof onComplete === "function") {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const controller = initSplashAnimation(containerRef.current, {
      onComplete: handleExit,
    });
    controllerRef.current = controller;

    return () => {
      if (controller?.kill) controller.kill();
    };
  }, [handleExit]);

  const handleSkip = () => {
    if (controllerRef.current?.exit) {
      controllerRef.current.exit();
    } else {
      handleExit();
    }
  };

  return (
    <div
      ref={containerRef}
      className="splash-overlay fixed inset-0 z-[99999] bg-slate-950 text-white overflow-hidden select-none"
    >
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* GRID TEXTURE */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* FULL-SCREEN FLASH (exit transition) */}
      <div className="splash-flash absolute inset-0 bg-emerald-300 pointer-events-none z-30" />

      {/* SKIP BUTTON */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-40 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 group"
      >
        <span>Skip</span>
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* SHAKE WRAPPER — camera-shake target, fills screen */}
      <div className="splash-shake-wrapper absolute inset-0">

        {/* ===== PHASE 1: FROG PINNED TO ITS OWN ZONE, THEN SLIDES UP ===== */}
        {/* This wrapper is what GSAP moves upward after the frog settles */}
        <div className="splash-mascot-wrapper absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">

          {/* CENTER QUANTUM CORE — ignition spark before logo appears */}
          <div className="splash-center-core absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-36 rounded-full bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-400 blur-xl pointer-events-none z-0" />

          {/* CONCENTRIC SHOCKWAVES — burst 360° from dead center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
            <div className="splash-shockwave-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-56 rounded-full border-2 border-emerald-400/60" />
            <div className="splash-shockwave-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-56 rounded-full border-2 border-teal-300/50" />
            <div className="splash-shockwave-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-56 rounded-full border border-emerald-200/40" />
          </div>

          {/* MASCOT — the frog logo, launches exactly from its zone's center */}
          <div className="splash-mascot relative z-10">
            <div className="relative p-1.5 rounded-[28px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 shadow-2xl shadow-emerald-500/40">
              <div className="size-40 sm:size-56 rounded-[24px] bg-slate-950 flex items-center justify-center overflow-hidden border border-emerald-500/20">
                <FrogFace size={150} className="drop-shadow-[0_10px_20px_rgba(16,185,129,0.35)]" />
              </div>
            </div>

            {/* ORBITING SPARKLES */}
            <div className="splash-sparkle absolute -top-4 -right-4 text-emerald-400">
              <Sparkles size={32} className="animate-pulse" />
            </div>
            <div className="splash-sparkle absolute -bottom-3 -left-4 text-teal-300">
              <Sparkles size={28} className="animate-pulse" />
            </div>
          </div>
        </div>

        {/* ===== PHASE 2: CONTEXT REVEALS IN ITS OWN ZONE, BELOW THE FROG — NO OVERLAP ===== */}
        <div className="splash-slogan-box absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center px-4 max-w-xl space-y-3 z-10">
          {/* BRAND PILL */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase">
            <span>FROGGIE.SITE</span>
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span>#1 AI ATS STUDIO</span>
          </div>

          {/* MAIN SLOGAN */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Leap Ahead In Your Career<span className="text-emerald-400">.</span>
          </h1>

          {/* SECONDARY LINE */}
          <p className="text-sm sm:text-lg font-medium text-slate-300 max-w-md mx-auto leading-relaxed">
            Build <span className="text-emerald-400 font-bold">100% ATS-Compliant</span> Resumes That Win Interviews.
          </p>

          {/* FEATURE CHIPS */}
          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400 font-semibold flex-wrap">
            <span className="splash-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              ⚡ Instant ATS Score
            </span>
            <span className="splash-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              🐸 AI Career Copilot
            </span>
            <span className="splash-chip px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              📄 Free Forever
            </span>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-52 h-1 bg-slate-800 rounded-full mx-auto mt-6 overflow-hidden">
            <div className="splash-progress-fill h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-0" />
          </div>

          {/* LIVE STATUS TEXT + PERCENT */}
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-wider text-slate-500 font-mono pt-1">
            <span className="splash-status-text">INITIALIZING AI ATS ENGINE...</span>
            <span className="splash-status-percent text-emerald-400 font-bold">0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrogSplashIntro;
import React, { useEffect, useRef, useCallback } from "react";
import FrogFace, { BrandIcon } from "../FrogLogo";
import { Sparkles, ArrowRight, Zap, Shield, FileText } from "lucide-react";
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

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (controllerRef.current?.exit) {
          controllerRef.current.exit();
        } else {
          handleExit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
      className="splash-overlay fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none"
    >
      {/* FULL-SCREEN PORTAL FLASH OVERLAY */}
      <div className="splash-flash absolute inset-0 bg-gradient-to-tr from-emerald-400 via-teal-300 to-white pointer-events-none z-50 opacity-0" />

      {/* AMBIENT CINEMATIC LIGHTING & ORBS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* CYBER PERSPECTIVE FLOOR GRID */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px),
                            linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          transform: "perspective(500px) rotateX(45deg) translateY(120px)",
        }}
      />

      {/* SKIP BUTTON */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-40 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-400 hover:text-emerald-400 text-xs font-bold backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 group shadow-xl hover:border-emerald-500/40"
      >
        <span>Skip</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
          ESC
        </span>
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-emerald-400" />
      </button>

      {/* CAMERA SHAKE WRAPPER (KINETIC SHOCKWAVE SYSTEM) */}
      <div className="splash-shake-wrapper relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-4">

        {/* 3D PERSPECTIVE MASCOT CONTAINER */}
        <div
          className="relative flex items-center justify-center"
          style={{ perspective: 1200 }}
        >
          {/* CONCENTRIC IMPACT SHOCKWAVES & CENTER CORE FROM EXACT CENTER */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <div className="splash-center-core size-36 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-200 blur-xl opacity-0 absolute" />
            <div className="splash-shockwave-1 size-72 rounded-full border-2 border-emerald-400/80 shadow-[0_0_50px_rgba(16,185,129,0.7)] opacity-0 absolute" />
            <div className="splash-shockwave-2 size-72 rounded-full border border-teal-300/60 shadow-[0_0_40px_rgba(45,212,191,0.5)] opacity-0 absolute" />
            <div className="splash-shockwave-3 size-72 rounded-full bg-emerald-500/15 blur-2xl opacity-0 absolute" />
          </div>

          {/* THE FROG MASCOT 3D CARD */}
          <div className="splash-mascot relative cursor-pointer will-change-transform">
            {/* AMBIENT GLOW BACKDROP */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-60 blur-lg pointer-events-none" />

            {/* NEON RIM BADGE */}
            <BrandIcon
              size="2xl"
              className="shadow-[0_0_50px_rgba(16,185,129,0.55)] border border-white/20"
              iconClassName="drop-shadow-[0_12px_24px_rgba(16,185,129,0.5)]"
            />

            {/* ORBITING SPARKLES */}
            <div className="splash-sparkle absolute -top-4 -right-4 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] opacity-0 pointer-events-none">
              <Sparkles size={28} className="animate-pulse" />
            </div>
            <div className="splash-sparkle absolute -bottom-3 -left-4 text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)] opacity-0 pointer-events-none">
              <Sparkles size={22} className="animate-pulse" />
            </div>
          </div>
        </div>

        {/* SLOGAN & BRAND TELEMETRY */}
        <div className="splash-slogan-box mt-10 text-center space-y-4 w-full">
          {/* BRAND PILL */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>FROGGIE.SITE</span>
            <span className="text-emerald-600">/</span>
            <span>AI ATS STUDIO 2.0</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Leap Ahead In Your Career
            <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">.</span>
          </h1>

          {/* SECONDARY IMPACT LINE */}
          <p className="text-sm sm:text-lg font-medium text-slate-300 max-w-md mx-auto leading-relaxed">
            Build <span className="text-emerald-400 font-bold">100% ATS-Compliant</span> Resumes That Win Interviews.
          </p>

          {/* FEATURE CHIPS */}
          <div className="flex items-center justify-center gap-2.5 pt-1 text-xs font-semibold flex-wrap">
            <span className="splash-chip px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-1.5 shadow-sm">
              <Zap size={13} className="text-amber-400" />
              <span>Instant ATS Score</span>
            </span>
            <span className="splash-chip px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-1.5 shadow-sm">
              <FrogFace size={13} />
              <span>AI Career Copilot</span>
            </span>
            <span className="splash-chip px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-1.5 shadow-sm">
              <Shield size={13} className="text-emerald-400" />
              <span>100% Free Forever</span>
            </span>
          </div>

          {/* HUD TELEMETRY & PROGRESS BAR */}
          <div className="w-full max-w-xs mx-auto pt-6 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-wider font-bold">
              <span className="splash-status-text text-emerald-400 flex items-center gap-1.5">
                INITIALIZING AI ATS ENGINE...
              </span>
              <span className="splash-status-percent text-slate-400">
                0%
              </span>
            </div>

            {/* FUTURISTIC PROGRESS TRACK */}
            <div className="h-1.5 w-full bg-slate-900/90 rounded-full border border-slate-800 overflow-hidden relative shadow-inner">
              <div className="splash-progress-fill h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] w-0" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FrogSplashIntro;

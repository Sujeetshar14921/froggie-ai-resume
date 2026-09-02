import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FrogFace from "../FrogLogo";
import { Sparkles, ArrowRight } from "lucide-react";

const FrogSplashIntro = ({ onComplete }) => {
  const [stage, setStage] = useState(0); // 0: Jump in progress, 1: Slogan reveal, 2: Exiting
  const [isVisible, setIsVisible] = useState(true);

  const handleExit = React.useCallback(() => {
    setStage(2);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("froggie_splash_seen", "true");
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 600);
  }, [onComplete]);

  useEffect(() => {
    // Stage 0 -> 1: Jump reaches peak and settles at 1.1s, then slogan appears
    const timer1 = setTimeout(() => {
      setStage(1);
    }, 1100);

    // Stage 1 -> 2: Slogan enjoyed, start smooth exit transition at 3.6s
    const timer2 = setTimeout(() => {
      handleExit();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [handleExit]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {stage !== 2 && (
        <motion.div
          key="frog-splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none"
        >
          {/* AMBIENT BACKGROUND GLOWS */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* RIPPLE EFFECT FROM THE JUMP LAUNCH */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.2, 1.8, 3.2],
                opacity: [0.8, 0.3, 0],
              }}
              transition={{
                duration: 1.8,
                ease: "easeOut",
                times: [0, 0.5, 1],
              }}
              className="size-64 rounded-full border-2 border-emerald-400/40"
            />
            <motion.div
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{
                scale: [0.1, 1.4, 2.6],
                opacity: [0.9, 0.4, 0],
              }}
              transition={{
                duration: 1.6,
                delay: 0.25,
                ease: "easeOut",
                times: [0, 0.5, 1],
              }}
              className="size-64 rounded-full border border-teal-300/30 -mt-64"
            />
          </div>

          {/* SKIP BUTTON */}
          <button
            onClick={handleExit}
            className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 group"
          >
            <span>Skip</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* THE BIG FROG JUMP CONTAINER */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            
            {/* FROG MASCOT WITH 3D JUMP MOTION */}
            <motion.div
              initial={{
                scale: 0.1,
                y: 280,
                opacity: 0,
                rotate: -18,
              }}
              animate={{
                // Jump arc: Launch -> Explode right at screen -> Soft landing bounce
                scale: [0.1, 0.6, 2.5, 1.25, 1.05],
                y: [280, -90, -30, 8, 0],
                opacity: [0, 1, 1, 1, 1],
                rotate: [-18, 12, -4, 2, 0],
              }}
              transition={{
                duration: 1.15,
                ease: [0.34, 1.56, 0.64, 1], // Spring overshoot
                times: [0, 0.35, 0.7, 0.9, 1],
              }}
              className="relative"
            >
              {/* SHOCKWAVE BURST WHEN FROG LEAPS CLOSE */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: [0.5, 1.6, 2.2],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.55,
                  ease: "easeOut",
                }}
                className="absolute inset-0 -m-8 rounded-full border-4 border-emerald-400/50 blur-[2px] pointer-events-none"
              />

              {/* FLOATING GLOW BADGE CARD */}
              <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 shadow-2xl shadow-emerald-500/40">
                <div className="size-28 sm:size-36 rounded-[22px] bg-slate-950 flex items-center justify-center overflow-hidden border border-emerald-500/20">
                  <FrogFace size={95} className="drop-shadow-[0_10px_20px_rgba(16,185,129,0.35)]" />
                </div>
              </div>

              {/* FLOATING SPARKLES */}
              {stage >= 1 && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="absolute -top-3 -right-3 text-emerald-400"
                  >
                    <Sparkles size={24} className="animate-pulse" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="absolute -bottom-2 -left-3 text-teal-300"
                  >
                    <Sparkles size={20} className="animate-pulse" />
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* SLOGAN REVEAL (PHASE 2) */}
            <AnimatePresence>
              {stage >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 35, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 text-center px-4 max-w-xl space-y-3"
                >
                  {/* BRAND PILL */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase"
                  >
                    <span>FROGGIE.SITE</span>
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>#1 AI ATS STUDIO</span>
                  </motion.div>

                  {/* MAIN EPIC SLOGAN */}
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    Leap Ahead In Your Career<span className="text-emerald-400">.</span>
                  </h1>

                  {/* SECONDARY IMPACT LINE */}
                  <p className="text-sm sm:text-lg font-medium text-slate-300 max-w-md mx-auto leading-relaxed">
                    Build <span className="text-emerald-400 font-bold">100% ATS-Compliant</span> Resumes That Win Interviews.
                  </p>

                  {/* FEATURE CHIPS */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400 font-semibold flex-wrap"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      ⚡ Instant ATS Score
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      🐸 AI Career Copilot
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      📄 Free Forever
                    </span>
                  </motion.div>

                  {/* TIMED PROGRESS BAR */}
                  <div className="w-44 h-1 bg-slate-800 rounded-full mx-auto mt-6 overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.4, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FrogSplashIntro;

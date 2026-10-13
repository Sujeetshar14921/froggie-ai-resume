import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  UploadCloud,
  ShieldCheck,
  Zap,
  Loader2,
  Search,
  Users,
  Target,
  Star,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../configs/api";
import toast from "react-hot-toast";
import FrogFace, { BrandIcon } from "../FrogLogo";
import { initHeroAnimation } from "../../animations";

const Hero = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [isCreating, setIsCreating] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const cleanup = initHeroAnimation(heroRef.current);
    return cleanup;
  }, []);

  const handleStart = async () => {
    const resumeTitle = user?.name ? `${user.name}'s Resume` : "My Resume";

    if (token) {
      try {
        setIsCreating(true);
        const { data } = await api.post(
          "/api/resumes/create",
          {
            title: resumeTitle,
            template: "classic",
            accent_color: "#10B981",
          },
          { headers: { Authorization: token } }
        );

        toast.success("Opening resume in editor...");
        navigate(`/app/builder/${data.resume._id}`);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to create resume");
      } finally {
        setIsCreating(false);
      }
    } else {
      sessionStorage.setItem(
        "pending_resume_create",
        JSON.stringify({
          template: "classic",
          accent_color: "#10B981",
          title: resumeTitle,
        })
      );
      toast.success("Please sign in or create an account to customize this resume!");
      navigate("/login?state=register&redirect=hero");
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-0 sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-emerald-50/20 dark:from-[#090d16] dark:via-[#0c1222] dark:to-[#090d16] pt-4 sm:pt-10 pb-8 sm:pb-20 select-none"
    >
      {/* AMBIENT BACKGROUND GLOW & TECHNICAL MESH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* VIBRANT HALF-CIRCLE AMBIENT GLOWS */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/20 via-teal-400/10 to-transparent rounded-bl-full blur-2xl animate-pulse" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-500/15 via-indigo-400/10 to-transparent rounded-br-full blur-2xl" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-gradient-to-tl from-amber-500/15 via-orange-400/5 to-transparent rounded-tl-full blur-2xl" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/15 via-pink-400/5 to-transparent rounded-tr-full blur-2xl" />

        <div className="hero-ambient-glow absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[480px] bg-gradient-to-tr from-emerald-200/30 via-teal-100/25 to-transparent rounded-full blur-[140px]" />
        <div className="hero-ambient-glow absolute top-1/2 right-10 w-[420px] h-[420px] bg-emerald-100/20 rounded-full blur-[110px]" />

        {/* Minimal dot matrix blueprint */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#059669 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 w-full text-center">

        {/* TOP STATUS PILL */}
        <div className="hero-status-pill inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 border border-emerald-300/80 dark:border-emerald-500/30 shadow-[0_4px_24px_-4px_rgba(16,185,129,0.18)] text-emerald-800 dark:text-emerald-300 text-[11px] sm:text-sm font-bold mb-3 sm:mb-6 backdrop-blur-xl">
          <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-600" />
          </span>
          <FrogFace size={14} />
          <span className="tracking-tight text-slate-900 dark:text-slate-100 truncate">
            froggie AI 3.0 <span className="text-emerald-600 font-black">&middot;</span> Real-Time ATS Scoring
          </span>
        </div>

        {/* MAIN HEADLINE */}
        <h1 className="hero-headline text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-950 dark:text-slate-50 tracking-tight leading-[1.12] sm:leading-[1.08] max-w-5xl mx-auto">
          The AI Resume Builder Engineered to{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
            Beat the ATS
          </span>{" "}
          & Land Top Interviews
        </h1>

        {/* PERSUASIVE SUBTITLE */}
        <p className="hero-subtitle mt-2.5 sm:mt-6 text-xs sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Craft high-converting, recruiter-ready resumes in minutes. Live ATS scoring, AI bullet refinement, and 7 battle-tested formats—all 100% free.
        </p>

        {/* CTA ACTION BUTTONS */}
        <div className="hero-cta-group mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
          <button
            onClick={handleStart}
            disabled={isCreating}
            className="hero-cta-btn shimmer-button group w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-slate-950 dark:bg-emerald-600 text-white rounded-2xl font-black text-xs sm:text-base flex items-center justify-center gap-2.5 sm:gap-3 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/30"
          >
            {isCreating ? (
              <>
                <Loader2 size={16} className="animate-spin text-emerald-400" />
                <span>Preparing Studio...</span>
              </>
            ) : (
              <>
                <BrandIcon size="xs" />
                <span>Build Your Resume Free</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-emerald-400" />
              </>
            )}
          </button>

          <button
            onClick={() => navigate("/ats-checker")}
            className="hero-cta-btn w-full sm:w-auto px-5 py-3 sm:px-7 sm:py-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-xs sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span>Scan Existing ATS Score</span>
          </button>
        </div>

        {/* TRUST BADGES ROW */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 mt-5 sm:mt-8 text-xs text-slate-500 font-medium">
          <div className="hero-trust-item flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 shadow-2xs backdrop-blur-sm text-[11px] sm:text-xs">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 sm:w-3.5 sm:h-3.5" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Instant Export</span>
          </div>

          <div className="hero-trust-item flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 shadow-2xs backdrop-blur-sm text-[11px] sm:text-xs">
            <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 sm:w-3.5 sm:h-3.5" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">100% ATS Safe</span>
          </div>

          <div className="hero-trust-item hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 shadow-2xs backdrop-blur-sm">
            <Zap size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Zero Watermarks</span>
          </div>

          <div className="hero-trust-item hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 shadow-2xs backdrop-blur-sm">
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">AI Career Copilot Included</span>
          </div>
        </div>

        {/* ELEVATED PROOF TELEMETRY METRICS DOCK (AWWWARDS-LEVEL UI) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 mt-10 sm:mt-12 w-full max-w-6xl mx-auto text-left">
          
          {/* 1. RESUMES CRAFTED */}
          <div className="hero-metric-card relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(16,185,129,0.18)] hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Top Corner Ambient Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            {/* Top Badge & Icon Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="icon-3d-pod icon-3d-pod-emerald p-2 sm:p-2.5 rounded-xl sm:rounded-2xl">
                <Users size={18} className="lucide-3d" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-2xs">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live</span>
              </span>
            </div>

            {/* Metric Value */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-none font-display">
              50,000+
            </div>

            {/* Metric Label */}
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-black uppercase tracking-wider mt-2">
              Resumes Crafted
            </p>

            {/* Context Sublabel */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="text-slate-600 font-bold truncate">Worldwide Users</span>
              <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">
                <TrendingUp size={12} />
                +14% MoM
              </span>
            </div>
          </div>

          {/* 2. ATS PASS RATE */}
          <div className="hero-metric-card relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(16,185,129,0.18)] hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Top Corner Ambient Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/15 via-emerald-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            {/* Top Badge & Icon Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="icon-3d-pod icon-3d-pod-teal p-2 sm:p-2.5 rounded-xl sm:rounded-2xl">
                <Target size={18} className="lucide-3d" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-teal-50 text-teal-800 border border-teal-200/70 shadow-2xs">
                <span>Top 1% Tier</span>
              </span>
            </div>

            {/* Metric Value */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent tracking-tight leading-none font-display">
              96.4%
            </div>

            {/* Metric Label */}
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-black uppercase tracking-wider mt-2">
              ATS Pass Rate
            </p>

            {/* Context Sublabel */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="text-slate-600 font-bold truncate">Parsed & Verified</span>
              <span className="text-teal-700 font-extrabold">Workday & Taleo</span>
            </div>
          </div>

          {/* 3. CANDIDATE RATING */}
          <div className="hero-metric-card hidden sm:block relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-amber-400/50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.18)] hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Top Corner Ambient Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/15 via-orange-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            {/* Top Badge & Icon Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="icon-3d-pod icon-3d-pod-amber p-2 sm:p-2.5 rounded-xl sm:rounded-2xl">
                <Star size={18} className="fill-white text-white lucide-3d" />
              </div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* Metric Value */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-none font-display flex items-baseline gap-1">
              <span>4.9</span>
              <span className="text-base sm:text-lg text-slate-400 font-bold">/ 5.0</span>
            </div>

            {/* Metric Label */}
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-black uppercase tracking-wider mt-2">
              Candidate Rating
            </p>

            {/* Context Sublabel */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="text-slate-600 font-bold truncate">Verified Outcomes</span>
              <span className="text-amber-700 font-extrabold">4,800+ Reviews</span>
            </div>
          </div>

          {/* 4. ZERO PAYWALLS */}
          <div className="hero-metric-card hidden sm:block relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(16,185,129,0.18)] hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Top Corner Ambient Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            {/* Top Badge & Icon Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="icon-3d-pod icon-3d-pod-emerald p-2 sm:p-2.5 rounded-xl sm:rounded-2xl">
                <Zap size={18} className="lucide-3d" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-2xs">
                <span>Free Forever</span>
              </span>
            </div>

            {/* Metric Value */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent tracking-tight leading-none font-display">
              100% Free
            </div>

            {/* Metric Label */}
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-black uppercase tracking-wider mt-2">
              Zero Paywalls
            </p>

            {/* Context Sublabel */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="text-slate-600 font-bold truncate">No Credit Card</span>
              <span className="text-emerald-700 font-extrabold">Unlimited Exports</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;

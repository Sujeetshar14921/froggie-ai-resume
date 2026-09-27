import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  UploadCloud,
  ShieldCheck,
  Zap,
  Check,
  Loader2,
  TrendingUp,
  Cpu,
  BarChart3,
  Search,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../configs/api";
import toast from "react-hot-toast";
import FrogFace, { BrandIcon } from "../FrogLogo";
import { initHeroAnimation } from "../../animations";

const trendingRoles = [
  { id: "swe", title: "Software Engineer", skills: ["React", "TypeScript", "Node.js", "System Design", "AWS", "Docker"], score: 96 },
  { id: "pm", title: "Product Manager", skills: ["Product Strategy", "A/B Testing", "Agile", "User Research", "GTM", "SQL"], score: 94 },
  { id: "ds", title: "Data Scientist", skills: ["Python", "Machine Learning", "PyTorch", "SQL", "Deep Learning", "Pandas"], score: 95 },
  { id: "devops", title: "DevOps Engineer", skills: ["Kubernetes", "Terraform", "CI/CD", "AWS", "Prometheus", "Linux"], score: 93 },
  { id: "ux", title: "Product Designer", skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"], score: 94 },
];

const Hero = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState(trendingRoles[0]);
  const [isCreating, setIsCreating] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const cleanup = initHeroAnimation(heroRef.current);
    return cleanup;
  }, []);

  const handleStart = async (roleObj = selectedRole) => {
    const roleTitle = roleObj.title;
    const resumeTitle = user?.name ? `${user.name} - ${roleTitle}` : `${roleTitle} Resume`;

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

        toast.success(`Opening ${roleTitle} resume in editor...`);
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
          title: `${roleTitle} Resume`,
        })
      );
      toast.success("Please sign in or create an account to customize this resume!");
      navigate("/login?state=register&redirect=hero");
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-emerald-50/20 pt-10 pb-20 select-none"
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">

        {/* TOP STATUS PILL */}
        <div className="hero-status-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-300/70 shadow-xs text-emerald-800 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <FrogFace size={16} />
          <span className="tracking-tight text-slate-800">
            Froggie AI 3.0 Studio <span className="text-emerald-600 font-bold">&middot;</span> Real-Time ATS Scoring & Public Talent Pool
          </span>
        </div>

        {/* MAIN HEADLINE */}
        <h1 className="hero-headline text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.14] max-w-4xl mx-auto">
          The AI Resume Builder Engineered to{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
            Beat the ATS
          </span>{" "}
          & Land Interviews
        </h1>

        {/* PERSUASIVE SUBTITLE */}
        <p className="hero-subtitle mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Build recruiter-ready resumes in minutes. Live ATS scoring, AI STAR-method bullet refinement, and 7 battle-tested formats—all 100% free to export.
        </p>

        {/* ROLE SELECTION CHIPS */}
        <div className="hero-chips-container mt-7 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
            Choose Target Role:
          </span>
          {trendingRoles.map((role) => {
            const isSelected = selectedRole.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`hero-chip px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-950 text-white shadow-sm scale-105 border border-emerald-500/50"
                    : "bg-white/80 hover:bg-white text-slate-600 hover:text-slate-950 border border-slate-200/90 shadow-2xs backdrop-blur-xs"
                }`}
              >
                {isSelected && <Check size={12} className="text-emerald-400" />}
                <span>{role.title}</span>
              </button>
            );
          })}
        </div>

        {/* CTA ACTION BUTTONS */}
        <div className="hero-cta-group mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => handleStart(selectedRole)}
            disabled={isCreating}
            className="hero-cta-btn group px-7 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-slate-950/15 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/30"
          >
            {isCreating ? (
              <>
                <Loader2 size={18} className="animate-spin text-emerald-400" />
                <span>Preparing Editor...</span>
              </>
            ) : (
              <>
                <BrandIcon size="xs" />
                <span>Build {selectedRole.title} Resume Free</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-emerald-400" />
              </>
            )}
          </button>

          <button
            onClick={() => navigate("/ats-checker")}
            className="hero-cta-btn px-6 py-3.5 bg-white/80 hover:bg-white border border-slate-200 text-slate-800 rounded-xl font-bold text-sm sm:text-base hover:border-emerald-300 hover:shadow-xs transition-all flex items-center gap-2 cursor-pointer shadow-2xs backdrop-blur-md"
          >
            <Search size={16} className="text-emerald-600" />
            <span>Check Existing ATS Score</span>
          </button>
        </div>

        {/* TRUST BADGES ROW */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-medium">
          <div className="hero-trust-item flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Instant PDF & Word Export</span>
          </div>

          <div className="hero-trust-item flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span>100% ATS Parser Safe</span>
          </div>

          <div className="hero-trust-item flex items-center gap-1.5">
            <Zap size={15} className="text-emerald-600" />
            <span>Zero Watermarks</span>
          </div>

          <div className="hero-trust-item flex items-center gap-1.5 text-slate-600">
            <Sparkles size={14} className="text-emerald-600" />
            <span>AI Career Copilot Included</span>
          </div>
        </div>

        {/* PREMIUM GLASS PRODUCT PREVIEW DASHBOARD */}
        <div className="hero-showcase-container relative mt-12 max-w-5xl mx-auto text-left">
          
          {/* FLOATING GLASS TELEMETRY BADGE: ATS SCORE (TOP RIGHT) */}
          <div className="hero-showcase-badge hero-badge-float-1 absolute -top-4 -right-2 sm:-right-4 z-20 p-3 sm:p-3.5 rounded-2xl bg-slate-950/95 text-white shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 backdrop-blur-xl">
            <div className="size-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-sm">
              {selectedRole.score}%
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">ATS Score</span>
                <Sparkles size={11} className="text-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-300 font-medium">Workday & Taleo Compliant</p>
            </div>
          </div>

          {/* FLOATING GLASS TELEMETRY BADGE: AI COPILOT SUGGESTION (BOTTOM LEFT) */}
          <div className="hero-showcase-badge hero-badge-float-2 absolute -bottom-4 -left-2 sm:-left-4 z-20 p-3 sm:p-3.5 rounded-2xl bg-white/95 text-slate-900 shadow-xl shadow-slate-900/10 border border-slate-200/90 flex items-center gap-3 backdrop-blur-xl">
            <BrandIcon size="xs" />
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-slate-950 uppercase tracking-wider">STAR Metric Generated</span>
                <CheckCircle2 size={12} className="text-emerald-600" />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Quantified +42% efficiency impact</p>
            </div>
          </div>

          {/* MAIN GLASS DASHBOARD CONTAINER */}
          <div className="rounded-2xl sm:rounded-3xl bg-white/85 border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.12)] overflow-hidden backdrop-blur-xl">
            
            {/* WINDOW TOP HEADER */}
            <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200/70 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-400/80" />
                <span className="size-2.5 rounded-full bg-amber-400/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-[11px] font-mono text-slate-400 font-semibold hidden sm:inline">
                  froggie.site &mdash; {selectedRole.title} Live Preview
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ATS Engine Verified</span>
              </div>
            </div>

            {/* SPLIT DASHBOARD: RESUME CONTENT + ATS TELEMETRY PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/70">
              
              {/* LEFT: RESUME DOCUMENT PREVIEW (8 COLS) */}
              <div className="lg:col-span-8 p-6 sm:p-7 space-y-5 bg-white/60">
                {/* CANDIDATE PROFILE HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Alex Rivera
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">
                      Senior {selectedRole.title}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[10px] font-medium text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100">San Francisco, CA</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">alex.rivera@email.com</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">github.com/alex</span>
                  </div>
                </div>

                {/* WORK EXPERIENCE */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={13} className="text-emerald-600" />
                      Work Experience
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">2022 &ndash; Present</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Lead {selectedRole.title} &middot; Vertex Technologies</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        STAR Compliant
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600 pl-1 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>
                          Architected high-throughput infrastructure reducing API latency by{" "}
                          <strong className="text-emerald-900 font-bold bg-emerald-100/80 px-1 rounded">42%</strong> for 2.5M+ active users.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>
                          Automated deployment workflows cutting release cycles from <strong className="text-emerald-900 font-bold bg-emerald-100/80 px-1 rounded">3 days to 45 minutes</strong>.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* MATCHED SKILLS CLUSTER */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu size={13} className="text-emerald-600" />
                    Target Role Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRole.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200/80"
                      >
                        {skill}
                      </span>
                    ))}
                    <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-[11px]">
                      +8 More Extracted
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: REAL-TIME ATS AUDIT PANEL (4 COLS) */}
              <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50/60 space-y-4 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <BarChart3 size={14} className="text-emerald-600" />
                      ATS Telemetry
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Grade A+
                    </span>
                  </div>

                  {/* MINI METRIC BARS */}
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Keyword Alignment</span>
                        <span className="text-slate-900 font-bold">96%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[96%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Parser Readability</span>
                        <span className="text-slate-900 font-bold">100%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Quantified Metrics</span>
                        <span className="text-slate-900 font-bold">4 of 4</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[100%]" />
                      </div>
                    </div>
                  </div>

                  {/* AUDIT CHECKPOINTS */}
                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-600 shrink-0" />
                      <span>Single-column standard layout</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-600 shrink-0" />
                      <span>Standard web-safe fonts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-600 shrink-0" />
                      <span>Zero tables, graphs, or text boxes</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStart(selectedRole)}
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Customize in Studio</span>
                  <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

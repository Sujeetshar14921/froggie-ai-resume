import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  UploadCloud,
  Star,
  ShieldCheck,
  Zap,
  Check,
  Loader2,
  Award,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../configs/api";
import toast from "react-hot-toast";
import FrogFace, { BrandIcon } from "../FrogLogo";
import { initHeroAnimation } from "../../animations";

const trendingRoles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Marketing Lead",
];

const roleSkillsMap = {
  "Software Engineer": ["React", "TypeScript", "Node.js", "System Design", "AWS", "Docker"],
  "Product Manager": ["Roadmapping", "A/B Testing", "Agile", "User Research", "Metrics", "GTM"],
  "Data Scientist": ["Python", "Machine Learning", "PyTorch", "SQL", "Deep Learning", "Pandas"],
  "DevOps Engineer": ["Kubernetes", "Terraform", "CI/CD", "AWS", "Prometheus", "Linux"],
  "UI/UX Designer": ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"],
  "Marketing Lead": ["SEO / SEM", "Growth Strategy", "Content Marketing", "Analytics", "Funnel"],
};

import HeroCompanyLogos from "./HeroCompanyLogos";

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

  const handleStart = async (role = selectedRole) => {
    const resumeTitle = user?.name ? `${user.name} - ${role}` : `${role} Resume`;

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

        toast.success(`Opening ${role} resume in editor...`);
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
          title: `${role} Resume`,
        })
      );
      toast.success("Please sign in or register to build your resume!");
      navigate("/login?state=register&redirect=hero");
    }
  };

  const activeSkills = roleSkillsMap[selectedRole] || roleSkillsMap["Software Engineer"];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-emerald-50/25 pt-12 pb-20 select-none"
    >
      {/* BACKGROUND AMBIENT AURORA & PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="hero-ambient-glow absolute -top-48 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-tr from-emerald-300/25 via-teal-200/20 to-emerald-100/15 rounded-full blur-[150px]" />
        <div className="hero-ambient-glow absolute bottom-24 right-1/4 w-[500px] h-[500px] bg-teal-100/25 rounded-full blur-[120px]" />

        {/* Minimal dot matrix blueprint */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#059669 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">

        {/* TOP STATUS PILL */}
        <div className="hero-status-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-emerald-300/80 shadow-xs text-emerald-800 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <FrogFace size={16} />
          <span className="tracking-tight">froggie Resume Studio & Optimizer</span>
        </div>

        {/* MAIN HEADLINE */}
        <h1 className="hero-headline text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.12]">
          Create Resumes That Beat the ATS & Get You Hired{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
            3x Faster
          </span>
        </h1>

        {/* PERSUASIVE SUBTITLE */}
        <p className="hero-subtitle mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Build recruiter-tested, ATS-compliant resumes tailored for high-paying roles with froggie AI. Enhance bullet points, pick from 6 designer formats, and download in 1-click.
        </p>

        {/* ROLE SELECTION CHIPS */}
        <div className="hero-chips-container mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 hidden sm:inline">Target Role:</span>
          {trendingRoles.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`hero-chip px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-950 text-white shadow-md scale-105 border border-emerald-500/50"
                    : "bg-white/90 hover:bg-white text-slate-600 hover:text-slate-950 border border-slate-200/90 shadow-2xs"
                }`}
              >
                {isSelected && <Check size={12} className="text-emerald-400" />}
                <span>{role}</span>
              </button>
            );
          })}
        </div>

        {/* CTA ACTION BUTTONS */}
        <div className="hero-cta-group mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleStart(selectedRole)}
            disabled={isCreating}
            className="hero-cta-btn group px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-bold text-base flex items-center gap-2.5 shadow-2xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/40"
          >
            {isCreating ? (
              <>
                <Loader2 size={18} className="animate-spin text-emerald-400" />
                <span>Preparing Resume...</span>
              </>
            ) : (
              <>
                <FrogFace size={20} />
                <span>Create {selectedRole} Resume</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-emerald-400" />
              </>
            )}
          </button>

          <button
            onClick={() => navigate("/app")}
            className="hero-cta-btn px-7 py-4 bg-white/90 hover:bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-base hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <UploadCloud size={18} className="text-emerald-600" />
            <span>Upload Existing PDF</span>
          </button>
        </div>

        {/* TRUST BADGE ROW */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs sm:text-sm text-slate-500 font-medium">
          <div className="hero-trust-item flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>100% Free to Export</span>
          </div>

          <div className="hero-trust-item flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>99.4% ATS Pass Rate</span>
          </div>

          <div className="hero-trust-item flex items-center gap-1.5">
            <Zap size={16} className="text-emerald-600" />
            <span>Takes Under 5 Minutes</span>
          </div>

          <div className="hero-trust-item flex items-center gap-1 text-amber-500 font-semibold">
            <Star size={15} className="fill-amber-400" />
            <span className="text-slate-700">4.9/5 (1,250+ Reviews)</span>
          </div>
        </div>

        {/* INTERACTIVE 3D RESUME SHOWCASE & ATS TELEMETRY CANVAS */}
        <div className="hero-showcase-container relative mt-16 max-w-4xl mx-auto" style={{ perspective: 1200 }}>
          {/* FLOATING BADGE 1: ATS SCORE METER (TOP RIGHT) */}
          <div className="hero-showcase-badge hero-badge-float-1 absolute -top-5 -right-3 sm:-right-6 z-20 p-3 sm:p-3.5 rounded-2xl bg-slate-950 text-white shadow-2xl shadow-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 backdrop-blur-xl">
            <div className="size-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-sm">
              98%
            </div>
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">ATS Score</span>
                <Sparkles size={11} className="text-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-300 font-semibold">Top 1% Candidate Match</p>
            </div>
          </div>

          {/* FLOATING BADGE 2: AI COPILOT STAR METHOD (BOTTOM LEFT) */}
          <div className="hero-showcase-badge hero-badge-float-2 absolute -bottom-5 -left-3 sm:-left-6 z-20 p-3 sm:p-3.5 rounded-2xl bg-white text-slate-900 shadow-2xl shadow-slate-900/15 border border-emerald-200/90 flex items-center gap-3 backdrop-blur-xl">
            <BrandIcon size="sm" />
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-slate-950 uppercase tracking-wider">STAR Method Active</span>
                <CheckCircle2 size={11} className="text-emerald-600" />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">4 Measurable Metrics Added</p>
            </div>
          </div>

          {/* MAIN 3D SHOWCASE MOCKUP CARD */}
          <div className="hero-showcase-card relative rounded-3xl bg-white/95 border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)] overflow-hidden text-left will-change-transform">
            {/* MOCKUP WINDOW HEADER */}
            <div className="px-4 py-3 bg-slate-100/90 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-400" />
                <span className="size-3 rounded-full bg-amber-400" />
                <span className="size-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-[11px] font-mono text-slate-400 font-semibold hidden sm:inline">
                  froggie.site/builder/preview
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live ATS Verification</span>
              </div>
            </div>

            {/* MOCKUP RESUME BODY */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* CANDIDATE HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Sujeet Sharma
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">
                    {selectedRole}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100">San Francisco, CA</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100">alex.rivera@email.com</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100">linkedin.com/in/alex</span>
                </div>
              </div>

              {/* EXPERIENCE PREVIEW */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-emerald-600" />
                    Highlighted Work Experience
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">2022 - Present</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Lead {selectedRole} · Apex Technologies</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black">
                      ATS Verified
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>
                        Architected high-throughput infrastructure reducing API latency by{" "}
                        <strong className="text-emerald-900 font-black bg-emerald-100/70 px-1 rounded">42%</strong> and serving 2.5M daily active users.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>
                        Spearheaded agile migration saving <strong className="text-emerald-900 font-black bg-emerald-100/70 px-1 rounded">$140,000 annually</strong> across multi-cloud environments.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SKILLS TAGS CLUSTER */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={13} className="text-emerald-600" />
                  Matched High-Demand Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-[11px] border border-slate-200/80 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[11px] border border-emerald-300">
                    +12 More Matched
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REPUTABLE HIRING LOGOS & PROVEN TRACK RECORD */}
        <HeroCompanyLogos />

      </div>
    </section>
  );
};

export default Hero;

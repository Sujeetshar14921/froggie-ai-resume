import React, { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import api from "../../configs/api";
import toast from "react-hot-toast";
import FrogFace from "../FrogLogo";

const trendingRoles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Marketing Lead",
];

const companies = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Spotify"];

const Hero = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState(trendingRoles[0]);
  const [isCreating, setIsCreating] = useState(false);

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

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50/60 via-white to-emerald-50/20 pt-12 pb-16">

      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-emerald-200/25 via-teal-200/20 to-emerald-100/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[100px]" />

        {/* Minimal dot matrix */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(#059669 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">

        {/* TOP STATUS PILL */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-emerald-200/80 shadow-xs text-emerald-800 text-xs sm:text-sm font-semibold mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <FrogFace size={16} />
          <span>froggie AI 2.0 ATS Resume Builder & Optimizer</span>
        </motion.div>

        {/* MAIN HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.12]"
        >
          Create Resumes That Beat the ATS & Get You Hired{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
            3x Faster
          </span>
        </motion.h1>

        {/* PERSUASIVE SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Build recruiter-tested, ATS-compliant resumes tailored for high-paying roles with froggie AI. Enhance bullet points, pick from 6 designer formats, and download in 1-click.
        </motion.p>

        {/* ROLE SELECTION CHIPS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs"
        >
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Choose Role:</span>
          {trendingRoles.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-950 text-white shadow-md scale-105"
                    : "bg-white/80 hover:bg-white text-slate-600 hover:text-slate-950 border border-slate-200/80"
                }`}
              >
                {isSelected && <Check size={12} className="text-emerald-400" />}
                <span>{role}</span>
              </button>
            );
          })}
        </motion.div>

        {/* CTA ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => handleStart(selectedRole)}
            disabled={isCreating}
            className="group px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-bold text-base flex items-center gap-2.5 shadow-xl shadow-slate-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/30"
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
            className="px-7 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold text-base hover:border-emerald-300 hover:shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <UploadCloud size={18} className="text-emerald-600" />
            <span>Upload Existing PDF</span>
          </button>
        </motion.div>

        {/* TRUST BADGE ROW */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs sm:text-sm text-slate-500"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>100% Free to Export</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>99.4% ATS Pass Rate</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap size={16} className="text-emerald-600" />
            <span>Takes Under 5 Minutes</span>
          </div>

          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star size={15} className="fill-amber-400" />
            <span className="text-slate-700">4.9/5 (1,250+ Reviews)</span>
          </div>
        </motion.div>

        {/* REPUTABLE HIRING BADGES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-10 border-t border-slate-200/80 max-w-4xl mx-auto"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6">
            Candidates hired at world-class companies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {companies.map((company) => (
              <span
                key={company}
                className="text-base sm:text-lg font-black text-slate-800 tracking-tight"
              >
                {company}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;

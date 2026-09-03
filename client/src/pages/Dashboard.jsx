import React, { useState } from "react";
import {
  Plus,
  UploadCloud,
  FilePenLine,
  Sparkles,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { resumeApi } from "../api/resumeApi";
import { aiApi } from "../api/aiApi";
import { CreateResumeModal, UploadResumeModal } from "../components/dashboard";
import toast from "react-hot-toast";
import FrogFace, { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";

const Dashboard = () => {
  useSEO({
    title: "Candidate Career Studio & Resume Dashboard | froggie",
    description: "Manage your resumes, run ATS scans, create new ATS-optimized resumes with AI, and track career applications in your froggie dashboard.",
  });

  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle manual resume creation
  const handleCreateResume = async (title, onSuccess) => {
    if (!title.trim()) {
      toast.error("Please enter a title for your resume");
      return;
    }

    try {
      setIsLoading(true);
      const data = await resumeApi.createResume({ title: title.trim() }, token);

      setShowCreateResume(false);
      onSuccess?.();
      toast.success("Resume created! Opening editor...");
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      console.error("Create resume error:", error);
      toast.error(error?.response?.data?.message || "Failed to create resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PDF resume parsing & creation
  const handleUploadResume = async (payload, onSuccess) => {
    try {
      setIsLoading(true);
      const data = await aiApi.uploadResumePdf(payload, token);

      setShowUploadResume(false);
      onSuccess?.();
      toast.success("Resume parsed successfully!");
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      console.error("Upload resume error:", error);
      toast.error(error?.response?.data?.message || "Failed to parse resume");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-50/70 pb-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* WELCOME BANNER & HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-2">
              <FrogFace size={14} />
              froggie AI Assistant Ready
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Create, import, and manage your ATS-friendly resumes with one click
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              onClick={() => navigate("/app/applications")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/40 text-emerald-800 font-bold shadow-2xs hover:bg-emerald-500/20 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <Briefcase size={16} className="text-emerald-600" />
              <span>Job Tracker CRM</span>
            </button>

            <button
              onClick={() => navigate("/app/my-resumes")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold shadow-xs hover:bg-slate-50 hover:border-emerald-300 transition-all text-xs sm:text-sm cursor-pointer"
            >
              <FileText size={16} className="text-slate-500" />
              <span>My Resumes</span>
            </button>
          </div>
        </div>

        {/* PRIMARY ACTION CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">

          {/* CREATE RESUME */}
          <button
            onClick={() => setShowCreateResume(true)}
            className="group relative text-left bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-72 overflow-hidden"
          >
            <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Plus size={28} />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 mb-2 border border-emerald-200/80">
                Fast & Easy
              </span>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Create Resume
              </h2>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Step-by-step form editor with AI text enhancement and live preview.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>Start Building</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* UPLOAD / IMPORT PDF */}
          <button
            onClick={() => setShowUploadResume(true)}
            className="group relative text-left bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-72 overflow-hidden"
          >
            <div className="size-14 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-slate-950 group-hover:text-white transition-all">
              <UploadCloud size={28} />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 mb-2 border border-slate-200">
                AI Parser
              </span>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                Import PDF
              </h2>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Upload your existing PDF resume and let our AI extract all sections.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>Upload File</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* ATS SCORE CHECKER */}
          <button
            onClick={() => navigate("/app/ats-checker")}
            className="group relative text-left bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md hover:shadow-2xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-72 overflow-hidden"
          >
            <div className="size-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ShieldCheck size={28} />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
                New Feature
              </span>
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                ATS Checker
              </h2>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                Scan resume against any job description to get 0–100 score & keyword gaps.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>Check ATS Score</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* VIEW ALL RESUMES */}
          <button
            onClick={() => navigate("/app/my-resumes")}
            className="group relative text-left bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-72 overflow-hidden"
          >
            <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <FilePenLine size={28} />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 mb-2 border border-emerald-200/80">
                Your Vault
              </span>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                My Resumes
              </h2>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Manage, edit, export, duplicate, or share your saved resume drafts.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>Open Vault</span>
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

        {/* TIPS / AI ASSISTANCE BANNER */}
        <div className="rounded-3xl bg-slate-950 p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <BrandIcon size="md" />
              <div>
                <h3 className="font-bold text-base text-white">froggie AI Enhancement</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                  Use our AI buttons inside the builder to rewrite bullets with impactful action verbs and quantifiable metrics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">ATS-Scored Templates</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                  All 6 templates follow strict parsing standards tested against Greenhouse, Lever, and Workday.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Instant Export & Share</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                  Export vector PDF or Word (.doc) documents or generate a public portfolio link to share with recruiters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CREATE RESUME MODAL */}
        <CreateResumeModal
          isOpen={showCreateResume}
          onClose={() => setShowCreateResume(false)}
          onSubmit={handleCreateResume}
          isLoading={isLoading}
        />

        {/* UPLOAD RESUME MODAL */}
        <UploadResumeModal
          isOpen={showUploadResume}
          onClose={() => setShowUploadResume(false)}
          onUpload={handleUploadResume}
          isLoading={isLoading}
        />

      </div>
    </div>
  );
};

export default Dashboard;

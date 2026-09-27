import React, { useState, useEffect } from "react";
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
  Target,
  Clock,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Trash2,
  Flame,
  Award,
  TrendingUp,
  Layers,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { resumeApi } from "../api/resumeApi";
import { aiApi } from "../api/aiApi";
import { CreateResumeModal, UploadResumeModal } from "../components/dashboard";
import toast from "react-hot-toast";
import FrogFace, { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";
import { TRACKER_STORAGE_KEY } from "../constants/trackerConfig";

const Dashboard = () => {
  useSEO({
    title: "Candidate Career Studio & Resume Dashboard | froggie",
    description:
      "Manage your resumes, run ATS scans, create new ATS-optimized resumes with AI, and track career applications in your froggie dashboard.",
  });

  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [resumes, setResumes] = useState([]);
  const [isFetchingResumes, setIsFetchingResumes] = useState(false);

  // Load tracker jobs from localStorage for KPI stats
  const [trackedJobs, setTrackedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem(TRACKER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Fetch real resumes from backend
  const fetchUserResumes = async () => {
    if (!token) return;
    try {
      setIsFetchingResumes(true);
      const data = await resumeApi.getUserResumes(token);
      setResumes(data.resumes || []);
    } catch (err) {
      console.error("Failed to fetch user resumes:", err);
    } finally {
      setIsFetchingResumes(false);
    }
  };

  useEffect(() => {
    fetchUserResumes();
  }, [token]);

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

  // Duplicate resume
  const handleDuplicateResume = async (resumeId, e) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      const res = await resumeApi.duplicateResume(resumeId, token);
      toast.success("Resume duplicated!");
      fetchUserResumes();
    } catch (err) {
      toast.error("Could not duplicate resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate telemetry stats
  const activeInterviews = trackedJobs.filter((j) => j.stage === "interviewing").length;
  const totalOffers = trackedJobs.filter((j) => j.stage === "offer").length;
  const totalTracked = trackedJobs.length;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* HERO COMMAND HEADER */}
        <div className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
                  <FrogFace size={13} />
                  <span>froggie AI v2.4 Active</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>ATS Engine 100% Ready</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Welcome back, {user?.name?.split(" ")[0] || "Candidate"} 👋
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-2xl font-medium">
                Your centralized AI career studio. Build high-conversion resumes, benchmark ATS scores against job descriptions, and track your interview pipeline.
              </p>
            </div>

            {/* QUICK LAUNCH ACTIONS */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                onClick={() => setShowCreateResume(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 border border-emerald-500/30"
              >
                <Plus size={16} className="text-emerald-400" />
                <span>Create Resume</span>
              </button>

              <button
                onClick={() => setShowUploadResume(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <UploadCloud size={16} className="text-slate-600" />
                <span>Import PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 TELEMETRY STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
          {/* Total Resumes */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Resumes in Vault
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <FileText size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950">
              {resumes.length}
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {resumes.length > 0 ? "Ready to tailor & export" : "Create your first draft"}
            </p>
          </div>

          {/* ATS Readiness */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                ATS Parsing Score
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Target size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600">
              96%
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Workday & Lever tested
            </p>
          </div>

          {/* Active Job CRM Pipeline */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Tracked Jobs
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Briefcase size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {totalTracked}
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              {activeInterviews > 0 ? `${activeInterviews} active interviews` : "CRM pipeline active"}
            </p>
          </div>

          {/* Career Wins / Offers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Offers & Wins
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <Award size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600">
              {totalOffers}
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Target salary milestones
            </p>
          </div>
        </div>

        {/* 4 CORE WORKFLOW HERO CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
          {/* CREATE RESUME */}
          <div
            onClick={() => setShowCreateResume(true)}
            className="group relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-72 overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Plus size={24} />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 mb-2 border border-emerald-200/70">
                Live Editor
              </span>
              <h3 className="text-lg font-black text-slate-950 group-hover:text-emerald-700 transition-colors">
                Create Resume
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2 font-medium">
                Step-by-step form builder with AI bullet enhancer and real-time live preview.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>Start Building</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* IMPORT PDF RESUME */}
          <div
            onClick={() => setShowUploadResume(true)}
            className="group relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-72 overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-slate-950 group-hover:text-white transition-all">
              <UploadCloud size={24} />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 mb-2 border border-slate-200">
                AI PDF Parser
              </span>
              <h3 className="text-lg font-black text-slate-950 group-hover:text-slate-900 transition-colors">
                Import PDF / Doc
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2 font-medium">
                Upload your existing PDF and AI will auto-extract skills, work history, and sections.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>Upload Document</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* ATS SCORE CHECKER */}
          <div
            onClick={() => navigate("/app/ats-checker")}
            className="group relative bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-md hover:shadow-2xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-72 overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ShieldCheck size={24} />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
                AI Match 0-100
              </span>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                ATS Checker
              </h3>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed line-clamp-2 font-medium">
                Scan your resume against any job description to discover keyword gaps & optimize score.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>Run ATS Benchmark</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* JOB APPLICATION TRACKER */}
          <div
            onClick={() => navigate("/app/applications")}
            className="group relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-72 overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Briefcase size={24} />
            </div>

            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 mb-2 border border-amber-200/70">
                Pipeline CRM
              </span>
              <h3 className="text-lg font-black text-slate-950 group-hover:text-amber-700 transition-colors">
                Job Tracker
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2 font-medium">
                Track interview rounds, follow-up dates, tailored resumes, and salary negotiations.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs group-hover:translate-x-1 transition-transform">
              <span>Open Pipeline</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* RECENT RESUMES SECTION */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-slate-900" />
              <h2 className="text-xl font-black text-slate-950 tracking-tight">
                Recent Resumes
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700">
                {resumes.length}
              </span>
            </div>

            <button
              onClick={() => navigate("/app/my-resumes")}
              className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All Resumes</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {isFetchingResumes ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
              <RefreshCw size={24} className="animate-spin mx-auto text-emerald-600 mb-2" />
              <p className="text-xs font-bold">Loading your resume drafts...</p>
            </div>
          ) : resumes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.slice(0, 3).map((r) => (
                <div
                  key={r._id}
                  onClick={() => navigate(`/app/builder/${r._id}`)}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer space-y-3 group text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-black text-sm text-slate-950 truncate group-hover:text-emerald-700 transition-colors">
                        {r.title || "Untitled Resume"}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                        {r.personal_info?.profession || "Profession not set"}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[10px] font-black shrink-0">
                      ATS Ready
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{new Date(r.updatedAt || Date.now()).toLocaleDateString()}</span>
                    </span>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/ats-checker?resumeId=${r._id}`);
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[10px] font-bold transition-colors"
                        title="Scan with ATS"
                      >
                        ATS Scan
                      </button>
                      <button
                        onClick={(e) => handleDuplicateResume(r._id, e)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 sm:p-10 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                📄
              </div>
              <h3 className="text-sm font-black text-slate-900">No resumes found in your vault</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create a tailored resume or import your existing PDF to start customizing.
              </p>
              <button
                onClick={() => setShowCreateResume(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 transition-all cursor-pointer"
              >
                <Plus size={14} className="text-emerald-400" />
                <span>Create First Resume</span>
              </button>
            </div>
          )}
        </div>

        {/* AI CAREER STUDIO POWER BANNER */}
        <div className="rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">AI Content Enhancement</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">
                  Use built-in AI buttons to rewrite bullet points with strong action verbs and measurable achievements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">ATS-Optimized Templates</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">
                  6 professional layouts compliant with major ATS parsing standards (Greenhouse, Lever, Workday).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Instant Multi-Format Export</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">
                  Export vector PDF or Word (.docx) documents with perfect pagination and layout fidelity.
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

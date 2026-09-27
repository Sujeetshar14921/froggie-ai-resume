import React, { useState, useMemo } from "react";
import {
  FilePenLineIcon,
  Plus,
  Search,
  Sparkles,
  ArrowLeft,
  UploadCloud,
  Filter,
  ArrowUpDown,
  X,
  FileText,
  Globe,
  Lock,
  Layers,
  ShieldCheck,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useResumeList } from "../hooks/useResumeList";
import { ResumeCard, TrashModal } from "../components/resumes";
import { CreateResumeModal, UploadResumeModal } from "../components/dashboard";
import { resumeApi } from "../api/resumeApi";
import { aiApi } from "../api/aiApi";
import FrogFace, { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";
import toast from "react-hot-toast";

const MyResumes = () => {
  useSEO({
    title: "My Saved Resumes & CVs | froggie",
    description:
      "Access, edit, duplicate, and download all your ATS-optimized resumes and templates created with froggie AI.",
  });

  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const {
    resumes,
    isLoading,
    searchQuery,
    setSearchQuery,
    deletingId,
    deleteResume,
    toggleVisibility,
    refreshResumes,
  } = useResumeList();

  const [filterVisibility, setFilterVisibility] = useState("all"); // 'all' | 'public' | 'private'
  const [sortBy, setSortBy] = useState("date"); // 'date' | 'title' | 'template'

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [isModalActionLoading, setIsModalActionLoading] = useState(false);

  // Handle manual resume creation
  const handleCreateResume = async (title, onSuccess) => {
    if (!title.trim()) {
      toast.error("Please enter a title for your resume");
      return;
    }

    try {
      setIsModalActionLoading(true);
      const data = await resumeApi.createResume({ title: title.trim() }, token);

      setShowCreateModal(false);
      onSuccess?.();
      toast.success("Resume created! Opening editor...");
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      console.error("Create resume error:", error);
      toast.error(error?.response?.data?.message || "Failed to create resume");
    } finally {
      setIsModalActionLoading(false);
    }
  };

  // Handle PDF resume parsing & creation
  const handleUploadResume = async (payload, onSuccess) => {
    try {
      setIsModalActionLoading(true);
      const data = await aiApi.uploadResumePdf(payload, token);

      setShowUploadModal(false);
      onSuccess?.();
      toast.success("Resume parsed successfully!");
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      console.error("Upload resume error:", error);
      toast.error(error?.response?.data?.message || "Failed to parse resume");
    } finally {
      setIsModalActionLoading(false);
    }
  };

  // Handle resume duplication
  const handleDuplicate = async (resumeId) => {
    try {
      toast.loading("Duplicating resume...", { id: "dup-toast" });
      await resumeApi.duplicateResume(resumeId, token);
      toast.success("Resume duplicated successfully! 📋", { id: "dup-toast" });
      refreshResumes();
    } catch (error) {
      toast.error("Could not duplicate resume", { id: "dup-toast" });
    }
  };

  // Filtered & Sorted resumes
  const displayResumes = useMemo(() => {
    let result = (resumes || []).filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (r.title || "Untitled Resume").toLowerCase().includes(q) ||
        (r.personal_info?.profession || "").toLowerCase().includes(q) ||
        (r.personal_info?.full_name || "").toLowerCase().includes(q);

      const matchesVisibility =
        filterVisibility === "all" ||
        (filterVisibility === "public" && r.public) ||
        (filterVisibility === "private" && !r.public);

      return matchesSearch && matchesVisibility;
    });

    if (sortBy === "title") {
      result = [...result].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    } else if (sortBy === "template") {
      result = [...result].sort((a, b) =>
        (a.template || "Classic").localeCompare(b.template || "Classic")
      );
    } else {
      // Latest updated first
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }

    return result;
  }, [resumes, searchQuery, filterVisibility, sortBy]);

  const publicCount = (resumes || []).filter((r) => r.public).length;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 text-left">
        {/* TOP COMMAND HEADER */}
        <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs group">
          {/* Half-circle colorful environment auras */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-blue-500/10 via-indigo-400/5 to-transparent rounded-tr-full pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <button
              onClick={() => navigate("/app")}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-emerald-700 transition-colors group/btn cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                My Resumes Vault
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"}
              </span>
              {publicCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/70">
                  {publicCount} Public Portfolio
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-medium">
              Manage, customize, duplicate, and export your tailored resumes with live ATS compatibility scores.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="relative z-10 flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setShowTrashModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-rose-50/50 text-slate-700 hover:text-rose-600 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs hover:border-rose-200 transition-all cursor-pointer"
              title="View Trash & Recycle Bin"
            >
              <Trash2 size={15} className="text-rose-500" />
              <span>Trash</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer hover:scale-102"
            >
              <UploadCloud size={16} className="text-slate-600" />
              <span>Import PDF</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 border border-emerald-500/30"
            >
              <Plus size={16} className="text-emerald-400" />
              <span>Create New Resume</span>
            </button>
          </div>
        </div>

        {/* 4 MINI STAT CARDS WITH COLORFUL HALF CIRCLES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Created */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/15 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Total Resumes
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <FileText size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-950">
                {resumes.length}
              </span>
              <span className="text-[10px] font-bold text-slate-400">versions</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ready to edit & export
            </p>
          </div>

          {/* Card 2: Public Portfolios */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/15 via-blue-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Public Live
              </span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Globe size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-blue-600">
                {publicCount}
              </span>
              <span className="text-[10px] font-bold text-blue-400">sharable</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Live portfolio links
            </p>
          </div>

          {/* Card 3: ATS Ready Standard */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/15 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                ATS Format
              </span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <ShieldCheck size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-purple-600">
                100%
              </span>
              <span className="text-[10px] font-bold text-purple-400">pass rate</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Parser compliant
            </p>
          </div>

          {/* Card 4: AI Optimization */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/15 via-amber-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                AI Powered
              </span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Sparkles size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-600">
                Active
              </span>
              <span className="text-[10px] font-bold text-amber-400">enhancer</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Smart suggestions on
            </p>
          </div>
        </div>

        {/* SEARCH, FILTER & SORT TOOLBAR */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resumes by title, profession, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Visibility Filter Tabs & Sort Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => setFilterVisibility("all")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterVisibility === "all"
                    ? "bg-white text-slate-950 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All ({resumes.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterVisibility("public")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterVisibility === "public"
                    ? "bg-white text-slate-950 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Public ({publicCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterVisibility("private")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterVisibility === "private"
                    ? "bg-white text-slate-950 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Private ({resumes.length - publicCount})
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={13} className="text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl outline-none cursor-pointer"
              >
                <option value="date">Sort: Last Modified</option>
                <option value="title">Sort: Title (A-Z)</option>
                <option value="template">Sort: Template Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 animate-pulse space-y-4 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100" />
                  <div className="h-5 bg-slate-100 rounded-full w-20" />
                </div>
                <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                <div className="h-10 bg-slate-100 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : displayResumes.length === 0 ? (
          /* EMPTY STATE */
          <div className="relative overflow-hidden text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200/90 shadow-2xs flex flex-col items-center max-w-2xl mx-auto space-y-4 group">
            {/* Half circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 via-purple-400/5 to-transparent rounded-tr-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-4">
              <BrandIcon size="lg" className="shadow-lg shadow-emerald-500/20" />
              <h3 className="text-lg font-black text-slate-900">
                {searchQuery ? "No matching resumes found" : "No resumes in your vault yet"}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto font-medium">
                {searchQuery
                  ? `No resume matches "${searchQuery}". Try searching with a different role title or name.`
                  : "Create your first ATS-compliant resume or import your existing PDF to unlock AI enhancements."}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Clear Search Filter
                </button>
              ) : (
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs shadow-md hover:scale-105 transition-all cursor-pointer border border-emerald-500/40"
                  >
                    <Plus size={15} className="text-emerald-400" />
                    <span>Create Resume</span>
                  </button>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <UploadCloud size={15} />
                    <span>Import PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 3-COLUMN RESUME GRID (PERFECT WIDTH) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayResumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                isDeleting={deletingId === resume._id}
                onEdit={() => navigate(`/app/builder/${resume._id}`)}
                onViewPublic={() => window.open(`/view/${resume._id}`, "_blank")}
                onDelete={() => deleteResume(resume._id)}
                onDuplicate={handleDuplicate}
                onToggleVisibility={toggleVisibility}
              />
            ))}
          </div>
        )}
      </div>

      {/* CREATE RESUME MODAL */}
      <CreateResumeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateResume}
        isLoading={isModalActionLoading}
      />

      {/* UPLOAD RESUME MODAL */}
      <UploadResumeModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadResume}
        isLoading={isModalActionLoading}
      />

      {/* TRASH / RECYCLE BIN MODAL */}
      <TrashModal
        isOpen={showTrashModal}
        onClose={() => setShowTrashModal(false)}
        token={token}
        onRestoreSuccess={refreshResumes}
      />
    </div>
  );
};

export default MyResumes;

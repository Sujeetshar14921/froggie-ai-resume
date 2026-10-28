import React, { useState, useMemo } from "react";
import {
  FileText,
  Globe,
  ShieldCheck,
  Sparkles,
  Plus,
  UploadCloud,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useResumeList } from "../hooks/useResumeList";
import {
  ResumeCard,
  TrashModal,
  MyResumesHeader,
  MyResumesToolbar,
} from "../components/resumes";
import { CreateResumeModal, UploadResumeModal } from "../components/dashboard";
import TelemetryCard from "../components/common/TelemetryCard";
import { resumeApi } from "../api/resumeApi";
import { aiApi } from "../api/aiApi";
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

  // Duplicate resume handler
  const handleDuplicate = async (resumeId) => {
    try {
      await resumeApi.duplicateResume(resumeId, token);
      toast.success("Resume duplicated!");
      refreshResumes();
    } catch {
      toast.error("Could not duplicate resume");
    }
  };

  // Compute public & private counts
  const publicCount = useMemo(
    () => resumes.filter((r) => r.isPublic).length,
    [resumes]
  );
  const privateCount = resumes.length - publicCount;

  // Filter & Sort Pipeline
  const displayResumes = useMemo(() => {
    let result = [...resumes];

    // Filter by visibility
    if (filterVisibility === "public") {
      result = result.filter((r) => r.isPublic);
    } else if (filterVisibility === "private") {
      result = result.filter((r) => !r.isPublic);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.personal_info?.profession?.toLowerCase().includes(q) ||
          r.personal_info?.full_name?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "template") {
        return (a.template || "").localeCompare(b.template || "");
      }
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

    return result;
  }, [resumes, filterVisibility, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-8 space-y-6">
        {/* HEADER */}
        <MyResumesHeader
          onOpenTrash={() => setShowTrashModal(true)}
          onOpenUpload={() => setShowUploadModal(true)}
          onOpenCreate={() => setShowCreateModal(true)}
        />

        {/* 4 MINI STAT CARDS WITH REUSABLE TELEMETRY COMPONENT */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-left">
          <TelemetryCard
            label="Total Resumes"
            value={resumes.length}
            badge="versions"
            icon={FileText}
            color="emerald"
            subtext="Ready to edit & export"
          />

          <TelemetryCard
            label="Public Live"
            value={publicCount}
            badge="sharable"
            icon={Globe}
            color="blue"
            subtext="Live portfolio links"
          />

          <TelemetryCard
            label="ATS Format"
            value="100%"
            badge="pass rate"
            icon={ShieldCheck}
            color="purple"
            subtext="Parser compliant"
          />

          <TelemetryCard
            label="AI Powered"
            value="Active"
            badge="enhancer"
            icon={Sparkles}
            color="amber"
            subtext="Smart suggestions on"
            pulseDot={true}
          />
        </div>

        {/* SEARCH, FILTER & SORT TOOLBAR */}
        <MyResumesToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterVisibility={filterVisibility}
          setFilterVisibility={setFilterVisibility}
          sortBy={sortBy}
          setSortBy={setSortBy}
          publicCount={publicCount}
          privateCount={privateCount}
        />

        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 animate-pulse space-y-4 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                  <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-20" />
                </div>
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/2" />
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : displayResumes.length === 0 ? (
          /* EMPTY STATE */
          <div className="relative overflow-hidden text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col items-center max-w-2xl mx-auto space-y-4 group">
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="size-16 sm:size-20 p-2.5 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 shadow-lg shadow-emerald-500/10 flex items-center justify-center">
                <img
                  src="/froggie_logo.png"
                  alt="froggie logo"
                  className="size-full object-contain select-none hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
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
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <UploadCloud size={15} />
                    <span>Import PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 3-COLUMN RESUME GRID */
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

import React from "react";
import {
  FilePenLineIcon,
  Plus,
  Search,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResumeList } from "../hooks/useResumeList";
import { ResumeCard } from "../components/resumes";
import FrogFace, { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";

const MyResumes = () => {
  useSEO({
    title: "My Saved Resumes & CVs | froggie",
    description: "Access, edit, duplicate, and download all your ATS-optimized resumes and templates created with froggie AI.",
  });

  const navigate = useNavigate();

  const {
    filteredResumes,
    isLoading,
    searchQuery,
    setSearchQuery,
    deletingId,
    deleteResume,
  } = useResumeList();

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* HEADER & NAV */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/app")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 mb-3 transition-colors group cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Resumes
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage, edit, export, and share your froggie AI-optimized resumes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/app")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer border border-emerald-500/30"
            >
              <Plus size={16} className="text-emerald-400" />
              Create New Resume
            </button>
          </div>
        </div>

        {/* SEARCH BAR & METRICS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resumes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              Total: {filteredResumes.length} {filteredResumes.length === 1 ? "Resume" : "Resumes"}
            </span>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                <div className="h-5 bg-slate-100 rounded-lg w-2/3" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                <div className="h-10 bg-slate-100 rounded-xl mt-6" />
              </div>
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-xs flex flex-col items-center">
            <BrandIcon size="xl" className="mb-5 shadow-lg shadow-emerald-500/25" />
            <h3 className="text-xl font-bold text-slate-900">
              {searchQuery ? "No matching resumes found" : "No resumes created yet"}
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 mb-6">
              {searchQuery
                ? `No resumes match "${searchQuery}". Try a different keyword.`
                : "Create your first professional ATS-friendly resume with our froggie AI builder in minutes."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-all cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => navigate("/app")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-xl text-sm shadow-lg hover:scale-105 transition-all cursor-pointer border border-emerald-500/40"
              >
                <FrogFace size={16} />
                Create Resume
              </button>
            )}
          </div>
        ) : (
          /* RESUME GRID */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                isDeleting={deletingId === resume._id}
                onEdit={() => navigate(`/app/builder/${resume._id}`)}
                onViewPublic={() => window.open(`/view/${resume._id}`, "_blank")}
                onDelete={() => deleteResume(resume._id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyResumes;

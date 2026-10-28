import React from "react";
import { Plus, UploadCloud, ShieldCheck } from "lucide-react";

const DashboardHeader = ({ user, onCreateResume, onUploadResume }) => {
  return (
    <div className="relative overflow-hidden glass-card-elevated p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm text-left">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/15 via-teal-500/5 to-transparent rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-black shadow-2xs">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>ATS Engine Ready</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Candidate"} 👋
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl font-medium">
            Your centralized AI career studio. Build high-conversion resumes, benchmark ATS scores against job descriptions, and track your interview pipeline.
          </p>
        </div>

        {/* QUICK LAUNCH ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
          <button
            onClick={onCreateResume}
            className="shimmer-button flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer border border-emerald-500/40"
          >
            <Plus size={15} className="text-emerald-400" />
            <span>Create Resume</span>
          </button>

          <button
            onClick={onUploadResume}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-950 font-bold text-xs sm:text-sm transition-all border border-slate-300/80 shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <UploadCloud size={15} className="text-slate-600" />
            <span>Import PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

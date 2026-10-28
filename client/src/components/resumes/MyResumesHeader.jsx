import React from "react";
import { Plus, UploadCloud, Trash2 } from "lucide-react";

const MyResumesHeader = ({
  onOpenTrash,
  onOpenUpload,
  onOpenCreate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
          <span>My Saved Resumes</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your ATS-ready resumes, switch templates, share public links & export in vector PDF or Word.
        </p>
      </div>

      {/* ACTION LAUNCH BUTTONS */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onOpenTrash}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          title="View Trash & Recycle Bin"
        >
          <Trash2 size={14} className="lucide-3d" />
          <span>Trash</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer hover:scale-102"
        >
          <UploadCloud size={15} className="text-slate-600 dark:text-slate-300" />
          <span>Import PDF</span>
        </button>

        <button
          onClick={onOpenCreate}
          className="shimmer-button inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 border border-emerald-500/40"
        >
          <Plus size={15} className="text-emerald-400" />
          <span>New Resume</span>
        </button>
      </div>
    </div>
  );
};

export default MyResumesHeader;

import React from "react";
import { ArrowLeft, Sparkles, UploadCloud } from "lucide-react";

const StudioHeader = ({ user, navigate, file, onUploadClick }) => {
  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c1424] shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-2 sm:py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => navigate(user ? "/app" : "/")}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
            title={user ? "Back to Dashboard" : "Back to Home"}
          >
            <ArrowLeft size={14} />
          </button>
          <div className="flex items-center gap-2 truncate">
            <div className="size-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles size={13} />
            </div>
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
              Smart File & Media Studio
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
              Free Public Tool
            </span>
          </div>
        </div>

        {file && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onUploadClick}
              className="px-3 py-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UploadCloud size={13} className="text-emerald-500" />
              <span className="hidden sm:inline">Upload New File</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioHeader;

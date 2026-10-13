import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2,
  Save,
  Share2Icon,
  ShieldCheck,
  History,
} from "lucide-react";

const BuilderHeader = ({
  title,
  resumeId,
  isPublic,
  isLoading,
  isSaving,
  isExporting,
  onSave,
  onToggleVisibility,
  onShare,
  onDownload,
  onOpenHistory,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  return (
    <header className="shrink-0 h-14 sm:h-16 bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center z-30 shadow-2xs">
      <div className="w-full flex items-center justify-between">
        {/* LEFT: BACK & TITLE */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all shrink-0"
          >
            <ArrowLeftIcon className="size-3.5" /> Back
          </Link>
          {title && (
            <div className="flex items-center gap-2 truncate">
              <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600">/</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{title}</p>
            </div>
          )}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* VERSION HISTORY ROLLBACK BUTTON */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="View revision snapshots and rollback changes"
          >
            <History className="size-3.5 text-slate-600 dark:text-slate-300" />
            <span className="hidden sm:inline">History</span>
          </button>

          {isPublic && (
            <button
              onClick={onShare}
              className="flex items-center px-3 py-1.5 gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800/60 transition-colors cursor-pointer"
            >
              <Share2Icon className="size-3.5" /> <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* PUBLIC / PRIVATE TOGGLE */}
          <button
            onClick={onToggleVisibility}
            className={`flex items-center px-3 py-1.5 gap-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isPublic
                ? "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            {isPublic ? <EyeIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <EyeOffIcon className="size-3.5" />}
            <span>{isPublic ? "Public" : "Private"}</span>
          </button>

          {/* EXPORT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              className="shimmer-button flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all disabled:opacity-60 shadow-xs cursor-pointer hover:scale-102 active:scale-98"
              disabled={isExporting}
            >
              <DownloadIcon className="size-3.5" />
              <span>{isExporting ? "Exporting..." : "Download"}</span>
            </button>

            {isExportMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsExportMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onDownload("pdf");
                    }}
                    className="dropdown-item-3d flex items-center justify-between w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <span>Download PDF</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      PDF
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onDownload("docx");
                    }}
                    className="dropdown-item-3d flex items-center justify-between w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                  >
                    <span>Download Word (.docx)</span>
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                      DOCX
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onDownload("doc");
                    }}
                    className="dropdown-item-3d flex items-center justify-between w-full px-4 py-2 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                  >
                    <span>Legacy Word (.doc)</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      DOC
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={onSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-3.5 py-1.5 text-xs rounded-lg transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default BuilderHeader;

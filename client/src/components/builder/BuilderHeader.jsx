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
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  return (
    <header className="shrink-0 h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center z-30 shadow-2xs">
      <div className="max-w-8xl mx-auto w-full flex items-center justify-between">
        {/* LEFT: BACK & TITLE */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-all shrink-0"
          >
            <ArrowLeftIcon className="size-3.5" /> Back
          </Link>
          {title && (
            <div className="flex items-center gap-2 truncate">
              <span className="hidden sm:inline-block text-slate-300">/</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{title}</p>
            </div>
          )}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-2.5">

          {isPublic && (
            <button
              onClick={onShare}
              className="flex items-center px-3 py-1.5 gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors cursor-pointer"
            >
              <Share2Icon className="size-3.5" /> <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* ATS CHECKER BUTTON */}
          <Link
            to={resumeId ? `/app/ats-checker?resumeId=${resumeId}` : "/app/ats-checker"}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 hover:text-emerald-900 rounded-lg border border-emerald-400/50 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="Scan and benchmark this resume in the ATS Checker"
          >
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span className="hidden sm:inline">ATS Checker</span>
            <span className="sm:hidden">ATS</span>
          </Link>

          {/* PUBLIC / PRIVATE TOGGLE */}
          <button
            onClick={onToggleVisibility}
            className={`flex items-center px-3 py-1.5 gap-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isPublic
                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
            }`}
          >
            {isPublic ? <EyeIcon className="size-3.5 text-emerald-600" /> : <EyeOffIcon className="size-3.5" />}
            <span>{isPublic ? "Public" : "Private"}</span>
          </button>

          {/* EXPORT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors disabled:opacity-60 shadow-xs cursor-pointer"
              disabled={isExporting}
            >
              <DownloadIcon className="size-3.5" />
              <span>{isExporting ? "Exporting..." : "Download"}</span>
            </button>

            {isExportMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsExportMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onDownload("pdf");
                    }}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>Download PDF</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                      PDF
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onDownload("doc");
                    }}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-t border-slate-100 cursor-pointer"
                  >
                    <span>Download Word</span>
                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
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

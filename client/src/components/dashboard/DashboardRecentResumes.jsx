import React from "react";
import { FileText, ChevronRight, RefreshCw, Clock, Copy, Plus } from "lucide-react";

const DashboardRecentResumes = ({
  resumes = [],
  isFetching,
  onNavigate,
  onDuplicate,
  onCreateResume,
}) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-slate-900 dark:text-white" />
          <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
            Recent Resumes
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-700">
            {resumes.length}
          </span>
        </div>

        <button
          onClick={() => onNavigate("/app/my-resumes")}
          className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>View All Resumes</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {isFetching ? (
        <div className="p-12 text-center bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
          <RefreshCw size={24} className="animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-xs font-bold">Loading your resume drafts...</p>
        </div>
      ) : resumes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.slice(0, 3).map((r) => (
            <div
              key={r._id}
              onClick={() => onNavigate(`/app/builder/${r._id}`)}
              className="bg-white dark:bg-[#0c1424] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all cursor-pointer space-y-3 group text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-black text-sm text-slate-950 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {r.title || "Untitled Resume"}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate mt-0.5">
                    {r.personal_info?.profession || "Profession not set"}
                  </p>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black shrink-0">
                  ATS Ready
                </span>
              </div>

              <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  <span>{new Date(r.updatedAt || Date.now()).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`/app/ats-checker?resumeId=${r._id}`);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-colors border border-transparent dark:border-slate-700"
                    title="Scan with ATS"
                  >
                    ATS Scan
                  </button>
                  <button
                    onClick={(e) => onDuplicate(r._id, e)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
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
        <div className="p-8 sm:p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
            📄
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">No resumes found in your vault</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create a tailored resume or import your existing PDF to start customizing.
          </p>
          <button
            onClick={onCreateResume}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 transition-all cursor-pointer"
          >
            <Plus size={14} className="text-emerald-400" />
            <span>Create First Resume</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardRecentResumes;

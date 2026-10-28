import React from "react";
import { Plus, UploadCloud, ShieldCheck, Briefcase, Sparkles, ArrowRight } from "lucide-react";

const DashboardWorkflowCards = ({ onCreateResume, onUploadResume, onNavigate }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 text-left">
      {/* CREATE RESUME */}
      <div
        onClick={onCreateResume}
        className="group relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:h-72 overflow-hidden"
      >
        <div className="icon-3d-pod icon-3d-pod-emerald w-12 h-12 rounded-2xl flex items-center justify-center">
          <Plus size={24} className="lucide-3d" />
        </div>

        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 mb-2 border border-emerald-200/70">
            Live Editor
          </span>
          <h3 className="text-lg font-black text-slate-950 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            Create Resume
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2 font-medium">
            Step-by-step form builder with AI bullet enhancer and real-time live preview.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
          <span>Start Building</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {/* IMPORT PDF RESUME */}
      <div
        onClick={onUploadResume}
        className="group relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:h-72 overflow-hidden"
      >
        <div className="icon-3d-pod icon-3d-pod-dark w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-400">
          <UploadCloud size={20} className="lucide-3d sm:w-6 sm:h-6" />
        </div>

        <div>
          <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 mb-1.5 sm:mb-2 border border-slate-200 dark:border-slate-700">
            AI PDF Parser
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            Import PDF / Doc
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2 font-medium hidden sm:block">
            Upload your existing PDF and AI will auto-extract skills, work history, and sections.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200 font-bold text-xs group-hover:translate-x-1 transition-transform">
          <span>Upload Document</span>
          <ArrowRight size={13} />
        </div>
      </div>

      {/* ATS SCORE CHECKER */}
      <div
        onClick={() => onNavigate("/app/ats-checker")}
        className="group relative bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-800 hover:border-emerald-500/60 transition-colors duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:h-72 overflow-hidden"
      >
        <div className="icon-3d-pod icon-3d-pod-emerald w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <ShieldCheck size={20} className="lucide-3d text-white sm:w-6 sm:h-6" />
        </div>

        <div>
          <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-1.5 sm:mb-2">
            AI Match 0-100
          </span>
          <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
            ATS Checker
          </h3>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed line-clamp-2 font-medium hidden sm:block">
            Scan your resume against any job description to discover keyword gaps & optimize score.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs group-hover:translate-x-1 transition-transform">
          <span>Run ATS Benchmark</span>
          <ArrowRight size={13} />
        </div>
      </div>

      {/* JOB APPLICATION TRACKER */}
      <div
        onClick={() => onNavigate("/app/applications")}
        className="group relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-colors duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:h-72 overflow-hidden"
      >
        <div className="icon-3d-pod icon-3d-pod-amber w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <Briefcase size={20} className="lucide-3d text-white sm:w-6 sm:h-6" />
        </div>

        <div>
          <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 mb-1.5 sm:mb-2 border border-amber-200/70 dark:border-amber-800/60">
            Pipeline CRM
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
            Job Tracker
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2 font-medium hidden sm:block">
            Track interview rounds, follow-up dates, tailored resumes, and salary negotiations.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
          <span>Open Pipeline</span>
          <ArrowRight size={13} />
        </div>
      </div>

      {/* SMART FILE & MEDIA STUDIO */}
      <div
        onClick={() => onNavigate("/file-studio")}
        className="group relative bg-white dark:bg-[#0c1424] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] sm:h-72 overflow-hidden col-span-2 sm:col-span-1"
      >
        <div className="icon-3d-pod icon-3d-pod-purple w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-400">
          <Sparkles size={20} className="lucide-3d sm:w-6 sm:h-6" />
        </div>

        <div>
          <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 mb-1.5 sm:mb-2 border border-indigo-200/70 dark:border-indigo-800/60">
            All-in-One Studio
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            File & Media Studio
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2 font-medium hidden sm:block">
            Resize storage (KB/MB), convert (PDF ↔ Word, PNG ↔ JPG), crop, edit & remove photo background.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
          <span>Open Studio</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWorkflowCards;

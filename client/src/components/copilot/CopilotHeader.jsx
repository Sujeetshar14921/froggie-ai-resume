import React from "react";
import { Plus, History, X, FileText, ChevronDown, Sparkles } from "lucide-react";
import { BrandIcon } from "../FrogLogo";
import { useCopilot } from "../../hooks/useCopilot";

const CopilotHeader = ({ onOpenHistory }) => {
  const {
    closeCopilot,
    startNewChat,
    userResumes,
    activeResumeId,
    setActiveResumeId,
  } = useCopilot();

  const activeResume = userResumes.find((r) => r._id === activeResumeId);

  return (
    <header className="relative px-4 sm:px-5 py-3.5 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shrink-0 flex items-center justify-between z-10 select-none">
      {/* BRAND & RESUME CONTEXT */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* AVATAR */}
        <div className="relative">
          <BrandIcon size="sm" />
          <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white" title="Copilot Online" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-extrabold text-sm text-slate-950 leading-tight">
              froggie <span className="text-emerald-600">Copilot</span>
            </h3>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
              AI 2.0
            </span>
          </div>

          {/* ACTIVE RESUME CONTEXT PILL */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200/60 border border-slate-200/70 px-2 py-0.5 rounded-md transition-colors">
              <FileText size={10} className="text-emerald-600 shrink-0" />
              {userResumes.length > 0 ? (
                <div className="relative flex items-center">
                  <select
                    value={activeResumeId || ""}
                    onChange={(e) => setActiveResumeId(e.target.value)}
                    className="text-[10px] font-bold text-slate-700 hover:text-emerald-800 bg-transparent outline-none cursor-pointer truncate max-w-[120px] sm:max-w-[160px] pr-2.5"
                    title="Active resume context"
                  >
                    {userResumes.map((res) => (
                      <option key={res._id} value={res._id}>
                        {res.title || "My Resume"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={9} className="text-slate-400 pointer-events-none -ml-2" />
                </div>
              ) : (
                <span className="text-[10px] font-medium text-slate-400">No resume linked</span>
              )}
            </div>
            {activeResume && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-emerald-600 font-bold">
                <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                Synced
              </span>
            )}
          </div>
        </div>
      </div>

      {/* HEADER ACTIONS */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* NEW CHAT BUTTON */}
        <button
          onClick={startNewChat}
          title="Start fresh conversation"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-all cursor-pointer shadow-2xs group"
        >
          <Plus size={12} className="text-emerald-600 group-hover:rotate-90 transition-transform duration-200" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* CHAT HISTORY BUTTON */}
        <button
          onClick={onOpenHistory}
          title="Chat History"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <History size={15} />
        </button>

        {/* CLOSE BUTTON */}
        <button
          onClick={closeCopilot}
          title="Close (Esc)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
};

export default CopilotHeader;

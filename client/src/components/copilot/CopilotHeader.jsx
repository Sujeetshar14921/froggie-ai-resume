import React from "react";
import { Plus, History, X, FileText, ChevronDown } from "lucide-react";
import FrogFace from "../FrogLogo";
import { useCopilot } from "../../hooks/useCopilot";

const CopilotHeader = ({ onOpenHistory }) => {
  const {
    closeCopilot,
    startNewChat,
    userResumes,
    activeResumeId,
    setActiveResumeId,
  } = useCopilot();

  return (
    <header className="px-5 py-3.5 border-b border-slate-100 bg-white/90 backdrop-blur-xl shrink-0 flex items-center justify-between z-10 select-none">
      
      {/* BRAND & RESUME CONTEXT */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative size-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0 border border-emerald-400/30">
          <FrogFace size={24} />
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Online" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-black text-sm sm:text-base text-slate-900 leading-tight tracking-tight">
              froggie <span className="text-emerald-600">Copilot</span>
            </h3>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase tracking-wider">
              AI Smart
            </span>
          </div>

          {/* ACTIVE RESUME CONTEXT PILL */}
          <div className="flex items-center gap-1 mt-0.5">
            <FileText size={11} className="text-slate-400 shrink-0" />
            {userResumes.length > 0 ? (
              <div className="relative flex items-center">
                <select
                  value={activeResumeId || ""}
                  onChange={(e) => setActiveResumeId(e.target.value)}
                  className="text-[11px] font-bold text-slate-600 hover:text-emerald-600 bg-transparent outline-none cursor-pointer truncate max-w-[140px] sm:max-w-[180px] pr-3"
                  title="Select resume context for AI"
                >
                  {userResumes.map((res) => (
                    <option key={res._id} value={res._id}>
                      {res.title || "My Resume"}
                    </option>
                  ))}
                </select>
                <ChevronDown size={10} className="text-slate-400 pointer-events-none -ml-2.5" />
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">No resume attached</span>
            )}
          </div>
        </div>
      </div>

      {/* HEADER ACTIONS */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          onClick={startNewChat}
          title="Start fresh conversation"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <Plus size={13} className="text-emerald-600" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button
          onClick={onOpenHistory}
          title="Past Chats"
          className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <History size={16} />
        </button>

        <button
          onClick={closeCopilot}
          title="Close drawer"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={17} />
        </button>
      </div>
    </header>
  );
};

export default CopilotHeader;

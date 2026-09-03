import React from "react";
import { Plus, History, X, FileText, ChevronDown, Sparkles } from "lucide-react";
import FrogFace, { BrandIcon } from "../FrogLogo";
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
    <header className="relative px-5 py-4 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shrink-0 flex items-center justify-between z-10 select-none">
      {/* BRAND & RESUME CONTEXT */}
      <div className="flex items-center gap-3 min-w-0">
        {/* AVATAR WITH LIVE GLOW */}
        <div className="relative">
          <BrandIcon size="md" />
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Copilot Online" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm sm:text-base text-slate-950 leading-tight tracking-tight">
              froggie <span className="text-emerald-600">Copilot</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase tracking-wider">
              <Sparkles size={9} />
              AI 2.0
            </span>
          </div>

          {/* ACTIVE RESUME CONTEXT PILL */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 px-2 py-0.5 rounded-lg transition-colors">
              <FileText size={11} className="text-emerald-700 shrink-0" />
              {userResumes.length > 0 ? (
                <div className="relative flex items-center">
                  <select
                    value={activeResumeId || ""}
                    onChange={(e) => setActiveResumeId(e.target.value)}
                    className="text-[11px] font-bold text-slate-700 hover:text-emerald-700 bg-transparent outline-none cursor-pointer truncate max-w-[130px] sm:max-w-[180px] pr-3"
                    title="Active resume context"
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
                <span className="text-[10px] font-semibold text-slate-400">No resume linked</span>
              )}
            </div>
            {activeResume && (
              <span className="hidden sm:inline-block text-[10px] text-emerald-600 font-semibold">
                ● In Sync
              </span>
            )}
          </div>
        </div>
      </div>

      {/* HEADER ACTIONS */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* NEW CHAT BUTTON */}
        <button
          onClick={startNewChat}
          title="Start fresh conversation"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <Plus size={13} className="text-emerald-600 group-hover:rotate-90 transition-transform duration-200" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* CHAT HISTORY BUTTON */}
        <button
          onClick={onOpenHistory}
          title="Past Chats"
          className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
        >
          <History size={16} />
        </button>

        {/* CLOSE BUTTON */}
        <button
          onClick={closeCopilot}
          title="Close drawer (Esc)"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
        >
          <X size={17} />
        </button>
      </div>

      {/* HAIRLINE ACCENT LINE */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
    </header>
  );
};

export default CopilotHeader;

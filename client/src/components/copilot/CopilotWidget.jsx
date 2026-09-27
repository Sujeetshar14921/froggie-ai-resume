import React from "react";
import { useSelector } from "react-redux";
import { BrandIcon } from "../FrogLogo";
import { useCopilot } from "../../hooks/useCopilot";
import { Sparkles } from "lucide-react";

const CopilotWidget = () => {
  const { user } = useSelector((state) => state.auth);
  const { isOpen, openCopilot } = useCopilot();

  if (!user || isOpen) return null;

  return (
    <aside
      id="copilot-widget"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 pointer-events-auto no-print"
      aria-label="froggie AI Career Copilot Launcher"
    >
      <button
        type="button"
        onClick={() => openCopilot()}
        className="relative group flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full bg-slate-950/90 hover:bg-slate-900 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-emerald-500/30 backdrop-blur-xl cursor-pointer select-none ring-1 ring-white/10"
        title="Chat with Froggie AI Copilot"
        aria-label="Open Froggie AI Copilot"
      >
        {/* AMBIENT AURORA GLOW */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

        {/* LOGO WITH ONLINE STATUS */}
        <div className="relative">
          <BrandIcon
            size="sm"
            iconClassName="group-hover:rotate-6 transition-transform duration-300 drop-shadow-sm"
          />
          <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
        </div>

        {/* LABELS */}
        <div className="relative text-left flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              Copilot
            </span>
            <span className="px-1 py-0.2 rounded text-[8px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              AI
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <span>Ask anything</span>
            <Sparkles size={8} className="text-emerald-400 animate-pulse" />
          </span>
        </div>
      </button>
    </aside>
  );
};

export default CopilotWidget;

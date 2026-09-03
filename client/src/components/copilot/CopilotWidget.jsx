import React from "react";
import { useSelector } from "react-redux";
import FrogFace, { BrandIcon } from "../FrogLogo";
import { useCopilot } from "../../hooks/useCopilot";
import { Sparkles } from "lucide-react";

const CopilotWidget = () => {
  const { user } = useSelector((state) => state.auth);
  const { isOpen, openCopilot } = useCopilot();

  if (!user || isOpen) return null;

  return (
    <aside
      id="copilot-widget"
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 pointer-events-auto no-print"
      aria-label="froggie AI Career Copilot Launcher"
    >
      <button
        type="button"
        onClick={() => openCopilot()}
        className="relative group flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-full bg-slate-950/95 hover:bg-slate-900 text-white shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 border border-emerald-500/40 backdrop-blur-xl cursor-pointer select-none ring-1 ring-white/10"
        title="Chat with Froggie AI Career Copilot"
        aria-label="Open Froggie AI Career Copilot"
      >
        {/* AMBIENT GLOW AURORA */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-40 blur-md group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />

        {/* FROG EMBLEM AVATAR WITH LIVE STATUS */}
        <div className="relative">
          <BrandIcon
            size="sm"
            iconClassName="group-hover:rotate-6 transition-transform duration-300 drop-shadow-sm"
          />
          {/* Active online ping dot */}
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 animate-ping ring-2 ring-slate-950 opacity-75" />
        </div>

        {/* PILL LABELS */}
        <div className="relative text-left flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              froggie Copilot
            </span>
            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
              AI
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
            <span>Ask career questions</span>
            <Sparkles size={9} className="text-emerald-400 animate-pulse" />
          </span>
        </div>

        {/* KEYBOARD SHORTCUT BADGE (DESKTOP) */}
        <div className="relative hidden md:flex items-center ml-1">
          <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 bg-slate-800/80 border border-slate-700/80 rounded-md shadow-2xs group-hover:text-white transition-colors">
            Ask
          </kbd>
        </div>
      </button>
    </aside>
  );
};

export default CopilotWidget;

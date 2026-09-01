import React from "react";
import FrogFace from "../FrogLogo";
import { useCopilot } from "../../hooks/useCopilot";

const CopilotWidget = () => {
  const { isOpen, openCopilot } = useCopilot();

  if (isOpen) return null;

  return (
    <aside
      id="copilot-widget"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 pointer-events-auto no-print"
      aria-label="froggie AI Career Copilot Launcher"
    >
      <button
        type="button"
        onClick={() => openCopilot()}
        className="relative group size-14 sm:size-15 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/65 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/40 cursor-pointer select-none"
        title="Chat with Froggie AI"
        aria-label="Open Froggie AI Career Copilot"
      >
        {/* GLOW PULSE RING */}
        <span className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-50 blur-md group-hover:opacity-85 transition duration-500 animate-pulse pointer-events-none" />

        {/* FROG FACE ICON */}
        <div className="relative flex items-center justify-center">
          <FrogFace size={34} className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-sm" />
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-300 animate-ping" />
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400 border-2 border-emerald-800" />
        </div>

        {/* HOVER TOOLTIP BADGE */}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-950/90 text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl backdrop-blur-sm hidden sm:flex items-center gap-1.5 border border-slate-800">
          <span>froggie AI Copilot</span>
          <span className="text-[9px] uppercase px-1 py-0.2 bg-emerald-500/30 text-emerald-300 rounded font-black">AI</span>
        </span>
      </button>
    </aside>
  );
};

export default CopilotWidget;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCopilot } from "../../hooks/useCopilot";
import CopilotHeader from "./CopilotHeader";
import CopilotMessageList from "./CopilotMessageList";
import CopilotInputBar from "./CopilotInputBar";
import CopilotHistoryDrawer from "./CopilotHistoryDrawer";

const CopilotDrawer = () => {
  const { user } = useSelector((state) => state.auth);
  const { isOpen, closeCopilot } = useCopilot();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isHistoryOpen) {
        closeCopilot();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isHistoryOpen, closeCopilot]);

  if (!user || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* SOFT BACKDROP WITH BLUR */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCopilot}
        aria-hidden="true"
      />

      {/* FLOATING DRAWER PANEL - SLEEK & LIGHTWEIGHT */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-6 pointer-events-none">
        <div className="w-screen max-w-full sm:max-w-lg md:max-w-[540px] bg-white/98 backdrop-blur-2xl shadow-2xl shadow-slate-950/20 border-l border-slate-200/80 flex flex-col h-full relative pointer-events-auto sm:rounded-l-3xl overflow-hidden animate-in slide-in-from-right duration-300 ease-out">
          
          {/* AMBIENT TOP GLOW */}
          <div className="absolute top-0 right-1/4 w-72 h-32 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none" />

          {/* HEADER */}
          <CopilotHeader onOpenHistory={() => setIsHistoryOpen(true)} />

          {/* MAIN CONVERSATION STREAM & DYNAMIC CARDS */}
          <CopilotMessageList />

          {/* INPUT BAR */}
          <CopilotInputBar />

          {/* HISTORY OVERLAY DRAWER */}
          <CopilotHistoryDrawer
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
          />

        </div>
      </div>
    </div>
  );
};

export default CopilotDrawer;

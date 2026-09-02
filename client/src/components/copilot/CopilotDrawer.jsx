import React, { useState } from "react";
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

  if (!user || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      
      {/* SOFT BACKDROP WITH BLUR */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCopilot}
      />

      {/* FLOATING DRAWER PANEL */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
        <div className="w-screen max-w-full sm:max-w-xl md:max-w-2xl bg-white/95 backdrop-blur-2xl shadow-2xl border-l border-slate-200/80 flex flex-col h-full relative pointer-events-auto sm:rounded-l-3xl overflow-hidden animate-in slide-in-from-right duration-300 ease-out">
          
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

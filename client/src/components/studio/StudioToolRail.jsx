import React from "react";
import { Download, ChevronRight, ChevronLeft } from "lucide-react";

const StudioToolRail = ({
  studioTools,
  activeTab,
  isPanelOpen,
  handleTabClick,
  handleDownload,
  isProcessing,
  targetFormat,
  setIsPanelOpen,
}) => {
  return (
    <div className="w-full lg:w-[68px] xl:w-[72px] shrink-0 bg-white dark:bg-[#0c1424] rounded-2xl border border-slate-200/80 dark:border-slate-800 flex lg:flex-col items-center justify-between p-1.5 lg:py-2.5 gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar">
      <div className="flex lg:flex-col items-center gap-1 w-full">
        {studioTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id && isPanelOpen;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => handleTabClick(tool.id)}
              className={`relative w-full py-2 lg:py-2.5 px-2 lg:px-1 rounded-xl flex lg:flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer ${
                isActive
                  ? "bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold border border-emerald-500/30"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 font-bold border border-transparent"
              }`}
              title={tool.label}
            >
              {isActive && (
                <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full" />
              )}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700"
                }`}
              >
                <Icon size={16} />
              </div>
              <span className="text-[10px] tracking-tight leading-none text-center whitespace-nowrap">
                {tool.shortLabel}
              </span>
            </button>
          );
        })}

        {/* Mobile/Tablet Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isProcessing}
          className="lg:hidden p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50 transition-colors"
          title={`Download (${targetFormat.toUpperCase()})`}
        >
          <Download size={15} className="text-white" />
        </button>
      </div>

      {/* Rail Bottom Actions (Desktop Only) */}
      <div className="hidden lg:flex flex-col items-center gap-1.5 w-full pt-2 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <button
          type="button"
          onClick={() => setIsPanelOpen((v) => !v)}
          className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title={isPanelOpen ? "Collapse Controls Panel" : "Expand Controls Panel"}
        >
          {isPanelOpen ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isProcessing}
          className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          title={`Download (${targetFormat.toUpperCase()})`}
        >
          <Download size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default StudioToolRail;

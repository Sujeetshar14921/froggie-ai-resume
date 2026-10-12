import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TemplateSelector from "../TemplateSelector";
import ColorPicker from "../ColorPicker";

const BuilderToolbar = ({
  template,
  accentColor,
  activeSectionIndex,
  totalSections,
  onChangeTemplate,
  onChangeAccentColor,
  onPrevSection,
  onNextSection,
}) => {
  return (
    <div className="shrink-0 px-4 sm:px-5 py-2.5 bg-slate-50/70 dark:bg-[#0c1424]/90 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
      {/* LEFT: TEMPLATE & ACCENT COLOR */}
      <div className="flex items-center gap-2">
        <TemplateSelector selectedTemplate={template} onChange={onChangeTemplate} />
        <ColorPicker selectedColor={accentColor} onChange={onChangeAccentColor} />
      </div>

      {/* RIGHT: PREVIOUS & NEXT STEP BUTTONS */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevSection}
          disabled={activeSectionIndex === 0}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft className="size-3.5" /> Prev
        </button>
        <button
          onClick={onNextSection}
          disabled={activeSectionIndex === totalSections - 1}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/80 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          Next <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BuilderToolbar;

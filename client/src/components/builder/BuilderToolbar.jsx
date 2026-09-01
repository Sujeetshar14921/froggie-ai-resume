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
    <div className="shrink-0 px-4 sm:px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
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
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-200/70 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft className="size-3.5" /> Prev
        </button>
        <button
          onClick={onNextSection}
          disabled={activeSectionIndex === totalSections - 1}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          Next <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BuilderToolbar;

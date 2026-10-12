import React, { useState, useRef, useEffect } from "react";
import { Check, Layout, Sparkles, ShieldCheck } from "lucide-react";
import { TEMPLATES } from "../constants/templates";
import FrogFace from "./FrogLogo";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const activeTemplate = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all px-3 py-1.5 rounded-lg cursor-pointer"
        title="Choose Resume Template"
      >
        <Layout size={13} className="text-emerald-600 dark:text-emerald-400" />
        <span className="max-sm:hidden">{activeTemplate.name}</span>
        <span className="sm:hidden">Template</span>
        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/80">
          ATS {activeTemplate.atsScore}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 p-3 z-50 bg-white dark:bg-[#0c1424] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-h-[75vh] overflow-y-auto space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <FrogFace size={15} />
              Choose Template
            </span>
            <span className="text-[10px] text-slate-400 font-medium">ATS-Optimized</span>
          </div>

          <div className="space-y-2.5">
            {TEMPLATES.map((template) => {
              const isSelected = selectedTemplate === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => {
                    onChange(template.id);
                    setIsOpen(false);
                  }}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "dropdown-item-3d-selected"
                      : "dropdown-item-3d border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 dark:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs font-bold ${isSelected ? "text-emerald-950 font-black" : "text-slate-800 dark:text-slate-200"}`}>
                          {template.name}
                        </h4>
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                          isSelected ? "bg-emerald-200/80 text-emerald-900 border border-emerald-300/80" : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                        }`}>
                          <ShieldCheck size={10} className="lucide-3d" />
                          ATS {template.atsScore}
                        </span>
                        {template.badge && (
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {template.badge}
                          </span>
                        )}
                      </div>

                      <p className={`text-[11px] mt-1 leading-snug ${isSelected ? "text-emerald-900/80 font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                        {template.description}
                      </p>

                      <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Best For:</span>
                        <span className="truncate">{template.bestFor}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="icon-3d-pod icon-3d-pod-emerald shrink-0 size-6 rounded-full flex items-center justify-center text-white">
                        <Check size={13} strokeWidth={3} className="lucide-3d" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
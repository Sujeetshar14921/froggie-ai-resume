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
        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all px-3 py-1.5 rounded-lg cursor-pointer"
        title="Choose Resume Template"
      >
        <Layout size={13} className="text-emerald-600" />
        <span className="max-sm:hidden">{activeTemplate.name}</span>
        <span className="sm:hidden">Template</span>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80">
          ATS {activeTemplate.atsScore}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 p-3 z-50 bg-white rounded-xl border border-slate-200 shadow-xl max-h-[75vh] overflow-y-auto space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FrogFace size={15} />
              Choose Template
            </span>
            <span className="text-[10px] text-slate-400 font-medium">ATS-Optimized</span>
          </div>

          <div className="space-y-2">
            {TEMPLATES.map((template) => {
              const isSelected = selectedTemplate === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => {
                    onChange(template.id);
                    setIsOpen(false);
                  }}
                  className={`relative p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                      : "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs font-bold ${isSelected ? "text-emerald-950" : "text-slate-800"}`}>
                          {template.name}
                        </h4>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                          <ShieldCheck size={10} />
                          ATS {template.atsScore}
                        </span>
                        {template.badge && (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {template.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {template.description}
                      </p>

                      <div className="mt-2 text-[10px] text-slate-600 font-medium flex items-center gap-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Best For:</span>
                        <span className="truncate">{template.bestFor}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 size-5 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xs">
                        <Check size={12} strokeWidth={3} />
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
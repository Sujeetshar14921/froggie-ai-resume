import React from "react";
import { Check } from "lucide-react";
import { BUILDER_SECTIONS } from "../../constants/sections";

const BuilderStepper = ({ activeSectionIndex, onSelectSection }) => {
  const progressPercent = (activeSectionIndex * 100) / (BUILDER_SECTIONS.length - 1);

  return (
    <div className="relative shrink-0 border-b border-slate-100 bg-slate-50/40">
      {/* PROGRESS STEP BAR */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-10">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* STEPPER BUTTONS */}
      <div className="pt-4 pb-2.5 px-4 sm:px-5">
        <div className="flex items-start justify-between gap-1">
          {BUILDER_SECTIONS.map((section, index) => {
            const isActive = index === activeSectionIndex;
            const isDone = index < activeSectionIndex;
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => onSelectSection(index)}
                className="flex flex-col items-center gap-1 group flex-1 min-w-0 transition-all cursor-pointer"
                title={section.name}
              >
                <div
                  className={`flex items-center justify-center size-7 sm:size-8 rounded-full border transition-all shrink-0 ${
                    isActive
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 font-bold"
                      : isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-200 text-slate-400 group-hover:border-slate-300 bg-white"
                  }`}
                >
                  {isDone ? <Check className="size-3.5 stroke-[2.5]" /> : <Icon className="size-3.5" />}
                </div>
                <span
                  className={`text-[10px] font-semibold truncate max-w-full ${
                    isActive ? "text-emerald-700" : isDone ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {section.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BuilderStepper;

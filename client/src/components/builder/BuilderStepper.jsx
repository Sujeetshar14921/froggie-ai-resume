import React, { useRef, useEffect, useState } from "react";
import { Check, GripVertical } from "lucide-react";
import { BUILDER_SECTIONS } from "../../constants/sections";

const BuilderStepper = ({
  sections = BUILDER_SECTIONS,
  activeSectionIndex,
  onSelectSection,
  onReorderSections,
}) => {
  const progressPercent =
    sections.length > 1 ? (activeSectionIndex * 100) / (sections.length - 1) : 100;
  const scrollRef = useRef(null);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.children[activeSectionIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [activeSectionIndex]);

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...sections];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    if (onReorderSections) {
      onReorderSections(updated);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="relative shrink-0 border-b border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-[#0a0f1d] select-none">
      {/* PROGRESS STEP BAR */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 z-10">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* STEPPER PILLS BAR */}
      <div className="pt-2.5 pb-2 px-3 sm:px-4">
        <div className="flex items-center justify-between pb-1.5 text-[10.5px]">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span>Section {activeSectionIndex + 1} of {sections.length}:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{sections[activeSectionIndex]?.name}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
            <GripVertical size={11} className="text-slate-400" />
            <span>Drag tabs to reorder preview</span>
          </span>
        </div>

        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {sections.map((section, index) => {
            const isActive = index === activeSectionIndex;
            const isDone = index < activeSectionIndex;
            const Icon = section.icon;
            const isBeingDragged = draggedIndex === index;
            const isDragTarget = dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={(e) => handleDragLeave(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectSection(index)}
                className={`group shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all cursor-grab active:cursor-grabbing border whitespace-nowrap shadow-2xs ${
                  isBeingDragged
                    ? "opacity-30 border-dashed border-emerald-500 scale-95 bg-emerald-50/50 dark:bg-emerald-950/30"
                    : isDragTarget
                    ? "border-emerald-500 ring-2 ring-emerald-400/40 bg-emerald-50 dark:bg-emerald-950/40 scale-105"
                    : isActive
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold ring-2 ring-emerald-500/20"
                    : isDone
                    ? "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-300 font-semibold"
                    : "bg-white dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:text-slate-800 hover:border-slate-300"
                }`}
                title={`Click to edit or drag to reorder: ${section.name}`}
              >
                {/* ICON */}
                <div className="shrink-0 flex items-center justify-center">
                  {isDone ? (
                    <Check className={`size-3.5 stroke-[2.5] ${isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                  ) : (
                    <Icon className={`size-3.5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600"}`} />
                  )}
                </div>

                {/* FULL LEGIBLE LABEL */}
                <span className="text-xs tracking-tight">
                  {section.name}
                </span>

                {/* SUBTLE REORDER HANDLE */}
                <GripVertical
                  size={10}
                  className={`opacity-0 group-hover:opacity-60 transition-opacity shrink-0 ${
                    isActive ? "text-emerald-200" : "text-slate-400"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BuilderStepper;

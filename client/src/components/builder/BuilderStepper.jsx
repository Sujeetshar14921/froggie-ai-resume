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
    <div className="relative shrink-0 border-b border-slate-100 bg-slate-50/50 select-none">
      {/* PROGRESS STEP BAR */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-10">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* STEPPER BUTTONS */}
      <div className="pt-2.5 pb-2 px-3 sm:px-4">
        <div className="flex items-center justify-between pb-1 text-[10.5px] text-slate-400">
          <span className="font-semibold text-slate-500">Sections Navigation</span>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
            <GripVertical size={11} className="text-emerald-500" />
            <span>Drag tabs to change preview order</span>
          </span>
        </div>

        <div
          ref={scrollRef}
          className="flex items-start gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
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
                className={`relative flex flex-col items-center gap-1 group shrink-0 min-w-[58px] sm:min-w-[64px] px-1.5 py-1.5 rounded-xl transition-all cursor-grab active:cursor-grabbing border ${
                  isBeingDragged
                    ? "opacity-30 border-dashed border-emerald-500 scale-95 bg-emerald-50/50"
                    : isDragTarget
                    ? "border-emerald-500 ring-2 ring-emerald-400/30 bg-emerald-50 scale-105"
                    : isActive
                    ? "bg-emerald-50/90 border-emerald-300/80 shadow-2xs"
                    : "border-transparent hover:bg-slate-100/70 hover:border-slate-200/60"
                }`}
                title={`Click to edit or drag to reorder: ${section.name}`}
              >
                {/* ICON BADGE */}
                <div
                  className={`flex items-center justify-center size-7 sm:size-7.5 rounded-full border transition-all shrink-0 relative ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20"
                      : isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-200 text-slate-400 group-hover:border-slate-300 bg-white"
                  }`}
                >
                  {isDone ? <Check className="size-3 stroke-[2.5]" /> : <Icon className="size-3.5" />}
                </div>

                {/* LABEL */}
                <span
                  className={`text-[10px] font-semibold text-center leading-tight truncate max-w-[68px] ${
                    isActive ? "text-emerald-800 font-bold" : isDone ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {section.name}
                </span>

                {/* DRAG HANDLE AFFORDANCE (VISIBLE ON HOVER) */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <GripVertical size={10} className="text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BuilderStepper;

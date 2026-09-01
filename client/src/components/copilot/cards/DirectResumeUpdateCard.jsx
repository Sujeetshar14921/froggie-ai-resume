import React, { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight, FileCheck } from "lucide-react";
import { useCopilot } from "../../../hooks/useCopilot";
import toast from "react-hot-toast";
import FrogFace from "../../FrogLogo";

const DirectResumeUpdateCard = ({ data = {} }) => {
  const { applyDirectResumeUpdate } = useCopilot();
  const [applied, setApplied] = useState(false);

  const {
    summaryOfChanges = "Resume updates prepared by froggie AI",
    affectedSections = [],
    updates = {},
  } = data;

  const handleApply = async () => {
    if (!updates || Object.keys(updates).length === 0) {
      toast.error("No updates found to apply.");
      return;
    }

    try {
      await applyDirectResumeUpdate(updates, summaryOfChanges);
      setApplied(true);
      setTimeout(() => setApplied(false), 3500);
    } catch (err) {
      console.error("Apply update error:", err);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold uppercase tracking-wider text-[10px] border border-emerald-200">
            <FrogFace size={13} />
            Resume Updates Ready
          </span>
        </div>
      </div>

      {/* SUMMARY OF CHANGES */}
      <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
        <div className="flex items-center gap-2">
          <FileCheck size={16} className="text-emerald-600 shrink-0" />
          <p className="font-extrabold text-sm text-emerald-950">
            {summaryOfChanges}
          </p>
        </div>

        {/* AFFECTED SECTIONS BADGES */}
        {affectedSections.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700">Updated Sections:</span>
            {affectedSections.map((sec, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider capitalize"
              >
                {sec.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED CHANGES PREVIEW (CLEAN UI, ZERO RAW JSON) */}
      <div className="space-y-2 text-[11px]">
        {/* SKILLS PREVIEW */}
        {Array.isArray(updates.skills) && updates.skills.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">
              Updated Skills List ({updates.skills.length}):
            </span>
            <div className="flex flex-wrap gap-1">
              {updates.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SUMMARY PREVIEW */}
        {updates.professional_summary && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">
              Updated Professional Summary:
            </span>
            <p className="text-slate-600 leading-relaxed italic">
              "{updates.professional_summary}"
            </p>
          </div>
        )}

        {/* PROFESSION / TITLE PREVIEW */}
        {updates.personal_info?.profession && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">
              Target Role / Profession:
            </span>
            <span className="font-bold text-emerald-700 text-xs">
              {updates.personal_info.profession}
            </span>
          </div>
        )}

        {/* PROJECTS PREVIEW */}
        {Array.isArray(updates.project) && updates.project.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">
              Updated Projects ({updates.project.length}):
            </span>
            <div className="space-y-1">
              {updates.project.slice(0, 3).map((p, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-600">
                  <strong className="text-slate-800 shrink-0">• {p.name || "Project"}:</strong>
                  <span className="truncate">{p.description || p.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* APPLY BUTTON */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
        <button
          onClick={handleApply}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
            applied
              ? "bg-emerald-600 text-white"
              : "bg-slate-950 hover:bg-slate-900 text-white shadow-slate-950/20 border border-emerald-500/30"
          }`}
        >
          {applied ? (
            <>
              <CheckCircle2 size={15} />
              <span>Applied to Resume Successfully!</span>
            </>
          ) : (
            <>
              <FrogFace size={15} />
              <span>Apply Changes to Resume Directly</span>
              <ArrowRight size={14} className="text-emerald-400" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default DirectResumeUpdateCard;

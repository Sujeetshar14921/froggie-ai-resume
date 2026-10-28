import React from "react";
import { ExternalLink, X } from "lucide-react";
import ResumePreview from "../ResumePreview";

const TalentPreviewDrawer = ({
  candidate,
  onClose,
  onNavigateView,
}) => {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 text-left">
        {/* DRAWER TOP BAR */}
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
              {candidate.personal_info?.full_name?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">
                {candidate.personal_info?.full_name || "Candidate"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {candidate.personal_info?.profession || candidate.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateView(candidate._id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 text-white font-bold text-xs shadow-xs hover:bg-slate-900 cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Full Screen</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* DRAWER RESUME BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70 flex justify-center">
          <div className="w-full max-w-[210mm]">
            <ResumePreview
              data={candidate}
              template={candidate.template}
              accentColor={candidate.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentPreviewDrawer;

import React from "react";
import {
  FilePenLineIcon,
  Trash2,
  Eye,
  Calendar,
  Globe,
  Lock,
  Loader2,
  ShieldCheck,
  Copy,
  ExternalLink,
  Target,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatters";

const ResumeCard = ({
  resume,
  isDeleting,
  onEdit,
  onViewPublic,
  onDelete,
  onDuplicate,
  onToggleVisibility,
}) => {
  const navigate = useNavigate();

  const profession = resume.personal_info?.profession || "Profession not set";
  const fullName = resume.personal_info?.full_name || "";
  const accentColor = resume.accent_color || "#10B981";

  const handleTogglePublic = (e) => {
    e.stopPropagation();
    if (onToggleVisibility) {
      onToggleVisibility(resume._id, resume.public);
    }
  };

  return (
    <div
      onClick={onEdit}
      className="group relative overflow-hidden bg-white dark:bg-[#0c1424] rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left space-y-4"
    >
      {/* HALF-CIRCLE COLORFUL AURA ACCENTS */}
      <div
        className="absolute top-0 right-0 w-28 h-28 rounded-bl-full pointer-events-none opacity-25 group-hover:opacity-45 group-hover:scale-125 transition-all duration-500"
        style={{
          background: `radial-gradient(circle at top right, ${accentColor} 0%, transparent 70%)`,
        }}
      />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-emerald-500/10 via-teal-400/5 to-transparent rounded-tr-full pointer-events-none opacity-30 group-hover:opacity-70 transition-all duration-500" />

      {/* TOP COLOR ACCENT BAR */}
      <div
        className="absolute top-0 left-6 right-6 h-1 rounded-b-full transition-all group-hover:h-1.5 z-10"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10 space-y-3 pt-1">
        {/* TOP ROW: ICON & VISIBILITY BADGE */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="icon-3d-pod w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs"
            style={{
              background: `linear-gradient(145deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
              borderColor: `${accentColor}80`,
              boxShadow: `0 1px 2px rgba(255, 255, 255, 0.45) inset, 0 -2px 4px rgba(0, 0, 0, 0.3) inset, 0 4px 10px -2px ${accentColor}40`,
              color: "#ffffff",
            }}
          >
            <FilePenLineIcon size={20} className="lucide-3d text-white" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
              {resume.template || "Classic"}
            </span>

            {/* INTERACTIVE PUBLIC / PRIVATE TOGGLE BADGE */}
            <button
              type="button"
              onClick={handleTogglePublic}
              title={resume.public ? "Published in Talent Pool (Click to make Private)" : "Private (Click to Publish to Talent Pool)"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer border ${
                resume.public
                  ? "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800/60 shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              {resume.public ? (
                <>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <Globe size={10} className="text-emerald-700 dark:text-emerald-400" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock size={10} className="text-slate-400 dark:text-slate-500" />
                  <span>Private</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* TITLE & PROFESSION */}
        <div>
          <h3 className="font-black text-base sm:text-lg text-slate-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
            {resume.title || "Untitled Resume"}
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {fullName ? `${fullName} • ${profession}` : profession}
          </p>
        </div>

        {/* METADATA ROW */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(resume.updatedAt?.slice(0, 10)) ||
              new Date(resume.updatedAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
          </span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">ATS Optimized</span>
        </div>
      </div>

      {/* BOTTOM ACTIONS TOOLBAR */}
      <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {/* ATS BENCHMARK SCAN */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/ats-checker?resumeId=${resume._id}`);
            }}
            title="Scan with ATS Checker"
            className="px-2.5 py-1.5 rounded-xl text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-black transition-colors cursor-pointer flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs"
          >
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>ATS Match</span>
          </button>

          {/* DUPLICATE BUTTON */}
          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(resume._id);
              }}
              title="Duplicate Resume"
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Copy size={14} />
            </button>
          )}

          {/* PUBLIC VIEW LINK */}
          {resume.public && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewPublic();
              }}
              title="View Public Link"
              className="p-2 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors cursor-pointer"
            >
              <Eye size={14} />
            </button>
          )}

          {/* DELETE BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            title="Delete Resume"
            className="btn-3d-delete p-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin text-rose-500" />
            ) : (
              <Trash2 size={14} className="lucide-3d" />
            )}
          </button>
        </div>

        {/* PRIMARY EDIT BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer border border-emerald-500/30 group-hover:scale-102 active:scale-98"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;


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
      className="group relative overflow-hidden bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left space-y-4"
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
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 shrink-0"
            style={{
              backgroundColor: accentColor + "18",
              color: accentColor,
            }}
          >
            <FilePenLineIcon size={20} />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
              {resume.template || "Classic"}
            </span>

            {/* INTERACTIVE PUBLIC / PRIVATE TOGGLE BADGE */}
            <button
              type="button"
              onClick={handleTogglePublic}
              title={resume.public ? "Published in Talent Pool (Click to make Private)" : "Private (Click to Publish to Talent Pool)"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer border ${
                resume.public
                  ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300/80 shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
              }`}
            >
              {resume.public ? (
                <>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <Globe size={10} className="text-emerald-700" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock size={10} className="text-slate-400" />
                  <span>Private</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* TITLE & PROFESSION */}
        <div>
          <h3 className="font-black text-base sm:text-lg text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-snug">
            {resume.title || "Untitled Resume"}
          </h3>
          <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
            {fullName ? `${fullName} • ${profession}` : profession}
          </p>
        </div>

        {/* METADATA ROW */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
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
          <span className="text-emerald-600 font-bold">ATS Optimized</span>
        </div>
      </div>

      {/* BOTTOM ACTIONS TOOLBAR */}
      <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {/* ATS BENCHMARK SCAN */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/ats-checker?resumeId=${resume._id}`);
            }}
            title="Scan with ATS Checker"
            className="px-2.5 py-1.5 rounded-xl text-emerald-800 hover:bg-emerald-50 text-xs font-black transition-colors cursor-pointer flex items-center gap-1 border border-emerald-200/60 shadow-2xs"
          >
            <ShieldCheck size={14} className="text-emerald-600" />
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
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
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
              className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
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
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin text-red-500" />
            ) : (
              <Trash2 size={14} />
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
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer border border-emerald-500/30 group-hover:scale-102 active:scale-98"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;


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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatters";

const ResumeCard = ({ resume, isDeleting, onEdit, onViewPublic, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={onEdit}
      className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* TOP ROW: ICON & STATUS */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110"
            style={{
              backgroundColor: (resume.accent_color || "#10B981") + "18",
              color: resume.accent_color || "#10B981",
            }}
          >
            <FilePenLineIcon size={22} />
          </div>

          <div className="flex items-center gap-1.5">
            {resume.public ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Globe size={12} /> Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                <Lock size={12} /> Private
              </span>
            )}
          </div>
        </div>

        {/* TITLE & TEMPLATE */}
        <h2 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {resume.title || "Untitled Resume"}
        </h2>

        <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(resume.updatedAt?.slice(0, 10)) ||
              new Date(resume.updatedAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
          </span>
          <span>•</span>
          <span className="capitalize">{resume.template || "Classic"} Template</span>
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {resume.public && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewPublic();
              }}
              title="View Public Page"
              className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
            >
              <Eye size={16} />
            </button>
          )}

          {/* CHECK ATS SCORE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/ats-checker?resumeId=${resume._id}`);
            }}
            title="Audit ATS Score"
            className="p-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">ATS</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            title="Delete Resume"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin text-red-500" /> : <Trash2 size={16} />}
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 group-hover:bg-slate-950 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer border border-emerald-500/30"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;

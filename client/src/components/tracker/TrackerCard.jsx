import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Calendar,
  ExternalLink,
  Target,
  MoreHorizontal,
  Flame,
  Star,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { PRIORITY_LEVELS, TRACKER_STAGES } from "../../constants/trackerConfig";
import toast from "react-hot-toast";

// Deterministic company avatar colors
const AVATAR_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-emerald-600 to-teal-600",
  "from-violet-600 to-purple-600",
  "from-rose-600 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-600 to-blue-600",
];

const getCompanyGradient = (company = "") => {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

const TrackerCard = ({
  app,
  stage,
  onEdit,
  onDelete,
  onMoveStage,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Priority configuration
  const priorityCfg = PRIORITY_LEVELS.find((p) => p.id === app.priority) || PRIORITY_LEVELS[2];

  // Company initial
  const companyInitial = (app.company || "J").trim().charAt(0).toUpperCase();

  // Smart Interview / Due date calculation
  const getInterviewBadge = () => {
    if (app.stage === "interviewing" && app.interviewDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const intDate = new Date(app.interviewDate);
      intDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((intDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black animate-pulse flex items-center gap-1 border border-red-200">
            <Flame size={10} /> Interview Today!
          </span>
        );
      } else if (diffDays === 1) {
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center gap-1 border border-amber-200">
            <Clock size={10} /> Interview Tomorrow!
          </span>
        );
      } else if (diffDays > 1) {
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1 border border-amber-200">
            <Calendar size={10} /> In {diffDays} days ({app.interviewRound || "Round"})
          </span>
        );
      } else {
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium flex items-center gap-1">
            <CheckCircle2 size={10} /> Round Completed
          </span>
        );
      }
    }

    if (app.followUpDate && app.stage === "applied") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const fuDate = new Date(app.followUpDate);
      fuDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((fuDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        return (
          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold flex items-center gap-1 border border-orange-200">
            <Clock size={10} /> Follow-up Due
          </span>
        );
      }
    }

    return null;
  };

  const handleCopySummary = (e) => {
    e.stopPropagation();
    const text = `${app.position} at ${app.company} | Stage: ${stage.title} | Salary: ${app.salary || "N/A"} | Location: ${app.location || "N/A"}`;
    navigator.clipboard.writeText(text);
    toast.success("Details copied to clipboard!");
  };

  return (
    <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 space-y-2.5 text-left group relative">
      {/* CARD TOP ROW: Avatar + Position + Quick Actions */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          {/* Company Initial Avatar */}
          <div
            className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getCompanyGradient(
              app.company
            )} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs ring-2 ring-white`}
          >
            {companyInitial}
          </div>

          <div className="min-w-0">
            <h4 className="font-extrabold text-xs text-slate-950 leading-snug truncate group-hover:text-emerald-700 transition-colors">
              {app.position}
            </h4>
            <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mt-0.5 truncate">
              <span className="truncate">{app.company}</span>
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-400 hover:text-emerald-600 transition-colors inline-block"
                  title="Open Job Posting"
                >
                  <ExternalLink size={10} />
                </a>
              )}
            </p>
          </div>
        </div>

        {/* TOP RIGHT CONTROLS */}
        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(app)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Edit Application"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(app.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete Application"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* PRIORITY & INTERVIEW TIMING BADGES */}
      <div className="flex flex-wrap items-center gap-1.5">
        {app.priority && app.priority !== "medium" && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${priorityCfg.badge}`}>
            <span>{priorityCfg.icon}</span>
            <span>{priorityCfg.label}</span>
          </span>
        )}

        {getInterviewBadge()}
      </div>

      {/* SALARY & LOCATION TAGS */}
      <div className="flex flex-wrap gap-1 text-[10px]">
        {app.location && (
          <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/90 text-slate-600 font-medium flex items-center gap-1">
            <MapPin size={10} className="text-slate-400" />
            <span className="truncate max-w-[120px]">{app.location}</span>
          </span>
        )}
        {app.salary && (
          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold flex items-center gap-1">
            <DollarSign size={10} className="text-emerald-600" />
            <span>{app.salary}</span>
          </span>
        )}
      </div>

      {/* TAILORED RESUME & ATS SCAN SHORTCUT */}
      {app.tailoredResume && (
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-700 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <FileText size={11} className="text-emerald-600 shrink-0" />
            <span className="truncate font-semibold">{app.tailoredResume}</span>
          </div>

          <Link
            to={`/app/ats-checker?targetRole=${encodeURIComponent(app.position || "")}`}
            onClick={(e) => e.stopPropagation()}
            className="px-1.5 py-0.5 rounded-md bg-emerald-100/70 hover:bg-emerald-200 text-emerald-900 font-bold text-[9px] flex items-center gap-0.5 transition-colors shrink-0 cursor-pointer"
            title="Scan ATS Score for this role"
          >
            <Target size={9} />
            <span>ATS</span>
          </Link>
        </div>
      )}

      {/* NOTES SNIPPET */}
      {app.notes && (
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50/60 p-2 rounded-xl border border-slate-100 italic">
          "{app.notes}"
        </p>
      )}

      {/* DATES & MOVE CONTROLS */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <Calendar size={10} />
          <span>{app.appliedDate || "Saved"}</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopySummary}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Copy application details"
          >
            <Copy size={11} />
          </button>

          <button
            type="button"
            onClick={() => onMoveStage(app.id, -1)}
            disabled={stage.id === "wishlist"}
            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-20 text-slate-600 transition-colors cursor-pointer"
            title="Move back"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => onMoveStage(app.id, 1)}
            disabled={stage.id === "archived"}
            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-20 text-slate-600 transition-colors cursor-pointer"
            title="Move forward"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackerCard;


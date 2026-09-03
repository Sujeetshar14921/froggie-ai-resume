import React from "react";
import {
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TrackerCard = ({
  app,
  stage,
  onEdit,
  onDelete,
  onMoveStage,
}) => {
  return (
    <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2.5 text-left group relative">
      {/* CARD TOP ROW */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-bold text-xs text-slate-900 leading-tight truncate">
            {app.position}
          </h4>
          <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
            <Building2 size={11} className="shrink-0" />
            <span className="truncate">{app.company}</span>
          </p>
        </div>

        <div className="flex items-center opacity-40 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(app)}
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(app.id)}
            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* BADGES ROW */}
      <div className="flex flex-wrap gap-1 text-[10px]">
        {app.location && (
          <span className="px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-0.5">
            <MapPin size={9} />
            <span>{app.location}</span>
          </span>
        )}
        {app.salary && (
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-semibold flex items-center gap-0.5">
            <DollarSign size={9} />
            <span>{app.salary}</span>
          </span>
        )}
      </div>

      {/* TAILORED RESUME TAG */}
      {app.tailoredResume && (
        <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-600 flex items-center gap-1.5">
          <FileText size={11} className="text-emerald-600 shrink-0" />
          <span className="truncate font-medium">{app.tailoredResume}</span>
        </div>
      )}

      {/* NOTES SNIPPET */}
      {app.notes && (
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">
          "{app.notes}"
        </p>
      )}

      {/* DATES & MOVE CONTROLS */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>{app.appliedDate || "Saved"}</span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMoveStage(app.id, -1)}
            disabled={stage.id === "wishlist"}
            className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
            title="Move back"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => onMoveStage(app.id, 1)}
            disabled={stage.id === "archived"}
            className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
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

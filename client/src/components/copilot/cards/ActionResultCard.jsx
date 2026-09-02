import React from "react";
import { CheckCircle2, AlertCircle, ArrowRight, FileText, ExternalLink, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FrogFace from "../../FrogLogo";

const ActionResultCard = ({ data = {} }) => {
  const navigate = useNavigate();

  const {
    action = "Action Completed",
    status = "success",
    resumeId = null,
    resumeTitle = "",
    deletedCount = null,
    message = "Operation executed successfully.",
    buttons = [],
  } = data;

  const isSuccess = status === "success";

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 text-xs animate-in fade-in duration-200">
      
      {/* HEADER BADGE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wider text-[10px] border ${
              isSuccess
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {isSuccess ? <CheckCircle2 size={13} className="text-emerald-600" /> : <AlertCircle size={13} className="text-rose-600" />}
            <span>{action}</span>
          </span>

          {resumeTitle && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px] truncate max-w-[180px]">
              {resumeTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600">
          <FrogFace size={13} />
          <span>froggie AI</span>
        </div>
      </div>

      {/* MESSAGE CONTENT */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <p className="text-slate-700 font-medium leading-relaxed">{message}</p>
        {deletedCount !== null && deletedCount !== undefined && (
          <p className="text-[11px] font-bold text-slate-500">
            Total affected records: {deletedCount}
          </p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
        {resumeId && (
          <button
            type="button"
            onClick={() => navigate(`/app/builder/${resumeId}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md shadow-slate-950/20 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles size={13} className="text-emerald-400" />
            <span>Open in Editor</span>
            <ArrowRight size={13} />
          </button>
        )}

        {buttons.map((btn, idx) => {
          if (btn.action === "navigate" && btn.url) {
            return (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(btn.url)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  btn.variant === "primary"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <FileText size={13} />
                <span>{btn.label}</span>
              </button>
            );
          }
          return null;
        })}
      </div>

    </div>
  );
};

export default ActionResultCard;

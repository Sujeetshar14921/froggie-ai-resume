import React from "react";
import { X, Clock, Trash2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { formatDate } from "../../utils/formatters";

const AtsHistoryDrawer = ({
  isOpen,
  onClose,
  history = [],
  onSelectReport,
  onDeleteReport,
  isLoading,
}) => {
  if (!isOpen) return null;

  const getScoreBadge = (val) => {
    if (val >= 85) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (val >= 70) return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (val >= 50) return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-rose-100 text-rose-800 border-rose-300";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* HEADER */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">ATS Scan History</h3>
                <p className="text-xs text-slate-500">Your past resume evaluations</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="size-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">No Past Scans Found</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Run an ATS evaluation on any resume to see historical scores here.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group relative space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.jobTitle || "Target Role"}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        Resume: {item.resumeTitle || "Analyzed Document"}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black border uppercase tracking-wider shrink-0 ${getScoreBadge(
                        item.overallScore
                      )}`}
                    >
                      {item.overallScore} / 100
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDeleteReport(item._id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Scan"
                      >
                        <Trash2 size={13} />
                      </button>

                      <button
                        onClick={() => {
                          onSelectReport(item._id);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsHistoryDrawer;

import React, { useState, useEffect } from "react";
import { History, RotateCcw, X, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { resumeApi } from "../../api/resumeApi";
import toast from "react-hot-toast";

const VersionHistoryModal = ({ isOpen, onClose, resumeId, token, onRestored }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState(null);

  useEffect(() => {
    if (isOpen && resumeId) {
      fetchHistory();
    }
  }, [isOpen, resumeId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await resumeApi.getResumeHistory(resumeId, token);
      setHistory(data.versions || []);
    } catch (err) {
      console.error("Fetch history error:", err);
      toast.error("Could not load version history");
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (versionNumber) => {
    try {
      setRestoringVersion(versionNumber);
      const res = await resumeApi.restoreResumeVersion(resumeId, versionNumber, token);
      toast.success(`Successfully restored version ${versionNumber}! 🎉`);
      onRestored?.(res.resume);
      onClose();
    } catch (err) {
      console.error("Rollback error:", err);
      toast.error(err?.response?.data?.message || "Failed to restore version");
    } finally {
      setRestoringVersion(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Version History & Snapshots</h3>
              <p className="text-xs text-slate-500 font-medium">Rollback or restore previous autosaved revisions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Clock className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-xs font-bold">Loading revision history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No previous versions yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Snapshots will appear automatically as you make and save edits to this resume.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map((ver, idx) => {
                const dateObj = new Date(ver.savedAt);
                const isLatest = idx === 0;
                return (
                  <div
                    key={ver.versionNumber}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isLatest
                        ? "bg-emerald-50/40 border-emerald-200/80 shadow-2xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          Version {ver.versionNumber}
                        </span>
                        {isLatest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Current Version
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {ver.note || "Saved snapshot"} • {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {!isLatest && (
                      <button
                        onClick={() => handleRollback(ver.versionNumber)}
                        disabled={restoringVersion === ver.versionNumber}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw size={13} className={restoringVersion === ver.versionNumber ? "animate-spin" : ""} />
                        <span>{restoringVersion === ver.versionNumber ? "Restoring..." : "Rollback"}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Keeps last 10 snapshots automatically
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;

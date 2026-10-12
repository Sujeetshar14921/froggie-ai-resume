import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, X, AlertTriangle, RefreshCw, FileText } from "lucide-react";
import { resumeApi } from "../../api/resumeApi";
import toast from "react-hot-toast";

const TrashModal = ({ isOpen, onClose, token, onRestoreSuccess }) => {
  const [trashList, setTrashList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTrash();
    }
  }, [isOpen]);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const data = await resumeApi.getTrashResumes(token);
      setTrashList(data.resumes || []);
    } catch (err) {
      console.error("Fetch trash error:", err);
      toast.error("Could not fetch trash items");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (resumeId) => {
    try {
      setActionLoadingId(resumeId);
      await resumeApi.restoreDeletedResume(resumeId, token);
      toast.success("Resume restored to your vault! 🚀");
      setTrashList((prev) => prev.filter((r) => r._id !== resumeId));
      onRestoreSuccess?.();
    } catch (err) {
      console.error("Restore error:", err);
      toast.error("Failed to restore resume");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePermanentDelete = async (resumeId) => {
    if (!window.confirm("Are you sure? This resume will be permanently deleted and cannot be recovered.")) {
      return;
    }
    try {
      setActionLoadingId(resumeId);
      await resumeApi.deleteResume(resumeId, token, true);
      toast.success("Permanently deleted");
      setTrashList((prev) => prev.filter((r) => r._id !== resumeId));
    } catch (err) {
      console.error("Permanent delete error:", err);
      toast.error("Failed to delete resume");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm("Empty entire trash? All items will be permanently erased.")) {
      return;
    }
    try {
      setLoading(true);
      await resumeApi.emptyTrash(token);
      toast.success("Trash emptied successfully");
      setTrashList([]);
    } catch (err) {
      console.error("Empty trash error:", err);
      toast.error("Failed to empty trash");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-rose-50/40 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
              <Trash2 size={18} />
            </div>
            <div className="text-left">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Trash / Recycle Bin</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Restore accidentally deleted resumes or remove them permanently
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
              <p className="text-xs font-bold">Loading trash items...</p>
            </div>
          ) : trashList.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Trash2 size={22} />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Trash is completely empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Any deleted resumes will appear here and can be recovered anytime.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trashList.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#10192e] hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs transition-all"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title || "Untitled Resume"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.personal_info?.profession || item.template || "Classic"} • Deleted {new Date(item.deletedAt || item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleRestore(item._id)}
                      disabled={actionLoadingId === item._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw size={13} />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(item._id)}
                      disabled={actionLoadingId === item._id}
                      className="btn-3d-delete p-2 rounded-xl cursor-pointer"
                      title="Permanently Delete"
                    >
                      <Trash2 size={14} className="lucide-3d" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {trashList.length > 0 ? (
            <button
              onClick={handleEmptyTrash}
              className="btn-3d-delete-solid inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-white cursor-pointer"
            >
              <Trash2 size={13} className="lucide-3d" />
              <span>Empty Entire Trash ({trashList.length})</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">Recycle bin protection enabled</span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 dark:border dark:border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrashModal;

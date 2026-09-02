import React from "react";
import { FileText, ArrowRight, ExternalLink, Calendar, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCopilot } from "../../../hooks/useCopilot";
import FrogFace from "../../FrogLogo";

const FileListCard = ({ data = {} }) => {
  const navigate = useNavigate();
  const { sendMessage } = useCopilot();
  const { files = [], totalCount = 0 } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 text-xs animate-in fade-in duration-200">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold uppercase tracking-wider text-[10px]">
            <FileText size={13} className="text-emerald-600" />
            <span>My Resume Files ({files.length})</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/app/my-resumes")}
          className="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Vault View</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* FILES LIST */}
      {files.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-slate-500 font-medium">
          No resume files found in your account yet. You can ask me to build one!
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar">
          {files.map((file) => (
            <div
              key={file._id}
              className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-emerald-700 transition-colors">
                    {file.title || "Untitled Resume"}
                  </h4>
                  {file.profession && (
                    <span className="px-2 py-0.2 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold text-[10px] shrink-0">
                      {file.profession}
                    </span>
                  )}
                </div>

                {file.updatedAt && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 font-medium">
                    <Calendar size={10} />
                    <span>Updated {formatDate(file.updatedAt)}</span>
                  </div>
                )}
              </div>

              {/* ROW ACTIONS */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate(`/app/builder/${file._id}`)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-600 text-slate-700 hover:text-white border border-slate-200 hover:border-emerald-600 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                  title="Open in editor"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => sendMessage(`Delete my resume named "${file.title}"`)}
                  className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete resume"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 font-medium">
          Showing {files.length} of {totalCount || files.length} files
        </span>

        <button
          type="button"
          onClick={() => navigate("/app/my-resumes")}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-all cursor-pointer border border-emerald-500/30"
        >
          <span>Open My Resumes Vault</span>
          <ArrowRight size={12} className="text-emerald-400" />
        </button>
      </div>

    </div>
  );
};

export default FileListCard;

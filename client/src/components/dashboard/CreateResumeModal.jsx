import React, { useState } from "react";
import { X, Sparkles, Loader2, FilePenLine } from "lucide-react";
import FrogFace from "../FrogLogo";

const CreateResumeModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title.trim(), () => setTitle(""));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
          <FilePenLine size={24} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">Create New Resume</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          Give your resume a recognizable title to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Resume Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Developer - Google"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer border border-emerald-500/30"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-emerald-400" />
            ) : (
              <FrogFace size={18} />
            )}
            <span>{isLoading ? "Creating Resume..." : "Continue to Builder"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateResumeModal;

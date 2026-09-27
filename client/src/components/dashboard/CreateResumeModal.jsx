import React, { useState } from "react";
import { X, Sparkles, Loader2, FilePenLine, ArrowRight } from "lucide-react";
import FrogFace from "../FrogLogo";

const QUICK_ROLES = [
  "Senior Full Stack Engineer",
  "Product Manager",
  "Frontend Architect",
  "AI / ML Engineer",
  "DevOps & Cloud Engineer",
  "Data Analyst",
];

const CreateResumeModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title.trim(), () => setTitle(""));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
            <FilePenLine size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Create New Resume</h2>
            <p className="text-slate-500 text-xs">
              Give your resume a name or choose from standard roles below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Resume Title / Target Role *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer - Stripe"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium transition-all"
              autoFocus
              required
            />
          </div>

          {/* QUICK SUGGESTIONS */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTitle(role)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
                >
                  + {role}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="w-full mt-3 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-slate-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer border border-emerald-500/30"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-emerald-400" />
            ) : (
              <FrogFace size={18} />
            )}
            <span>{isLoading ? "Creating Resume..." : "Continue to Resume Builder"}</span>
            {!isLoading && <ArrowRight size={14} className="text-emerald-400" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateResumeModal;


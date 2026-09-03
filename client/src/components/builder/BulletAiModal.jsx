import React, { useState } from "react";
import { X, Check, Copy, Sparkles, ArrowRight, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { BrandIcon } from "../FrogLogo";
import toast from "react-hot-toast";

const BulletAiModal = ({
  isOpen,
  onClose,
  originalText,
  optimizedText,
  modeTitle,
  modeIcon: ModeIcon,
  onApply,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedText);
    setCopied(true);
    toast.success("Optimized bullet copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = () => {
    onApply(optimizedText);
    toast.success("Applied to resume!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BrandIcon size="xs" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white">
                  froggie AI Bullet Optimizer
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {modeTitle || "Optimized with high-impact metrics"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY (DIFF PREVIEW) */}
        <div className="p-5 sm:p-6 space-y-4 text-left">
          {/* ORIGINAL DRAFT */}
          {originalText && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Current Draft:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed line-through opacity-80">
                {originalText}
              </p>
            </div>
          )}

          {/* AI OPTIMIZED DRAFT */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300/80 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-emerald-600" />
                <span>froggie AI Version:</span>
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900">
                STAR Method Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed whitespace-pre-line">
              {optimizedText}
            </p>
          </div>

          {/* WHY THIS WORKS FOR RECRUITERS */}
          <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <TrendingUp size={14} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>ATS Impact: </strong> Replaced weak verbs with executive action keywords and quantifiable impact, lifting your parsing score.
            </span>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Discard
            </button>

            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Accept & Replace</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BulletAiModal;

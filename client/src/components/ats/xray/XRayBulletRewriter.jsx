import React, { useState } from "react";
import { Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const XRayBulletRewriter = ({ rewrites = [] }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!rewrites || rewrites.length === 0) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied optimized STAR bullet point!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-600" />
            <span>Smart STAR Bullet Rewrites</span>
          </span>
          <p className="text-[11px] text-slate-500">
            One-click copy high-impact STAR bullets with quantifiable metrics and action verbs.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {rewrites.length} Recommendations
        </span>
      </div>

      <div className="space-y-3">
        {rewrites.map((rw, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 transition-all hover:bg-slate-50 hover:border-emerald-300"
          >
            {/* ORIGINAL BULLET */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Draft Bullet:
              </span>
              <p className="text-xs text-slate-600 line-through opacity-75 leading-relaxed">
                "{rw.original}"
              </p>
            </div>

            {/* REWRITTEN BULLET */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <span>Executive STAR Version:</span>
                </span>

                <button
                  onClick={() => handleCopy(rw.rewritten, idx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-emerald-700 bg-white border border-emerald-200 shadow-2xs hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Bullet</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                "{rw.rewritten}"
              </p>

              {rw.rationale && (
                <p className="text-[11px] text-slate-500 italic">
                  💡 <strong>Why this wins:</strong> {rw.rationale}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default XRayBulletRewriter;

import React from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

const DashboardFeatureBanner = () => {
  return (
    <div className="rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid md:grid-cols-3 gap-6 sm:gap-8">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">AI Content Enhancement</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">
              Use built-in AI buttons to rewrite bullet points with strong action verbs and measurable achievements.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">ATS-Optimized Templates</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">
              6 professional layouts compliant with major ATS parsing standards (Greenhouse, Lever, Workday).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Instant Multi-Format Export</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">
              Export vector PDF or Word (.docx) documents with perfect pagination and layout fidelity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeatureBanner;

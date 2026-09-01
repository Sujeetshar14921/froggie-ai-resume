import React, { useEffect, useState } from "react";
import { Loader2, Sparkles, ShieldCheck, Tag, Code2, Briefcase } from "lucide-react";
import FrogFace from "../FrogLogo";

const STAGES = [
  { icon: Sparkles, text: "Extracting resume structure & contact points..." },
  { icon: Tag, text: "Scanning job description for essential keywords..." },
  { icon: Code2, text: "Matching technical competencies and skills..." },
  { icon: Briefcase, text: "Evaluating role relevance & experience tenure..." },
  { icon: ShieldCheck, text: "Calculating weighted ATS score & formatting checks..." },
];

const AtsLoadingState = () => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const CurrentStage = STAGES[stageIndex];
  const CurrentIcon = CurrentStage.icon;

  return (
    <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/90 shadow-sm text-center space-y-6 animate-in fade-in duration-300">
      <div className="relative size-20 mx-auto">
        <div className="absolute inset-0 rounded-3xl bg-emerald-100 animate-ping opacity-25" />
        <div className="relative size-20 rounded-3xl bg-slate-950 text-white flex items-center justify-center shadow-lg border border-emerald-500/30">
          <Loader2 size={36} className="animate-spin text-emerald-400" />
        </div>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-black text-slate-900">
          Auditing Resume Against ATS Parameters...
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          froggie AI is running a multi-pass semantic comparison of your resume and the target role.
        </p>
      </div>

      {/* DYNAMIC STAGE INDICATOR */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-900 transition-all duration-300">
        <CurrentIcon size={16} className="text-emerald-600 animate-pulse" />
        <span>{CurrentStage.text}</span>
      </div>
    </div>
  );
};

export default AtsLoadingState;

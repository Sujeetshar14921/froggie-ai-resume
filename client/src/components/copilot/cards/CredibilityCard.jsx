import React from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

const CredibilityCard = ({ data = {} }) => {
  const { weakClaims = [] } = data;

  return (
    <div className="rounded-2xl bg-white border border-amber-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      <div className="flex items-center gap-2">
        <ShieldAlert size={18} className="text-amber-600" />
        <div>
          <h4 className="font-extrabold text-sm text-slate-900">Resume Credibility Audit</h4>
          <span className="text-[10px] text-slate-400 font-medium">
            Weak claims & generic buzzword detector
          </span>
        </div>
      </div>

      {weakClaims.length === 0 ? (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>No ungrounded claims or exaggerated buzzwords detected in your resume!</span>
        </div>
      ) : (
        <div className="space-y-3">
          {weakClaims.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">"{item.claim}"</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{item.issue}</p>
                </div>
              </div>

              {item.saferAlternative && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-950 font-medium text-[11px] ml-5">
                  <strong>Safer Alternative: </strong> "{item.saferAlternative}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CredibilityCard;

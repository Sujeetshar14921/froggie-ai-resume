import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { useCopilot } from "../../../hooks/useCopilot";

const ConfirmationCard = ({ data = {} }) => {
  const { confirmAction } = useCopilot();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const {
    actionType = "delete_resume",
    targetTitle = "",
    message = "Are you sure you want to proceed with this destructive action? It cannot be undone.",
    confirmPayload = {},
  } = data;

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await confirmAction(actionType, confirmPayload);
      setIsDismissed(true);
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isDismissed) {
    return (
      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 font-semibold italic text-center">
        Action confirmed and processed.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-amber-50/70 border border-amber-300/80 shadow-md p-4 sm:p-5 space-y-3.5 text-xs animate-in fade-in duration-200">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
          <AlertTriangle size={17} />
        </div>
        <span>Confirmation Required</span>
      </div>

      {/* WARNING MESSAGE */}
      <div className="p-3 rounded-xl bg-white/90 border border-amber-200/60 text-slate-800 space-y-1">
        <p className="font-semibold leading-relaxed">{message}</p>
        {targetTitle && (
          <p className="text-[11px] font-bold text-amber-950">
            Target Item: <span className="underline decoration-amber-400">{targetTitle}</span>
          </p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="pt-2 border-t border-amber-200/60 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          disabled={isProcessing}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <X size={13} />
          <span>Cancel</span>
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isProcessing}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          {isProcessing ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 size={13} />
              <span>Yes, Confirm Delete</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default ConfirmationCard;

import React from "react";
import { UploadCloud } from "lucide-react";

const StudioDropzone = ({ onBrowse, onFileDrop }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div
        onClick={onBrowse}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) onFileDrop(e.dataTransfer.files[0]);
        }}
        className="w-full max-w-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-colors hover:bg-emerald-50/20 dark:hover:bg-emerald-950/15 group space-y-4 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto transition-colors">
          <UploadCloud size={28} />
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            Drop your image or document here, or{" "}
            <span className="text-emerald-600 dark:text-emerald-400 underline">browse</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Supports <strong>PNG, JPG, WEBP, PDF, DOCX, TXT</strong> up to 50MB. Instant on-device processing.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            🎯 Exact Target Size
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            📐 Custom Dimensions & Crop
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            🪄 AI Background Removal
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            🔄 PDF ↔ Word
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudioDropzone;

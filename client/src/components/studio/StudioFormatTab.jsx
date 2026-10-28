import React from "react";

const StudioFormatTab = ({ fileMeta, targetFormat, setTargetFormat }) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Target File Extension
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {(fileMeta?.isImage
            ? ["jpg", "png", "webp", "pdf", "svg"]
            : fileMeta?.isPdf
            ? ["docx", "pdf", "jpg", "png", "txt"]
            : ["pdf", "docx", "txt"]
          ).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setTargetFormat(fmt)}
              className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                targetFormat === fmt
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              .{fmt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudioFormatTab;

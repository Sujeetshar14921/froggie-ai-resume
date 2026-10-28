import React from "react";
import { Eye, X } from "lucide-react";

const StudioFullscreenModal = ({
  isFullscreen,
  setIsFullscreen,
  fileMeta,
  showOriginalComparison,
  setShowOriginalComparison,
  previewUrl,
  processedUrl,
}) => {
  if (!isFullscreen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={() => setIsFullscreen(false)}
    >
      {/* Modal Top Bar */}
      <div
        className="flex items-center justify-between z-10 max-w-6xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-black text-white text-sm sm:text-base truncate max-w-xs sm:max-w-md">
            {fileMeta?.name}
          </span>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
            {fileMeta?.width} × {fileMeta?.height} px
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOriginalComparison((v) => !v)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              showOriginalComparison
                ? "bg-amber-500 text-white border-amber-600"
                : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Eye size={14} className="inline mr-1.5" />
            {showOriginalComparison ? "Original" : "Result"}
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="p-2 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Close Full View (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Center Image in Natural Full Resolution */}
      <div
        className="flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={showOriginalComparison ? previewUrl : processedUrl || previewUrl}
          alt="Full View"
          className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700/80 transition-transform"
        />
      </div>

      {/* Modal Footer Info */}
      <div
        className="text-center text-xs text-slate-400 z-10 py-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span>Displaying in full resolution • Click outside or press Esc to close</span>
      </div>
    </div>
  );
};

export default StudioFullscreenModal;

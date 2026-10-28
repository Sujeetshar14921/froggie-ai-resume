import React from "react";
import {
  SlidersHorizontal,
  Eye,
  Maximize2,
  Move,
  FileText,
  Square,
  Circle,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
} from "lucide-react";
import toast from "react-hot-toast";

const StudioCanvas = ({
  fileMeta,
  customWidth,
  customHeight,
  isPanelOpen,
  setIsPanelOpen,
  showOriginalComparison,
  setShowOriginalComparison,
  setIsFullscreen,
  setFile,
  setPreviewUrl,
  setProcessedUrl,
  imagePreviewBoxRef,
  isCropActive,
  setIsCropActive,
  previewUrl,
  processedUrl,
  isRemovingBgCloud,
  cropBox,
  cropShape,
  setCropShape,
  cornerRadius,
  setCornerRadius,
  isDraggingCrop,
  handleCropMouseDown,
  sourceImageRef,
  setFreeAngle,
  freeAngle,
  flipH,
  setFlipH,
  flipV,
  setFlipV,
  handleMaximizeCropBox,
  handleCenterCropBox,
  handleApplyAspectPreset,
  formatBytes,
  outputBytes,
}) => {
  return (
    <div className="flex-1 min-w-0 w-full flex flex-col bg-slate-900/5 dark:bg-black/30 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all duration-300">
      {/* PREVIEW SUB-HEADER */}
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">
            {fileMeta?.name}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
            {fileMeta?.isImage
              ? `${customWidth || fileMeta?.width}×${customHeight || fileMeta?.height} px`
              : fileMeta?.isPdf
              ? "PDF Document"
              : "Word Document"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isPanelOpen && (
            <button
              type="button"
              onClick={() => setIsPanelOpen(true)}
              className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer flex items-center gap-1"
              title="Open Control Panel"
            >
              <SlidersHorizontal size={12} />
              <span>Tools</span>
            </button>
          )}

          {fileMeta?.isImage && (
            <>
              <button
                type="button"
                onClick={() => setShowOriginalComparison((v) => !v)}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                  showOriginalComparison
                    ? "bg-amber-500 text-white border-amber-600"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
                title="Toggle Original vs Processed"
              >
                <Eye size={12} className="inline mr-1" />
                {showOriginalComparison ? "Original" : "Result"}
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
                title="View 100% Full Resolution"
              >
                <Maximize2 size={12} className="inline mr-1" />
                <span>Full View</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPreviewUrl(null);
              setProcessedUrl(null);
            }}
            className="text-[11px] font-bold text-slate-500 hover:text-rose-500 px-2 py-0.5 transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      {/* FULL-SIZE PHOTO PREVIEW CANVAS */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] max-h-[420px] flex items-center justify-center p-3 sm:p-5 overflow-hidden select-none">
        {/* Transparency checkerboard background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#64748b 1px, transparent 1px), radial-gradient(#64748b 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 8px 8px",
          }}
        />

        {fileMeta?.isImage ? (
          <div
            ref={imagePreviewBoxRef}
            className="relative flex items-center justify-center select-none"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              touchAction: "none",
            }}
          >
            <img
              src={
                isCropActive
                  ? previewUrl
                  : showOriginalComparison
                  ? previewUrl
                  : processedUrl || previewUrl
              }
              alt="Studio Output"
              className={`block rounded-none transition-all duration-200 relative z-10 ${
                isRemovingBgCloud ? "brightness-90 contrast-105 scale-[0.98]" : ""
              }`}
              style={{
                maxHeight: "360px",
                maxWidth: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />

            {/* AI BACKGROUND REMOVAL REAL-TIME SCANNING ANIMATION OVERLAY */}
            {isRemovingBgCloud && (
              <div className="absolute inset-0 z-20 rounded-lg overflow-hidden pointer-events-none flex flex-col justify-between">
                {/* 1. Holographic Matrix Grid & Vignette Glow */}
                <div
                  className="absolute inset-0 bg-emerald-950/25 backdrop-blur-[1.5px] animate-ai-glow"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(16, 185, 129, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.16) 1px, transparent 1px)",
                    backgroundSize: "26px 26px",
                  }}
                />

                {/* 2. Sweeping Laser Beam with Trailing Glow */}
                <div className="absolute left-0 right-0 animate-ai-laser z-30 pointer-events-none">
                  <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_20px_4px_rgba(52,211,153,0.95)]" />
                  <div className="h-16 w-full bg-gradient-to-b from-emerald-400/25 via-emerald-400/5 to-transparent blur-[2px]" />
                </div>

                {/* 3. Corner Vision Reticle Brackets */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400/90 rounded-tl-md shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400/90 rounded-tr-md shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400/90 rounded-bl-md shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400/90 rounded-br-md shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </div>
            )}

            {/* ADVANCED INTERACTIVE CROP BOX OVERLAY */}
            {isCropActive && !isRemovingBgCloud && (
              <div className="absolute inset-0 z-30 pointer-events-auto">
                {/* 4 Dimmed Backdrop Regions Outside Crop Box */}
                <div
                  className="absolute top-0 left-0 right-0 bg-black/60 pointer-events-none"
                  style={{ height: `${cropBox.y}%` }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black/60 pointer-events-none"
                  style={{
                    height: `${Math.max(0, 100 - (cropBox.y + cropBox.height))}%`,
                  }}
                />
                <div
                  className="absolute bg-black/60 pointer-events-none"
                  style={{
                    top: `${cropBox.y}%`,
                    height: `${cropBox.height}%`,
                    left: 0,
                    width: `${cropBox.x}%`,
                  }}
                />
                <div
                  className="absolute bg-black/60 pointer-events-none"
                  style={{
                    top: `${cropBox.y}%`,
                    height: `${cropBox.height}%`,
                    right: 0,
                    width: `${Math.max(0, 100 - (cropBox.x + cropBox.width))}%`,
                  }}
                />

                {/* The Resizable / Movable Crop Box */}
                <div
                  className={`absolute border-2 transition-shadow cursor-move select-none ${
                    isDraggingCrop
                      ? "border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.85)]"
                      : "border-emerald-400/95 shadow-[0_0_15px_rgba(0,0,0,0.6)]"
                  }`}
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.width}%`,
                    height: `${cropBox.height}%`,
                    borderRadius:
                      cropShape === "circle"
                        ? "9999px"
                        : cropShape === "rounded"
                        ? `${cornerRadius}px`
                        : "0px",
                  }}
                  onMouseDown={(e) => handleCropMouseDown(e, "move")}
                  onTouchStart={(e) => handleCropMouseDown(e, "move")}
                >
                  {/* Rule of Thirds Grid Lines (3x3 grid) */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-60">
                    <div className="border-r border-b border-emerald-400/40" />
                    <div className="border-r border-b border-emerald-400/40" />
                    <div className="border-b border-emerald-400/40" />
                    <div className="border-r border-b border-emerald-400/40" />
                    <div className="border-r border-b border-emerald-400/40" />
                    <div className="border-b border-emerald-400/40" />
                    <div className="border-r border-b border-emerald-400/40" />
                    <div className="border-r border-b border-emerald-400/40" />
                    <div />
                  </div>

                  {cropShape === "circle" && (
                    <div className="absolute inset-0 rounded-full border border-dashed border-white/80 pointer-events-none" />
                  )}

                  {/* Live Dimension & Aspect Ratio Tag */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/95 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/40 whitespace-nowrap shadow-lg pointer-events-none flex items-center gap-1">
                    <Move size={10} className="text-emerald-400" />
                    <span>
                      {sourceImageRef.current
                        ? `${Math.round(
                            (cropBox.width / 100) * sourceImageRef.current.naturalWidth
                          )} × ${Math.round(
                            (cropBox.height / 100) * sourceImageRef.current.naturalHeight
                          )} px`
                        : `${cropBox.width}% × ${cropBox.height}%`}
                    </span>
                  </div>

                  {/* 8 Resizing Handles */}
                  <div
                    onMouseDown={(e) => handleCropMouseDown(e, "nw")}
                    onTouchStart={(e) => handleCropMouseDown(e, "nw")}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 cursor-nwse-resize"
                    title="Resize Top-Left"
                  />
                  <div
                    onMouseDown={(e) => handleCropMouseDown(e, "ne")}
                    onTouchStart={(e) => handleCropMouseDown(e, "ne")}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 cursor-nesw-resize"
                    title="Resize Top-Right"
                  />
                  <div
                    onMouseDown={(e) => handleCropMouseDown(e, "sw")}
                    onTouchStart={(e) => handleCropMouseDown(e, "sw")}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 cursor-nesw-resize"
                    title="Resize Bottom-Left"
                  />
                  <div
                    onMouseDown={(e) => handleCropMouseDown(e, "se")}
                    onTouchStart={(e) => handleCropMouseDown(e, "se")}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 cursor-nwse-resize"
                    title="Resize Bottom-Right"
                  />
                  <div
                    onMouseDown={(e) => handleCropMouseDown(e, "n")}
                    onTouchStart={(e) => handleCropMouseDown(e, "n")}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white border-2 border-emerald-500 cursor-ns-resize"
                    title="Resize Top"
                  />
                  <div
                    onMouseDown={(e) => handleCropMouseDown(e, "s")}
                    onTouchStart={(e) => handleCropMouseDown(e, "s")}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white border-2 border-emerald-500 cursor-ns-resize"
                    title="Resize Bottom"
                  />
                  <div
                    onMouseDown={(e) => handleCropMouseDown(e, "w")}
                    onTouchStart={(e) => handleCropMouseDown(e, "w")}
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-5 rounded-full bg-white border-2 border-emerald-500 cursor-ew-resize"
                    title="Resize Left"
                  />
                  <div
                    onMouseDown={(e) => handleCropMouseDown(e, "e")}
                    onTouchStart={(e) => handleCropMouseDown(e, "e")}
                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-5 rounded-full bg-white border-2 border-emerald-500 cursor-ew-resize"
                    title="Resize Right"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative z-10 text-center space-y-3 p-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center mx-auto">
              <FileText size={32} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                {fileMeta?.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {fileMeta?.isPdf ? "Standard PDF Document" : "Word .docx Document"}
              </p>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              Ready for Conversion & Compression
            </span>
          </div>
        )}
      </div>

      {/* DEDICATED IMAGE BOTTOM ACTION STRIP */}
      {fileMeta?.isImage && (
        <>
          <div className="px-3.5 py-2 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-between gap-2.5 flex-wrap">
            {/* 1. SHAPE & MASKING */}
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setCropShape("rect");
                  toast.success("Rectangle Shape");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  cropShape === "rect"
                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-600"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Rectangle Mask"
              >
                <Square size={13} />
                <span>Rectangle</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCropShape("rounded");
                  if (cornerRadius === 0) setCornerRadius(24);
                  toast.success("Rounded Corners Mask");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  cropShape === "rounded"
                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-600"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Rounded Corners Mask"
              >
                <Square size={13} className="rounded-sm" />
                <span>Rounded</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCropShape("circle");
                  toast.success("Circle / Avatar Mask");
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  cropShape === "circle"
                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-600"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Circle Avatar Mask"
              >
                <Circle size={13} />
                <span>Circle</span>
              </button>
            </div>

            {/* 2. ROTATION & FLIP ARROWS */}
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() =>
                  setFreeAngle((a) => (a - 90 < -180 ? a - 90 + 360 : a - 90))
                }
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Rotate Left (-90°)"
              >
                <RotateCcw size={14} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setFreeAngle((a) => (a + 90 > 180 ? a + 90 - 360 : a + 90))
                }
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Rotate Right (+90°)"
              >
                <RotateCw size={14} />
              </button>

              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

              <button
                type="button"
                onClick={() => setFlipH((v) => !v)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  flipH
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                }`}
                title="Flip Horizontally"
              >
                <FlipHorizontal size={14} />
              </button>

              <button
                type="button"
                onClick={() => setFlipV((v) => !v)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  flipV
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                }`}
                title="Flip Vertically"
              >
                <FlipVertical size={14} />
              </button>

              {freeAngle !== 0 && (
                <button
                  type="button"
                  onClick={() => setFreeAngle(0)}
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                  title="Reset Rotation to 0°"
                >
                  {freeAngle}° ×
                </button>
              )}
            </div>

            {/* 3. MOUSE POINTER CROP BOX TOGGLE & QUICK ACTIONS */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsCropActive((v) => !v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isCropActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                }`}
                title={isCropActive ? "Finish Cropping" : "Interactive Mouse Crop Box"}
              >
                <Crop size={14} />
                <span>{isCropActive ? "Done Crop" : "Crop Box"}</span>
              </button>

              {isCropActive && (
                <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={handleMaximizeCropBox}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer"
                    title="Full 100% Unclipped Image"
                  >
                    Full
                  </button>
                  <button
                    type="button"
                    onClick={handleCenterCropBox}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer"
                    title="Center Crop Box"
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyAspectPreset("1:1")}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer"
                    title="1:1 Square Ratio"
                  >
                    1:1
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CORNER RADIUS SLIDER */}
          {cropShape === "rounded" && (
            <div className="px-3.5 py-1.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex items-center gap-3 text-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Corner Radius:
              </span>
              <input
                type="range"
                min="4"
                max="120"
                value={cornerRadius}
                onChange={(e) => setCornerRadius(Number(e.target.value))}
                className="flex-1 max-w-xs accent-emerald-600 cursor-pointer"
              />
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                {cornerRadius}px
              </span>
            </div>
          )}
        </>
      )}

      {/* COMPACT METRICS STRIP */}
      <div className="px-3.5 py-1.5 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium text-[11px]">Original:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
            {formatBytes(fileMeta?.sizeBytes || 0)}
          </span>
          <span className="text-slate-400">➔</span>
          <span className="text-slate-400 font-medium text-[11px]">Optimized:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
            {formatBytes(outputBytes || fileMeta?.sizeBytes || 0)}
          </span>
          {fileMeta?.sizeBytes > outputBytes && outputBytes > 0 && (
            <span className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold">
              -{Math.round((1 - outputBytes / fileMeta.sizeBytes) * 100)}%
            </span>
          )}
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          {customWidth || fileMeta?.width} × {customHeight || fileMeta?.height} px
        </span>
      </div>
    </div>
  );
};

export default StudioCanvas;

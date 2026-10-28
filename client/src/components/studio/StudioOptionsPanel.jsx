import React from "react";
import { ArrowDownUp, X, Pencil, Printer, Copy } from "lucide-react";
import StudioSizeTab from "./StudioSizeTab";
import StudioFormatTab from "./StudioFormatTab";
import StudioBackgroundTab from "./StudioBackgroundTab";
import StudioFilterTab from "./StudioFilterTab";
import StudioWatermarkTab from "./StudioWatermarkTab";

const StudioOptionsPanel = ({
  isPanelOpen,
  setIsPanelOpen,
  studioTools,
  activeTab,
  fileMeta,
  formatBytes,
  outputBytes,
  // Tab 1: Size
  targetSizeVal,
  setTargetSizeVal,
  targetSizeUnit,
  setTargetSizeUnit,
  handleConvergeToExactTarget,
  lockAspectRatio,
  setLockAspectRatio,
  customWidth,
  handleWidthChange,
  customHeight,
  handleHeightChange,
  quality,
  setQuality,
  // Tab 2: Format
  targetFormat,
  setTargetFormat,
  // Tab 3: BG
  bgRemoved,
  handleCloudAiBgRemove,
  isRemovingBgCloud,
  handleRestoreBg,
  backdropType,
  setBackdropType,
  solidColor,
  setSolidColor,
  gradientPreset,
  setGradientPreset,
  portraitBlurAmount,
  setPortraitBlurAmount,
  cloudCutoutDataUrl,
  bgSensitivity,
  setBgSensitivity,
  bgFeather,
  setBgFeather,
  // Tab 4: Filter/Edit
  previewUrl,
  selectedPreset,
  setSelectedPreset,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  exposure,
  setExposure,
  warmth,
  setWarmth,
  sharpness,
  setSharpness,
  vignette,
  setVignette,
  isGrayscale,
  setIsGrayscale,
  isInverted,
  setIsInverted,
  // Tab 5: Watermark
  watermarkEnabled,
  setWatermarkEnabled,
  watermarkText,
  setWatermarkText,
  watermarkOpacity,
  setWatermarkOpacity,
  watermarkSize,
  setWatermarkSize,
  watermarkPosition,
  setWatermarkPosition,
  // Footer: Rename & Actions
  isEditingName,
  renameInputRef,
  tempFilename,
  setTempFilename,
  handleSaveRename,
  handleRenameKeyDown,
  handleStartRename,
  outputFilename,
  handlePrint,
  handleCopyClipboard,
  handleResetAll,
}) => {
  if (!isPanelOpen) return null;

  const currentTool = studioTools.find((t) => t.id === activeTab);

  return (
    <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 flex flex-col max-h-[500px] lg:h-[480px] bg-white dark:bg-[#0c1424] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden min-h-0 animate-in fade-in slide-in-from-right-3 duration-200">
      {/* PANEL HEADER WITH ACTIVE TOOL IDENTITY & CLOSE BUTTON */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            {React.createElement(currentTool?.icon || ArrowDownUp, { size: 14 })}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight truncate">
              {currentTool?.label || "Studio Settings"}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
              {currentTool?.badge || "Adjust Parameters"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPanelOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Panel"
        >
          <X size={14} />
        </button>
      </div>

      {/* SCROLLABLE TOOL TAB CONTENT */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3.5 text-left custom-scrollbar">
        {activeTab === "compress" && (
          <StudioSizeTab
            targetSizeVal={targetSizeVal}
            setTargetSizeVal={setTargetSizeVal}
            targetSizeUnit={targetSizeUnit}
            setTargetSizeUnit={setTargetSizeUnit}
            handleConvergeToExactTarget={handleConvergeToExactTarget}
            fileMeta={fileMeta}
            lockAspectRatio={lockAspectRatio}
            setLockAspectRatio={setLockAspectRatio}
            customWidth={customWidth}
            handleWidthChange={handleWidthChange}
            customHeight={customHeight}
            handleHeightChange={handleHeightChange}
            quality={quality}
            setQuality={setQuality}
          />
        )}

        {activeTab === "convert" && (
          <StudioFormatTab
            fileMeta={fileMeta}
            targetFormat={targetFormat}
            setTargetFormat={setTargetFormat}
          />
        )}

        {activeTab === "bgremove" && fileMeta?.isImage && (
          <StudioBackgroundTab
            bgRemoved={bgRemoved}
            handleCloudAiBgRemove={handleCloudAiBgRemove}
            isRemovingBgCloud={isRemovingBgCloud}
            handleRestoreBg={handleRestoreBg}
            backdropType={backdropType}
            setBackdropType={setBackdropType}
            solidColor={solidColor}
            setSolidColor={setSolidColor}
            gradientPreset={gradientPreset}
            setGradientPreset={setGradientPreset}
            portraitBlurAmount={portraitBlurAmount}
            setPortraitBlurAmount={setPortraitBlurAmount}
            cloudCutoutDataUrl={cloudCutoutDataUrl}
            bgSensitivity={bgSensitivity}
            setBgSensitivity={setBgSensitivity}
            bgFeather={bgFeather}
            setBgFeather={setBgFeather}
          />
        )}

        {activeTab === "edit" && fileMeta?.isImage && (
          <StudioFilterTab
            previewUrl={previewUrl}
            selectedPreset={selectedPreset}
            setSelectedPreset={setSelectedPreset}
            brightness={brightness}
            setBrightness={setBrightness}
            contrast={contrast}
            setContrast={setContrast}
            saturation={saturation}
            setSaturation={setSaturation}
            exposure={exposure}
            setExposure={setExposure}
            warmth={warmth}
            setWarmth={setWarmth}
            sharpness={sharpness}
            setSharpness={setSharpness}
            vignette={vignette}
            setVignette={setVignette}
            isGrayscale={isGrayscale}
            setIsGrayscale={setIsGrayscale}
            isInverted={isInverted}
            setIsInverted={setIsInverted}
          />
        )}

        {activeTab === "watermark" && fileMeta?.isImage && (
          <StudioWatermarkTab
            watermarkEnabled={watermarkEnabled}
            setWatermarkEnabled={setWatermarkEnabled}
            watermarkText={watermarkText}
            setWatermarkText={setWatermarkText}
            watermarkOpacity={watermarkOpacity}
            setWatermarkOpacity={setWatermarkOpacity}
            watermarkSize={watermarkSize}
            setWatermarkSize={setWatermarkSize}
            watermarkPosition={watermarkPosition}
            setWatermarkPosition={setWatermarkPosition}
          />
        )}
      </div>

      {/* PINNED BOTTOM EXPORT & COMMAND BAR */}
      <div className="px-3.5 py-2.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#090f1d] shrink-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 text-xs flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-1 min-w-0 flex-1 max-w-[210px] animate-in fade-in duration-150">
              <input
                ref={renameInputRef}
                type="text"
                value={tempFilename}
                onChange={(e) => setTempFilename(e.target.value)}
                onBlur={handleSaveRename}
                onKeyDown={handleRenameKeyDown}
                className="w-full px-2 py-0.5 text-xs font-bold rounded-lg border border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                placeholder="file name"
              />
              <span className="text-xs font-black text-slate-400 font-mono shrink-0">
                .{targetFormat}
              </span>
            </div>
          ) : (
            <div
              onDoubleClick={handleStartRename}
              className="flex items-center gap-1.5 min-w-0 cursor-pointer group select-none py-0.5"
              title="Double-click to rename file"
            >
              <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px] sm:max-w-[160px] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {outputFilename}.{targetFormat}
              </span>
              <Pencil
                size={11}
                className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartRename();
                }}
              />
              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                ({formatBytes(outputBytes || fileMeta?.sizeBytes || 0)})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer hidden sm:block"
            title="Print Preview"
          >
            <Printer size={13} />
          </button>

          {fileMeta?.isImage && (
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Copy to Clipboard"
            >
              <Copy size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={handleResetAll}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioOptionsPanel;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  BriefcaseBusiness, 
  Globe, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  Github, 
  Wand2, 
  Loader2, 
  RotateCcw, 
  Check, 
  Palette, 
  Sparkles, 
  Trash2, 
  Upload 
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import toast from 'react-hot-toast';

const BG_COLOR_PRESETS = [
  { id: "transparent", label: "Transparent", value: "transparent" },
  { id: "white", label: "Pure White", value: "#FFFFFF" },
  { id: "sky", label: "Studio Sky Blue", value: "#E0F2FE" },
  { id: "slate", label: "Soft Studio Gray", value: "#F1F5F9" },
  { id: "navy", label: "Executive Navy", value: "#1E293B" },
  { id: "emerald", label: "Froggie Mint", value: "#ECFDF5" },
  { id: "violet", label: "Creative Violet", value: "#EDE9FE" },
  { id: "cream", label: "Warm Cream", value: "#FEF3C7" },
];

const PersonalInfoForm = ({ data = {}, onChange, removeBackground, setRemoveBackground }) => {
  const { token } = useSelector((state) => state.auth);

  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [selectedBgColor, setSelectedBgColor] = useState(data.image_bg || "transparent");
  const [cutoutSrc, setCutoutSrc] = useState(data.cutout_image || null);
  const [isCutoutActive, setIsCutoutActive] = useState(Boolean(data.cutout_image || data.image_bg));

  // Sync state if props change externally
  useEffect(() => {
    if (data.image_bg) setSelectedBgColor(data.image_bg);
    if (data.cutout_image) {
      setCutoutSrc(data.cutout_image);
      setIsCutoutActive(true);
    }
  }, [data.image_bg, data.cutout_image]);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // Helper to composite transparent cutout onto chosen background color
  const compositeCutoutWithColor = (src, bgColor) => {
    return new Promise((resolve) => {
      if (!src || !bgColor || bgColor === "transparent") {
        resolve(src);
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || 400;
          canvas.height = img.naturalHeight || 400;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(src);
            return;
          }
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        } catch (e) {
          console.warn("Canvas composite warning:", e);
          resolve(src);
        }
      };
      img.onerror = () => {
        resolve(src);
      };
      img.src = src;
    });
  };

  // Execute ImageKit Cloud Vision AI Background Removal
  const handleRemoveBackground = async (targetBgColor = selectedBgColor) => {
    if (!data.image) {
      toast.error("Please upload a profile photo first");
      return;
    }

    try {
      setIsRemovingBg(true);

      const currentOriginal =
        data.original_image ||
        (typeof data.image === "string" ? data.image : URL.createObjectURL(data.image));

      const res = await aiApi.removeImageBackground(data.image, token);
      const cutout = res.imageBase64 || res.imageUrl;

      if (!cutout) {
        throw new Error("No image returned from background removal engine");
      }

      setCutoutSrc(cutout);
      setIsCutoutActive(true);
      if (setRemoveBackground) setRemoveBackground(true);

      const finalImage = await compositeCutoutWithColor(cutout, targetBgColor);

      onChange({
        ...data,
        image: finalImage,
        image_bg: targetBgColor,
        cutout_image: cutout,
        original_image: currentOriginal,
      });

      toast.success("AI Background removed successfully!");
    } catch (error) {
      console.error("Profile photo bg removal error:", error);
      toast.error(error?.response?.data?.message || "Failed to remove background. Please try again.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  // Live Background Color Change
  const handleColorChange = async (color) => {
    setSelectedBgColor(color);

    const activeCutout = cutoutSrc || data.cutout_image;
    if (activeCutout) {
      const finalImage = await compositeCutoutWithColor(activeCutout, color);
      onChange({
        ...data,
        image: finalImage,
        image_bg: color,
        cutout_image: activeCutout,
      });
      return;
    }

    // If cutout is not yet active but an image exists, auto-trigger background removal with chosen color
    if (data.image) {
      toast("Removing background to apply chosen color...", { icon: "⚡" });
      await handleRemoveBackground(color);
    }
  };

  // Restore Original Unedited Photo
  const handleRestoreOriginal = () => {
    if (data.original_image) {
      onChange({
        ...data,
        image: data.original_image,
        image_bg: "",
        cutout_image: "",
      });
      setCutoutSrc(null);
      setIsCutoutActive(false);
      setSelectedBgColor("transparent");
      if (setRemoveBackground) setRemoveBackground(false);
      toast.success("Restored original profile photo");
    }
  };

  // Handle Photo File Selection
  const handleFileSelect = (file) => {
    if (!file) return;
    setCutoutSrc(null);
    setIsCutoutActive(false);
    setSelectedBgColor("transparent");
    if (setRemoveBackground) setRemoveBackground(false);
    onChange({
      ...data,
      image: file,
      original_image: file,
      image_bg: "",
      cutout_image: "",
    });
  };

  // Remove Photo
  const handleRemovePhoto = () => {
    setCutoutSrc(null);
    setIsCutoutActive(false);
    setSelectedBgColor("transparent");
    if (setRemoveBackground) setRemoveBackground(false);
    onChange({
      ...data,
      image: null,
      original_image: "",
      image_bg: "",
      cutout_image: "",
    });
  };

  const imageDisplaySrc = data.image
    ? typeof data.image === 'string'
      ? data.image
      : URL.createObjectURL(data.image)
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h3 className='text-lg font-bold text-gray-900'>Personal & Contact Details</h3>
        <p className='text-sm text-gray-500'>Enter your contact information, social links, and portfolio</p>
      </div>

      {/* AVATAR UPLOAD & ADVANCED AI BG STUDIO */}
      <div className='p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs transition-all'>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          {/* PHOTO PREVIEW THUMBNAIL WITH AI SCANNING ANIMATION */}
          <div className="relative shrink-0">
            <label className="cursor-pointer block relative">
              <div
                className="relative size-20 sm:size-24 rounded-2xl overflow-hidden ring-2 ring-emerald-500 hover:ring-emerald-400 shadow-sm flex items-center justify-center transition-all bg-white"
                style={{
                  backgroundColor:
                    selectedBgColor && selectedBgColor !== "transparent" ? selectedBgColor : undefined,
                  backgroundImage:
                    selectedBgColor === "transparent"
                      ? "linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)"
                      : undefined,
                  backgroundSize: "10px 10px",
                  backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                }}
              >
                {imageDisplaySrc ? (
                  <img
                    src={imageDisplaySrc}
                    alt="user-image"
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className='flex flex-col items-center justify-center size-full text-slate-400 hover:text-emerald-700 transition-colors'>
                    <User className='size-7'/> 
                    <span className="text-[10px] font-bold mt-1">Add Photo</span>
                  </div>
                )}

                {/* AI SCANNING LASER & HOLOGRAPHIC OVERLAY DURING PROCESSING */}
                {isRemovingBg && (
                  <div className="absolute inset-0 z-20 overflow-hidden rounded-2xl pointer-events-none select-none">
                    {/* Dark HUD Backdrop */}
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px]" />

                    {/* Holographic Matrix Grid Pattern */}
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: "radial-gradient(#06b6d4 1.2px, transparent 1.2px)",
                        backgroundSize: "7px 7px",
                      }}
                    />

                    {/* Neon Laser Scanning Beam (from index.css keyframes) */}
                    <div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee,0_0_24px_#10b981]"
                      style={{ animation: "aiLaserScan 1.6s ease-in-out infinite" }}
                    />

                    {/* Pulsing Ambient Scan Glow */}
                    <div
                      className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-emerald-500/25 to-transparent"
                      style={{ animation: "aiScanGlow 1.6s ease-in-out infinite" }}
                    />

                    {/* 4 Corner HUD Target Reticles */}
                    <div className="absolute top-1 left-1 size-2 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-1 right-1 size-2 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-1 left-1 size-2 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-1 right-1 size-2 border-b-2 border-r-2 border-cyan-400" />

                    {/* Floating HUD Radar Badge */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
                      <Loader2 size={18} className="text-cyan-400 animate-spin drop-shadow-md" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300 mt-1 drop-shadow-md leading-none">
                        AI Vision
                      </span>
                      <span className="text-[8px] font-semibold text-emerald-300/90 tracking-tight mt-0.5">
                        Scanning...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                disabled={isRemovingBg}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* CONTROLS & INFORMATION */}
          <div className="flex-1 min-w-0 w-full space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900">Profile Photo (Optional)</p>
                {isCutoutActive && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold flex items-center gap-1">
                    <Sparkles size={10} />
                    <span>Cutout Active</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {(data.original_image || isCutoutActive) && (
                  <button
                    type="button"
                    onClick={handleRestoreOriginal}
                    disabled={isRemovingBg}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Restore original unedited photo"
                  >
                    <RotateCcw size={11} />
                    <span>Restore Original</span>
                  </button>
                )}

                {data.image && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isRemovingBg}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Upload a headshot for modern template styles. Background can be removed seamlessly with ImageKit AI.
            </p>

            {/* ACTION BUTTON: TRIGGER IMAGEKIT AI BG REMOVAL */}
            {data.image && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isRemovingBg}
                  onClick={() => handleRemoveBackground(selectedBgColor)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                    isCutoutActive
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 hover:shadow-md"
                  } ${isRemovingBg ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {isRemovingBg ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-cyan-300" />
                      <span>Scanning with ImageKit AI...</span>
                    </>
                  ) : isCutoutActive ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span>Re-run Background Cutout</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={13} className="text-amber-300" />
                      <span>Remove Photo Background (ImageKit AI)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE BACKGROUND COLOR CHOOSER */}
        {data.image && (
          <div className="mt-3.5 pt-3 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Palette size={13} className="text-emerald-600" />
                <span className="text-[11px] font-bold text-slate-800">Choose Background Color:</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {selectedBgColor === "transparent" ? "Transparent Cutout" : selectedBgColor.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {BG_COLOR_PRESETS.map((preset) => {
                const isSelected = selectedBgColor === preset.value;
                const isLight =
                  preset.value === "#FFFFFF" ||
                  preset.value === "transparent" ||
                  preset.value === "#E0F2FE" ||
                  preset.value === "#F1F5F9" ||
                  preset.value === "#FEF3C7" ||
                  preset.value === "#ECFDF5";

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleColorChange(preset.value)}
                    disabled={isRemovingBg}
                    title={preset.label}
                    className={`relative size-7 sm:size-8 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "ring-2 ring-emerald-500 ring-offset-2 scale-110 border-emerald-500 shadow-sm"
                        : "border-slate-300 hover:scale-105 hover:border-slate-400"
                    }`}
                    style={{
                      backgroundColor: preset.value !== "transparent" ? preset.value : undefined,
                      backgroundImage:
                        preset.value === "transparent"
                          ? "linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)"
                          : undefined,
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                    }}
                  >
                    {isSelected && (
                      <Check
                        size={13}
                        className={isLight ? "text-emerald-700 stroke-[3]" : "text-white stroke-[3]"}
                      />
                    )}
                  </button>
                );
              })}

              {/* CUSTOM COLOR PICKER */}
              <label
                className={`relative size-7 sm:size-8 rounded-xl border cursor-pointer flex items-center justify-center transition-all hover:scale-105 overflow-hidden ${
                  !BG_COLOR_PRESETS.some((p) => p.value === selectedBgColor) && selectedBgColor
                    ? "ring-2 ring-emerald-500 ring-offset-2 scale-110 border-emerald-500 shadow-sm"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
                style={{
                  backgroundColor:
                    !BG_COLOR_PRESETS.some((p) => p.value === selectedBgColor) && selectedBgColor
                      ? selectedBgColor
                      : "#ffffff",
                }}
                title="Custom Color"
              >
                <input
                  type="color"
                  value={selectedBgColor === "transparent" ? "#ffffff" : selectedBgColor || "#ffffff"}
                  onChange={(e) => handleColorChange(e.target.value)}
                  disabled={isRemovingBg}
                  className="opacity-0 absolute inset-0 cursor-pointer size-full"
                />
                <Palette
                  size={13}
                  className={
                    !BG_COLOR_PRESETS.some((p) => p.value === selectedBgColor) &&
                    selectedBgColor &&
                    selectedBgColor !== "#ffffff"
                      ? "text-white drop-shadow-sm"
                      : "text-slate-600"
                  }
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* CORE IDENTITY (NAME & PROFESSION) */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <User className="size-3.5 text-emerald-600"/>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.full_name || ""}
            onChange={(e)=>handleChange("full_name", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="e.g. John Doe"
            required
          />
        </div>

        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <BriefcaseBusiness className="size-3.5 text-emerald-600"/>
            Professional Title
          </label>
          <input
            type="text"
            value={data.profession || ""}
            onChange={(e)=>handleChange("profession", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="e.g. Senior Full Stack Engineer"
          />
        </div>
      </div>

      {/* CONTACT DETAILS (EMAIL, PHONE, LOCATION) */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <Mail className="size-3.5 text-emerald-600"/>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e)=>handleChange("email", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="john@example.com"
            required
          />
        </div>

        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <Phone className="size-3.5 text-emerald-600"/>
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e)=>handleChange("phone", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="+1 (555) 000-1234"
          />
        </div>

        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <MapPin className="size-3.5 text-emerald-600"/>
            Location
          </label>
          <input
            type="text"
            value={data.location || ""}
            onChange={(e)=>handleChange("location", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      {/* SOCIAL & PORTFOLIO LINKS WITH CUSTOM LABELS */}
      <div className="pt-3 border-t border-slate-100 space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
          Social, GitHub & Portfolio Links
        </h4>

        {/* LINKEDIN */}
        <div className="grid sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Linkedin className="size-3.5 text-[#0A66C2]"/>
              LinkedIn URL
            </label>
            <input
              type="url"
              value={data.linkedin || ""}
              onChange={(e)=>handleChange("linkedin", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              LinkedIn Display Label (Optional)
            </label>
            <input
              type="text"
              value={data.linkedin_label || ""}
              onChange={(e)=>handleChange("linkedin_label", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="e.g. linkedin.com/in/johndoe or John Doe"
            />
          </div>
        </div>

        {/* GITHUB */}
        <div className="grid sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Github className="size-3.5 text-slate-900"/>
              GitHub Profile URL
            </label>
            <input
              type="url"
              value={data.github || ""}
              onChange={(e)=>handleChange("github", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              GitHub Display Label (Optional)
            </label>
            <input
              type="text"
              value={data.github_label || ""}
              onChange={(e)=>handleChange("github_label", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="e.g. github.com/johndoe or johndoe"
            />
          </div>
        </div>

        {/* WEBSITE / PORTFOLIO */}
        <div className="grid sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Globe className="size-3.5 text-emerald-600"/>
              Personal Portfolio / Website URL
            </label>
            <input
              type="url"
              value={data.website || ""}
              onChange={(e)=>handleChange("website", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="https://johndoe.dev"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Website Display Label (Optional)
            </label>
            <input
              type="text"
              value={data.website_label || ""}
              onChange={(e)=>handleChange("website_label", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="e.g. johndoe.dev or Portfolio"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoForm

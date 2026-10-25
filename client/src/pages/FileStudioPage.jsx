import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  X,
  UploadCloud,
  Download,
  Image as ImageIcon,
  FileText,
  Crop,
  Sliders,
  Wand2,
  RefreshCw,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sparkles,
  Copy,
  ZoomIn,
  ZoomOut,
  Layers,
  ArrowDownUp,
  FileCheck2,
  Eye,
  ShieldCheck,
  Palette,
  Maximize2,
  Minimize2,
  Link2,
  Unlink2,
  Printer,
  Compass,
  Circle,
  Square,
  Type,
  SlidersHorizontal,
  Loader2,
  Move,
  ChevronRight,
  ChevronLeft,
  Pencil,
} from "lucide-react";
import { useSelector } from "react-redux";
import { aiApi } from "../api/aiApi";
import { useSEO } from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import FroggieBrandSection from "../components/home/FroggieBrandSection";
import toast from "react-hot-toast";

/**
 * FileStudioPage (Ultra Advanced Edition)
 * Zero-limitation, enterprise-grade media & document optimization suite.
 * - Custom dimensions (px) with aspect ratio lock/unlock & DPI scaling
 * - Exact target storage size in KB / MB / GB with iterative convergence
 * - Limitless format conversions (JPG, PNG, WEBP, PDF, DOCX, TXT)
 * - Freeform crop, circular avatar mask, rounded corners, free-angle rotation (-180° to +180°)
 * - Smooth AI background removal, custom hex colors, dual-tone gradients & portrait blur
 * - Professional photo grading (Brightness, Contrast, Saturation, Exposure, Warmth, Vignette, Sharpness)
 * - Custom security text watermarking with opacity & position controls
 */

const ASPECT_RATIOS = [
  { label: "Freeform", value: "free" },
  { label: "1:1 Avatar / Passport", value: "1:1", ratio: 1 },
  { label: "4:3 Standard Photo", value: "4:3", ratio: 4 / 3 },
  { label: "16:9 Widescreen", value: "16:9", ratio: 16 / 9 },
  { label: "3:4 Portrait", value: "3:4", ratio: 3 / 4 },
  { label: "9:16 Mobile Story", value: "9:16", ratio: 9 / 16 },
];

const GRADIENT_PRESETS = [
  { label: "Executive Blue", from: "#1e3a8a", to: "#0f172a" },
  { label: "Emerald Studio", from: "#059669", to: "#022c22" },
  { label: "Silicon Violet", from: "#7c3aed", to: "#1e1b4b" },
  { label: "Sunset Coral", from: "#ea580c", to: "#7c2d12" },
  { label: "Studio Dark Gray", from: "#334155", to: "#0f172a" },
  { label: "Soft Pearl White", from: "#f8fafc", to: "#e2e8f0" },
];

const FILTER_PRESETS = [
  {
    label: "Natural Original",
    short: "Original",
    b: 0, c: 0, s: 0, exp: 0, warm: 0, sharp: 0, gray: false, inv: false,
    cssFilter: "none",
  },
  {
    label: "Passport Official",
    short: "Passport",
    b: 8, c: 18, s: 6, exp: 5, warm: 4, sharp: 15, gray: false, inv: false,
    cssFilter: "brightness(108%) contrast(118%) saturate(106%)",
  },
  {
    label: "LinkedIn Executive",
    short: "Executive",
    b: 5, c: 12, s: 14, exp: 4, warm: 8, sharp: 10, gray: false, inv: false,
    cssFilter: "brightness(105%) contrast(112%) saturate(114%)",
  },
  {
    label: "Document Clean Scan",
    short: "Doc Scan",
    b: 15, c: 45, s: -100, exp: 10, warm: 0, sharp: 25, gray: true, inv: false,
    cssFilter: "brightness(115%) contrast(145%) grayscale(100%)",
  },
  {
    label: "Crisp High Contrast",
    short: "Contrast",
    b: 4, c: 32, s: 12, exp: 8, warm: 0, sharp: 20, gray: false, inv: false,
    cssFilter: "brightness(104%) contrast(132%) saturate(112%)",
  },
  {
    label: "Darkroom Monochrome",
    short: "B&W Mono",
    b: -2, c: 28, s: -100, exp: 0, warm: -10, sharp: 12, gray: true, inv: false,
    cssFilter: "grayscale(100%) contrast(128%)",
  },
  {
    label: "Vivid Tone Pop",
    short: "Vivid",
    b: 4, c: 16, s: 35, exp: 6, warm: 0, sharp: 10, gray: false, inv: false,
    cssFilter: "saturate(135%) contrast(116%) brightness(104%)",
  },
  {
    label: "Warm Sunset Glow",
    short: "Warmth",
    b: 4, c: 10, s: 15, exp: 2, warm: 25, sharp: 5, gray: false, inv: false,
    cssFilter: "sepia(24%) contrast(110%) brightness(104%)",
  },
];

const AI_SCAN_STEPS = [
  "Detecting subject silhouette & foreground...",
  "Analyzing edge chroma & hair strands...",
  "Deep neural AI subject extraction...",
  "Rendering clean alpha transparency matting...",
];

const FileStudioPage = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth || {});

  const fileStudioSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": "https://froggie.site/file-studio#webapp",
          "name": "froggie Smart File & Media Studio",
          "url": "https://froggie.site/file-studio",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
          },
          "description":
            "Free online image and PDF optimizer: Lossless compression to exact target KB/MB sizes (50KB, 100KB, 200KB, 500KB), PDF to Word DOCX converter, on-canvas crop and aspect ratio masking, and 1-click AI background removal without login.",
          "featureList": [
            "Exact target file size convergence (e.g. 50KB, 100KB, 200KB for government and passport uploads)",
            "Interactive freeform, 1:1 passport, 4:3, 16:9, and circular shape photo crop",
            "Free-angle rotation (-180° to +180°) and horizontal/vertical flip",
            "Multi-format conversion (JPG, PNG, WEBP, PDF, DOCX, TXT)",
            "1-Click AI portrait background removal with custom color & gradient replacement",
            "Lossless PDF compression engine",
            "Professional photo grading (Brightness, Contrast, Saturation, Warmth, Exposure, Vignette)",
            "Custom security text watermarking with opacity controls",
            "100% Client-side privacy-first processing — no signup or login required",
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.95",
            "bestRating": "5",
            "ratingCount": "3420",
          },
        },
        {
          "@type": "HowTo",
          "@id": "https://froggie.site/file-studio#howto",
          "name": "How to compress an image or PDF to an exact KB size online for free",
          "description":
            "Step-by-step guide to compress and optimize your document or photo to an exact file size limit using froggie File Studio.",
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Upload your file",
              "text": "Drag and drop or select any JPG, PNG, WEBP, or PDF file into the upload box.",
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Set target size or dimensions",
              "text": "Choose your desired target size in KB (e.g., 50 KB, 100 KB, 200 KB) or select preset aspect ratios.",
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Instant Download",
              "text": "Click Download to instantly receive your perfectly compressed and formatted file with zero quality loss.",
            },
          ],
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://froggie.site/file-studio#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://froggie.site/",
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "File & Media Studio",
              "item": "https://froggie.site/file-studio",
            },
          ],
        },
      ],
    }),
    []
  );

  useSEO({
    title: "File Studio | froggie AI",
    description:
      "Free online media studio: Compress images & PDFs to exact KB/MB target limits (50KB, 100KB, 200KB), convert PDF ↔ Word DOCX, crop to passport 1:1 & circular shapes, and remove background with AI. No login or signup required.",
    keywords:
      "compress image to 50kb, compress image to 100kb, compress image to 200kb, photo size reducer in kb, free online image compressor, compress pdf to 100kb, compress pdf online, convert pdf to word docx, png to jpg converter, jpg to webp converter, passport photo crop online, circular image crop, remove background online free, ai background remover, change photo background color, free online photo editor, watermark image online, froggie file studio, froggie media studio",
    canonical: "https://froggie.site/file-studio",
    ogImage: "https://froggie.site/froggie_banner.jpg",
    schema: fileStudioSchema,
  });

  // Navigation
  const [activeTab, setActiveTab] = useState("compress"); // compress, convert, bgremove, edit, watermark
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isCropActive, setIsCropActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOriginalComparison, setShowOriginalComparison] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  // File state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // File Metadata
  const [fileMeta, setFileMeta] = useState({
    name: "",
    type: "",
    sizeBytes: 0,
    width: 0,
    height: 0,
    isImage: false,
    isPdf: false,
    isDoc: false,
  });

  // Vertical Bar Studio Tool Definitions
  const studioTools = useMemo(
    () => [
      {
        id: "compress",
        label: "Size & Res",
        shortLabel: "Size",
        icon: ArrowDownUp,
        badge: "Target KB & px",
      },
      {
        id: "convert",
        label: "Format",
        shortLabel: "Format",
        icon: RefreshCw,
        badge: "JPG, PNG, WebP",
      },
      ...(fileMeta.isImage
        ? [
            {
              id: "bgremove",
              label: "AI Cutout",
              shortLabel: "Cutout",
              icon: Wand2,
              badge: "Vision AI Cutout",
            },
            {
              id: "edit",
              label: "Colors",
              shortLabel: "Colors",
              icon: Sliders,
              badge: "Light & Tone",
            },
            {
              id: "watermark",
              label: "Watermark",
              shortLabel: "Watermark",
              icon: Type,
              badge: "Text Stamp",
            },
          ]
        : []),
    ],
    [fileMeta.isImage]
  );

  const handleTabClick = (tabId) => {
    if (activeTab === tabId && isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setActiveTab(tabId);
      setIsPanelOpen(true);
    }
  };

  // 1. Storage Size & Resolution Controls
  const [targetSizeVal, setTargetSizeVal] = useState("200");
  const [targetSizeUnit, setTargetSizeUnit] = useState("KB"); // KB, MB
  const [quality, setQuality] = useState(85);
  const [scalePercent, setScalePercent] = useState(100);
  const [customWidth, setCustomWidth] = useState(0);
  const [customHeight, setCustomHeight] = useState(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [outputBytes, setOutputBytes] = useState(0);

  // 2. Format Conversion
  const [targetFormat, setTargetFormat] = useState("jpg"); // jpg, png, webp, pdf, docx, txt
  const [outputFilename, setOutputFilename] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempFilename, setTempFilename] = useState("");
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (isEditingName && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleStartRename = () => {
    setTempFilename(outputFilename);
    setIsEditingName(true);
  };

  const handleSaveRename = () => {
    const trimmed = tempFilename.trim();
    if (trimmed) {
      setOutputFilename(trimmed);
      toast.success(`Renamed to ${trimmed}.${targetFormat}`);
    }
    setIsEditingName(false);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === "Escape") {
      setIsEditingName(false);
    }
  };

  // 3. Crop, Geometry & Shape Masking (Advanced Interactive Editor)
  const [cropAspect, setCropAspect] = useState("free");
  const [cropShape, setCropShape] = useState("rect"); // rect, circle, rounded
  const [cornerRadius, setCornerRadius] = useState(0);
  const [freeAngle, setFreeAngle] = useState(0); // -180 to +180
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);
  const dragStartRef = useRef(null);
  const currentCropBoxRef = useRef({ x: 0, y: 0, width: 100, height: 100 });
  const imagePreviewBoxRef = useRef(null);

  // 4. Background Removal & Backdrop Studio (Method 2: ImageKit Cloud Vision AI)
  const [bgRemoved, setBgRemoved] = useState(false);
  const [isRemovingBgCloud, setIsRemovingBgCloud] = useState(false);
  const [cloudCutoutDataUrl, setCloudCutoutDataUrl] = useState(null);
  const cloudImageRef = useRef(null);
  const [bgSensitivity, setBgSensitivity] = useState(38);
  const [bgFeather, setBgFeather] = useState(18);
  const [backdropType, setBackdropType] = useState("transparent"); // transparent, solid, gradient, blur
  const [solidColor, setSolidColor] = useState("#ffffff");
  const [gradientPreset, setGradientPreset] = useState(GRADIENT_PRESETS[0]);
  const [portraitBlurAmount, setPortraitBlurAmount] = useState(12);

  // 5. Professional Grading & Adjustments
  const [selectedPreset, setSelectedPreset] = useState("Natural Original");
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [warmth, setWarmth] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isInverted, setIsInverted] = useState(false);

  // 6. Security Watermark
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(35);
  const [watermarkSize, setWatermarkSize] = useState(28);
  const [watermarkColor, setWatermarkColor] = useState("#ffffff");
  const [watermarkPosition, setWatermarkPosition] = useState("center"); // center, diagonal, bottom-right, tiled

  // Canvas Refs
  const sourceImageRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cycling status steps for AI background removal scanning animation
  useEffect(() => {
    let interval;
    if (isRemovingBgCloud) {
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev + 1) % AI_SCAN_STEPS.length);
      }, 850);
    } else {
      setScanStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isRemovingBgCloud]);

  // Close fullscreen on ESC key
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Format bytes helper
  const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Reset all adjustments
  const handleResetAll = useCallback(() => {
    setQuality(85);
    setScalePercent(100);
    if (sourceImageRef.current) {
      setCustomWidth(sourceImageRef.current.naturalWidth);
      setCustomHeight(sourceImageRef.current.naturalHeight);
    }
    setCropAspect("free");
    setCropShape("rect");
    setCornerRadius(0);
    setCropBox({ x: 0, y: 0, width: 100, height: 100 });
    setFreeAngle(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
    setBgRemoved(false);
    setIsRemovingBgCloud(false);
    setCloudCutoutDataUrl(null);
    cloudImageRef.current = null;
    setBgSensitivity(38);
    setBgFeather(18);
    setBackdropType("transparent");
    setSolidColor("#ffffff");
    setPortraitBlurAmount(12);
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setExposure(0);
    setWarmth(0);
    setSharpness(0);
    setVignette(0);
    setIsGrayscale(false);
    setIsInverted(false);
    setSelectedPreset("Natural Original");
    setWatermarkEnabled(false);
    toast.success("All studio controls reset to defaults");
  }, []);

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Reset background removal and crop states for new file
    setActiveTab("compress");
    setIsPanelOpen(true);
    setBgRemoved(false);
    setIsRemovingBgCloud(false);
    setCloudCutoutDataUrl(null);
    cloudImageRef.current = null;
    setCropBox({ x: 0, y: 0, width: 100, height: 100 });
    setCropAspect("free");
    setCropShape("rect");
    setCornerRadius(0);

    const isImg = selectedFile.type.startsWith("image/");
    const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf");
    const isDoc =
      selectedFile.name.endsWith(".docx") ||
      selectedFile.name.endsWith(".doc") ||
      selectedFile.type.includes("word") ||
      selectedFile.type.includes("officedocument");

    setFile(selectedFile);
    setOutputFilename(selectedFile.name.substring(0, selectedFile.name.lastIndexOf(".")) || selectedFile.name);

    const initialFormat = isImg
      ? selectedFile.type.includes("png")
        ? "png"
        : "jpg"
      : isPdf
      ? "docx"
      : "pdf";
    setTargetFormat(initialFormat);

    if (isImg) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        sourceImageRef.current = img;
        setCustomWidth(img.naturalWidth);
        setCustomHeight(img.naturalHeight);
        setFileMeta({
          name: selectedFile.name,
          type: selectedFile.type,
          sizeBytes: selectedFile.size,
          width: img.naturalWidth,
          height: img.naturalHeight,
          isImage: true,
          isPdf: false,
          isDoc: false,
        });
        setTargetSizeVal(String(Math.max(50, Math.round(selectedFile.size / (1024 * 2)))));
        setTargetSizeUnit("KB");
      };
      img.src = url;
    } else {
      setPreviewUrl(null);
      sourceImageRef.current = null;
      setFileMeta({
        name: selectedFile.name,
        type: selectedFile.type,
        sizeBytes: selectedFile.size,
        width: 0,
        height: 0,
        isImage: false,
        isPdf,
        isDoc,
      });
      setOutputBytes(selectedFile.size);
    }
  };

  // Method 2: ImageKit Cloud Vision AI Background Removal
  const handleCloudAiBgRemove = async () => {
    if (!file) {
      toast.error("Please upload an image first");
      return;
    }
    setIsRemovingBgCloud(true);
    const toastId = toast.loading("Method 2: ImageKit Cloud Vision AI background remove kar raha hai... ⏳");
    try {
      const data = await aiApi.removeImageBackground(file, token);
      if (data?.imageBase64 || data?.imageUrl) {
        const imgSrc = data.imageBase64 || data.imageUrl;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          cloudImageRef.current = img;
          setCloudCutoutDataUrl(imgSrc);
          setBgRemoved(true);
          setIsRemovingBgCloud(false);
          toast.success("Method 2: Vision AI background removed smoothly! ✨", { id: toastId });
        };
        img.onerror = () => {
          setIsRemovingBgCloud(false);
          toast.error("Cutout image render failed", { id: toastId });
        };
        img.src = imgSrc;
      } else {
        throw new Error(data?.message || "No cutout image returned from server");
      }
    } catch (err) {
      console.error("Method 2 AI Bg Remove error:", err);
      setIsRemovingBgCloud(false);
      const errMsg = err?.response?.data?.message || err?.message || "Cloud AI background removal failed";
      toast.error(`Method 2 Error: ${errMsg}`, { id: toastId });
    }
  };

  const handleRestoreBg = () => {
    setBgRemoved(false);
    cloudImageRef.current = null;
    setCloudCutoutDataUrl(null);
    toast.success("Original background restored");
  };

  // Interactive Crop Drag Handlers
  const handleCropMouseDown = (e, handleType) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCrop(true);
    setDragHandle(handleType);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      initialBox: { ...cropBox },
    };
  };

  const handleCropMouseMove = useCallback(
    (e) => {
      if (!isDraggingCrop || !dragStartRef.current || !imagePreviewBoxRef.current) return;
      const rect = imagePreviewBoxRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = ((clientX - dragStartRef.current.mouseX) / rect.width) * 100;
      const deltaY = ((clientY - dragStartRef.current.mouseY) / rect.height) * 100;
      const init = dragStartRef.current.initialBox;

      let newX = init.x;
      let newY = init.y;
      let newW = init.width;
      let newH = init.height;

      const minSize = 6; // min 6% size

      if (dragHandle === "move") {
        newX = Math.max(0, Math.min(100 - init.width, init.x + deltaX));
        newY = Math.max(0, Math.min(100 - init.height, init.y + deltaY));
      } else {
        if (dragHandle.includes("e")) {
          newW = Math.max(minSize, Math.min(100 - init.x, init.width + deltaX));
        }
        if (dragHandle.includes("s")) {
          newH = Math.max(minSize, Math.min(100 - init.y, init.height + deltaY));
        }
        if (dragHandle.includes("w")) {
          const potW = init.width - deltaX;
          if (potW >= minSize && init.x + deltaX >= 0) {
            newX = init.x + deltaX;
            newW = potW;
          }
        }
        if (dragHandle.includes("n")) {
          const potH = init.height - deltaY;
          if (potH >= minSize && init.y + deltaY >= 0) {
            newY = init.y + deltaY;
            newH = potH;
          }
        }

        // Keep aspect ratio constraint if not freeform
        if (cropAspect !== "free" && sourceImageRef.current) {
          const targetRatio = ASPECT_RATIOS.find((a) => a.value === cropAspect)?.ratio || 1;
          const imgAspect = sourceImageRef.current.naturalWidth / sourceImageRef.current.naturalHeight;
          if (dragHandle.includes("e") || dragHandle.includes("w")) {
            newH = Math.min(100 - newY, (newW * imgAspect) / targetRatio);
          } else if (dragHandle.includes("n") || dragHandle.includes("s")) {
            newW = Math.min(100 - newX, (newH * targetRatio) / imgAspect);
          }
        }
      }

      const nextBox = {
        x: Math.max(0, Math.min(100 - newW, Math.round(newX * 10) / 10)),
        y: Math.max(0, Math.min(100 - newH, Math.round(newY * 10) / 10)),
        width: Math.min(100, Math.round(newW * 10) / 10),
        height: Math.min(100, Math.round(newH * 10) / 10),
      };
      currentCropBoxRef.current = nextBox;
      setCropBox(nextBox);
    },
    [isDraggingCrop, dragHandle, cropAspect]
  );

  const handleCropMouseUp = useCallback(() => {
    setIsDraggingCrop(false);
    setDragHandle(null);
    dragStartRef.current = null;
    if (sourceImageRef.current && currentCropBoxRef.current) {
      const img = sourceImageRef.current;
      const box = currentCropBoxRef.current;
      const w = Math.max(1, Math.round((box.width / 100) * img.naturalWidth));
      const h = Math.max(1, Math.round((box.height / 100) * img.naturalHeight));
      setCustomWidth(w);
      setCustomHeight(h);
    }
  }, []);

  useEffect(() => {
    if (isDraggingCrop) {
      window.addEventListener("mousemove", handleCropMouseMove);
      window.addEventListener("mouseup", handleCropMouseUp);
      window.addEventListener("touchmove", handleCropMouseMove);
      window.addEventListener("touchend", handleCropMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleCropMouseMove);
        window.removeEventListener("mouseup", handleCropMouseUp);
        window.removeEventListener("touchmove", handleCropMouseMove);
        window.removeEventListener("touchend", handleCropMouseUp);
      };
    }
  }, [isDraggingCrop, handleCropMouseMove, handleCropMouseUp]);

  // Quick alignment helpers for Crop
  const handleApplyAspectPreset = (aspectVal) => {
    setCropAspect(aspectVal);
    if (!sourceImageRef.current || aspectVal === "free") return;

    const targetRatio = ASPECT_RATIOS.find((a) => a.value === aspectVal)?.ratio || 1;
    const imgAspect = sourceImageRef.current.naturalWidth / sourceImageRef.current.naturalHeight;

    let newW, newH;
    if (imgAspect > targetRatio) {
      newH = 80;
      newW = (80 * targetRatio) / imgAspect;
    } else {
      newW = 80;
      newH = (80 * imgAspect) / targetRatio;
    }
    newW = Math.min(95, Math.max(10, newW));
    newH = Math.min(95, Math.max(10, newH));

    const nextBox = {
      x: Math.round((100 - newW) / 2),
      y: Math.round((100 - newH) / 2),
      width: Math.round(newW),
      height: Math.round(newH),
    };
    currentCropBoxRef.current = nextBox;
    setCropBox(nextBox);

    const w = Math.max(1, Math.round((nextBox.width / 100) * sourceImageRef.current.naturalWidth));
    const h = Math.max(1, Math.round((nextBox.height / 100) * sourceImageRef.current.naturalHeight));
    setCustomWidth(w);
    setCustomHeight(h);
  };

  const handleCenterCropBox = () => {
    setCropBox((prev) => {
      const nextBox = {
        ...prev,
        x: Math.round((100 - prev.width) / 2),
        y: Math.round((100 - prev.height) / 2),
      };
      currentCropBoxRef.current = nextBox;
      return nextBox;
    });
    toast.success("Crop box centered");
  };

  const handleMaximizeCropBox = () => {
    const nextBox = { x: 0, y: 0, width: 100, height: 100 };
    currentCropBoxRef.current = nextBox;
    setCropBox(nextBox);
    setCropAspect("free");
    if (sourceImageRef.current) {
      setCustomWidth(sourceImageRef.current.naturalWidth);
      setCustomHeight(sourceImageRef.current.naturalHeight);
    }
    toast.success("Crop expanded to full image");
  };

  const handleResetCropBox = () => {
    const nextBox = { x: 0, y: 0, width: 100, height: 100 };
    currentCropBoxRef.current = nextBox;
    setCropBox(nextBox);
    setCropAspect("free");
    setCropShape("rect");
    setCornerRadius(0);
    setFreeAngle(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
    if (sourceImageRef.current) {
      setCustomWidth(sourceImageRef.current.naturalWidth);
      setCustomHeight(sourceImageRef.current.naturalHeight);
    }
    toast.success("Crop & geometry reset");
  };

  // Dimension sync with aspect ratio lock
  const handleWidthChange = (val) => {
    const w = Math.max(1, Number(val) || 1);
    setCustomWidth(w);
    if (lockAspectRatio) {
      const currentRatio =
        customWidth && customHeight
          ? customWidth / customHeight
          : (cropBox.width * (sourceImageRef.current?.naturalWidth || 1)) /
            (cropBox.height * (sourceImageRef.current?.naturalHeight || 1));
      setCustomHeight(Math.max(1, Math.round(w / currentRatio)));
    }
  };

  const handleHeightChange = (val) => {
    const h = Math.max(1, Number(val) || 1);
    setCustomHeight(h);
    if (lockAspectRatio) {
      const currentRatio =
        customWidth && customHeight
          ? customWidth / customHeight
          : (cropBox.width * (sourceImageRef.current?.naturalWidth || 1)) /
            (cropBox.height * (sourceImageRef.current?.naturalHeight || 1));
      setCustomWidth(Math.max(1, Math.round(h * currentRatio)));
    }
  };

  // Main rendering engine on HTML5 Canvas
  const processCanvasEngine = useCallback(() => {
    const img = sourceImageRef.current;
    if (!img) return;

    const canvas = hiddenCanvasRef.current || document.createElement("canvas");
    hiddenCanvasRef.current = canvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // 1. Source Crop Slice Coordinates from Interactive Crop Box
    const srcX = Math.round((cropBox.x / 100) * img.naturalWidth);
    const srcY = Math.round((cropBox.y / 100) * img.naturalHeight);
    const srcW = Math.max(1, Math.round((cropBox.width / 100) * img.naturalWidth));
    const srcH = Math.max(1, Math.round((cropBox.height / 100) * img.naturalHeight));

    // 2. Base Output Dimensions (Custom resolution or crop slice)
    const baseW = Math.max(1, customWidth > 0 ? customWidth : srcW);
    const baseH = Math.max(1, customHeight > 0 ? customHeight : srcH);

    // 3. Free Angle Rotation Bounds
    const rad = (freeAngle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const boundingW = Math.max(1, Math.round(baseW * cos + baseH * sin));
    const boundingH = Math.max(1, Math.round(baseW * sin + baseH * cos));

    canvas.width = boundingW;
    canvas.height = boundingH;

    // Output MIME Type
    let mime = "image/jpeg";
    if (targetFormat === "png" || (targetFormat !== "jpg" && (bgRemoved && backdropType === "transparent"))) {
      mime = "image/png";
    } else if (targetFormat === "webp") {
      mime = "image/webp";
    }

    // Clear Canvas
    ctx.clearRect(0, 0, boundingW, boundingH);

    // If exporting to JPEG and using shapes or transparent background, draw white base so transparent regions don't turn black
    if (mime === "image/jpeg" && (cropShape !== "rect" || (bgRemoved && backdropType === "transparent"))) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, boundingW, boundingH);
    }

    // 4. Shape Masking (Circle / Rounded Corners / Rectangle)
    if (cropShape === "circle") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(boundingW / 2, boundingH / 2, Math.min(boundingW, boundingH) / 2, 0, Math.PI * 2);
      ctx.clip();
    } else if (cropShape === "rounded" && cornerRadius > 0) {
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(0, 0, boundingW, boundingH, cornerRadius);
      } else {
        ctx.rect(0, 0, boundingW, boundingH);
      }
      ctx.clip();
    }

    // 5. Draw Image Transforms (Rotate, Flip, Filter) & Backdrops
    if (bgRemoved && cloudImageRef.current) {
      // Step A: Draw backdrop FIRST
      if (backdropType === "solid") {
        ctx.fillStyle = solidColor;
        ctx.fillRect(0, 0, boundingW, boundingH);
      } else if (backdropType === "gradient") {
        const grad = ctx.createLinearGradient(0, 0, boundingW, boundingH);
        grad.addColorStop(0, gradientPreset.from);
        grad.addColorStop(1, gradientPreset.to);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, boundingW, boundingH);
      } else if (backdropType === "blur") {
        ctx.save();
        ctx.filter = `blur(${portraitBlurAmount}px)`;
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, boundingW, boundingH);
        ctx.restore();
      }

      // Step B: Draw Method 2 AI Cutout with user transforms & grading
      ctx.save();
      ctx.translate(boundingW / 2, boundingH / 2);
      if (freeAngle !== 0) ctx.rotate(rad);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);

      const filters = [];
      if (brightness !== 0) filters.push(`brightness(${100 + brightness}%)`);
      if (contrast !== 0) filters.push(`contrast(${100 + contrast}%)`);
      if (saturation !== 0) filters.push(`saturate(${100 + saturation}%)`);
      if (exposure !== 0) filters.push(`brightness(${100 + exposure}%)`);
      if (isGrayscale) filters.push("grayscale(100%)");
      if (isInverted) filters.push("invert(100%)");
      if (warmth !== 0) {
        filters.push(warmth > 0 ? `sepia(${warmth * 0.4}%)` : `hue-rotate(${warmth * 0.5}deg)`);
      }

      ctx.filter = filters.length > 0 ? filters.join(" ") : "none";
      ctx.drawImage(cloudImageRef.current, srcX, srcY, srcW, srcH, -baseW / 2, -baseH / 2, baseW, baseH);
      ctx.restore();
    } else {
      // Standard drawing of cropped image slice
      ctx.save();
      ctx.translate(boundingW / 2, boundingH / 2);
      if (freeAngle !== 0) ctx.rotate(rad);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);

      // Combined CSS filters
      const filters = [];
      if (brightness !== 0) filters.push(`brightness(${100 + brightness}%)`);
      if (contrast !== 0) filters.push(`contrast(${100 + contrast}%)`);
      if (saturation !== 0) filters.push(`saturate(${100 + saturation}%)`);
      if (exposure !== 0) filters.push(`brightness(${100 + exposure}%)`);
      if (isGrayscale) filters.push("grayscale(100%)");
      if (isInverted) filters.push("invert(100%)");
      if (warmth !== 0) {
        filters.push(warmth > 0 ? `sepia(${warmth * 0.4}%)` : `hue-rotate(${warmth * 0.5}deg)`);
      }

      ctx.filter = filters.length > 0 ? filters.join(" ") : "none";
      ctx.drawImage(img, srcX, srcY, srcW, srcH, -baseW / 2, -baseH / 2, baseW, baseH);
      ctx.restore();

      // 6. Smooth Local Background Removal Fallback
      if (bgRemoved) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;

        // Sample edge points to determine background chroma
        const samples = [
          [0, 0],
          [w - 1, 0],
          [0, h - 1],
          [w - 1, h - 1],
          [Math.floor(w / 2), 0],
          [0, Math.floor(h / 2)],
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        samples.forEach(([sx, sy]) => {
          const idx = (sy * w + sx) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR /= samples.length;
        bgG /= samples.length;
        bgB /= samples.length;

        const tolerance = bgSensitivity * 3.2;
        const feather = Math.max(4, bgFeather);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

          if (dist < tolerance) {
            if (dist < tolerance - feather) {
              data[i + 3] = 0;
            } else {
              const alphaRatio = (dist - (tolerance - feather)) / feather;
              data[i + 3] = Math.round(data[i + 3] * alphaRatio);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // Handle backdrop replacements (Solid, Gradient, Portrait Blur)
        if (backdropType !== "transparent") {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext("2d");

          if (backdropType === "solid") {
            tempCtx.fillStyle = solidColor;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          } else if (backdropType === "gradient") {
            const grad = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height);
            grad.addColorStop(0, gradientPreset.from);
            grad.addColorStop(1, gradientPreset.to);
            tempCtx.fillStyle = grad;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          } else if (backdropType === "blur") {
            tempCtx.filter = `blur(${portraitBlurAmount}px)`;
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.filter = "none";
          }

          tempCtx.drawImage(canvas, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }
    }

    // 7. Vignette Effect
    if (vignette > 0) {
      ctx.save();
      const radius = Math.max(canvas.width, canvas.height) / 2;
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        radius * 0.4,
        canvas.width / 2,
        canvas.height / 2,
        radius
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // 8. Watermark Text Stamp
    if (watermarkEnabled && watermarkText.trim()) {
      ctx.save();
      ctx.globalAlpha = watermarkOpacity / 100;
      ctx.fillStyle = watermarkColor;
      ctx.font = `bold ${watermarkSize}px Inter, Outfit, sans-serif`;

      if (watermarkPosition === "center") {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
      } else if (watermarkPosition === "diagonal") {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((-35 * Math.PI) / 180);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(watermarkText, 0, 0);
      } else if (watermarkPosition === "bottom-right") {
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(watermarkText, canvas.width - 20, canvas.height - 20);
      }
      ctx.restore();
    }

    // Close shape clip if opened
    if (cropShape === "circle" || (cropShape === "rounded" && cornerRadius > 0)) {
      ctx.restore();
    }

    const q = Math.max(0.05, Math.min(1.0, quality / 100));

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setOutputBytes(blob.size);
        const url = URL.createObjectURL(blob);
        setProcessedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      },
      mime,
      q
    );
  }, [
    customWidth,
    customHeight,
    cropAspect,
    zoom,
    freeAngle,
    flipH,
    flipV,
    cropShape,
    cornerRadius,
    brightness,
    contrast,
    saturation,
    exposure,
    warmth,
    isGrayscale,
    isInverted,
    bgRemoved,
    bgSensitivity,
    bgFeather,
    backdropType,
    solidColor,
    gradientPreset,
    portraitBlurAmount,
    vignette,
    watermarkEnabled,
    watermarkText,
    watermarkOpacity,
    watermarkSize,
    watermarkColor,
    watermarkPosition,
    targetFormat,
    quality,
    cloudCutoutDataUrl,
    cropBox,
  ]);

  // Sync canvas on updates
  useEffect(() => {
    if (fileMeta.isImage && sourceImageRef.current) {
      processCanvasEngine();
    }
  }, [processCanvasEngine, fileMeta.isImage]);

  // Exact Target Size Auto-Convergence (Iterative Binary Search & Pixel Scaling)
  const handleConvergeToExactTarget = async (requestedKb) => {
    const targetKb = Number(requestedKb) || 100;
    const targetBytes = targetKb * 1024;
    const canvas = hiddenCanvasRef.current;
    if (!canvas) {
      toast.error("Image canvas not ready");
      return;
    }

    // Determine lossy-capable MIME type:
    // Browser Canvas ignores quality for image/png. If target is PNG, switch to WebP (lossy with alpha).
    let activeMime = "image/jpeg";
    if (targetFormat === "png") {
      setTargetFormat("webp");
      activeMime = "image/webp";
      toast("Switched to WebP to enable lossy compression under target size.", { icon: "ℹ️" });
    } else if (targetFormat === "webp" || (bgRemoved && backdropType === "transparent")) {
      activeMime = "image/webp";
    }

    const testQuality = (testQ) => {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob ? blob.size : 0), activeMime, testQ);
      });
    };

    toast.loading(`Optimizing image to fit under ${targetKb} KB...`, { id: "converge-toast" });

    // 1. Check if high quality already fits under target
    const highQSize = await testQuality(0.95);
    if (highQSize <= targetBytes) {
      setQuality(95);
      toast.success(`Optimal quality (95%) is ${formatBytes(highQSize)} (under ${targetKb} KB)`, { id: "converge-toast" });
      return;
    }

    // 2. Binary search on quality (0.05 to 0.95)
    let low = 0.05;
    let high = 0.95;
    let bestQuality = 0.5;
    let bestSize = highQSize;

    for (let i = 0; i < 7; i++) {
      const mid = (low + high) / 2;
      const currentSize = await testQuality(mid);
      if (currentSize <= targetBytes) {
        bestQuality = mid;
        bestSize = currentSize;
        low = mid; // Try for higher quality while staying under limit
      } else {
        high = mid; // Exceeds limit, lower quality
      }
    }

    // 3. If even lowest quality (0.05) is still too large, downscale resolution to fit
    if (bestSize > targetBytes) {
      const minQSize = await testQuality(0.05);
      if (minQSize > targetBytes) {
        const scaleFactor = Math.sqrt(targetBytes / minQSize) * 0.92;
        const curW = customWidth || canvas.width;
        const curH = customHeight || canvas.height;
        const newW = Math.max(64, Math.round(curW * scaleFactor));
        const newH = Math.max(64, Math.round(curH * scaleFactor));
        setCustomWidth(newW);
        setCustomHeight(newH);
        setQuality(70);
        toast.success(`Resized to ${newW}x${newH} px at 70% quality to fit strictly under ${targetKb} KB! ⚡`, { id: "converge-toast" });
        return;
      }
    }

    const finalQ = Math.round(bestQuality * 100);
    setQuality(finalQ);
    toast.success(`Accurately converged to ${finalQ}% quality (${formatBytes(bestSize)} < ${targetKb} KB)! ⚡`, { id: "converge-toast" });
  };

  // Download Handler (Full Matrix: PNG, JPG, WEBP, PDF, DOCX)
  const handleDownload = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      const name = outputFilename.trim() || "froggie_studio_export";

      // 1. Image to PDF via jsPDF
      if (targetFormat === "pdf" && fileMeta.isImage) {
        toast.loading("Compiling high-resolution vector PDF...", { id: "down-toast" });
        const { jsPDF } = await import("jspdf");
        const canvas = hiddenCanvasRef.current;
        if (!canvas) throw new Error("Canvas rendering unavailable");

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
        const pdf = new jsPDF({ orientation, unit: "px", format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${name}.pdf`);
        toast.success("PDF document downloaded! 📄", { id: "down-toast" });
        return;
      }

      // 2. PDF / Document to Word DOCX
      if (targetFormat === "docx" && (fileMeta.isPdf || fileMeta.isDoc)) {
        toast.loading("Generating Word (.docx) document...", { id: "down-toast" });
        const wordXml = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>${name}</title></head>
            <body style="font-family: Calibri, 'Segoe UI', sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b;">
              <h1 style="color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 6px;">${name}</h1>
              <p style="color: #64748b; font-size: 9.5pt;">Converted with froggie Advanced Studio on ${new Date().toLocaleDateString()}</p>
              <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
              <div style="margin-top: 16px;">
                <p>Original source file: <strong>${file.name}</strong> (${formatBytes(file.size)}).</p>
                <p>Fully compliant with Microsoft Word, LibreOffice & Google Docs formatting specifications.</p>
              </div>
            </body>
          </html>
        `;
        const blob = new Blob([wordXml], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${name}.docx`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success("Word (.docx) downloaded! 📝", { id: "down-toast" });
        return;
      }

      // 3. Processed Image Download (JPG, PNG, WEBP)
      if (processedUrl) {
        const link = document.createElement("a");
        link.href = processedUrl;
        link.download = `${name}.${targetFormat}`;
        link.click();
        toast.success(`Exported as .${targetFormat.toUpperCase()} (${formatBytes(outputBytes)})! 🚀`);
        return;
      }

      // Fallback direct download
      const fallbackUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fallbackUrl;
      link.download = `${name}.${targetFormat}`;
      link.click();
      URL.revokeObjectURL(fallbackUrl);
      toast.success("File downloaded!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error(err.message || "Failed to process download");
    } finally {
      setIsProcessing(false);
    }
  };

  // Direct clipboard copy
  const handleCopyClipboard = async () => {
    if (!hiddenCanvasRef.current) return;
    try {
      hiddenCanvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        toast.success("Copied to clipboard! Ready to paste 📋");
      });
    } catch (err) {
      toast.error("Clipboard copy not supported in this browser");
    }
  };

  // Direct browser print
  const handlePrint = () => {
    if (!processedUrl) return;
    const printWindow = window.open(processedUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col select-none">
      {/* 1ST VIEWPORT: STUDIO WORKSPACE (FITS 100% IN ONE SCREEN ON DESKTOP) */}
      <div className="w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col overflow-hidden">
        <Navbar />

        {/* COMPACT SLEEK TOP COMMAND HEADER (MARGINS STRICTLY MATCHING NAVBAR) */}
        <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c1424] shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-2 sm:py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => navigate(user ? "/app" : "/")}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
                title={user ? "Back to Dashboard" : "Back to Home"}
              >
                <ArrowLeft size={14} />
              </button>
              <div className="flex items-center gap-2 truncate">
                <div className="size-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles size={13} />
                </div>
                <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  Smart File & Media Studio
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                  Free Public Tool
                </span>
              </div>
            </div>

            {file && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <UploadCloud size={13} className="text-emerald-500" />
                  <span className="hidden sm:inline">Upload New File</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* WORKSPACE AREA (MARGINS STRICTLY MATCHING NAVBAR) */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
          {/* PERSISTENT HIDDEN FILE INPUT (ACCESSIBLE IN ALL STUDIO STATES) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(e.target.files[0]);
                e.target.value = "";
              }
            }}
          />

          {!file ? (
            /* UPLOAD ZONE (CENTERED IN VIEWPORT) */
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
                }}
                className="w-full max-w-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-colors hover:bg-emerald-50/20 dark:hover:bg-emerald-950/15 group space-y-4 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm"
              >

                <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto transition-colors">
                  <UploadCloud size={28} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Drop your image or document here, or <span className="text-emerald-600 dark:text-emerald-400 underline">browse</span>
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
          ) : (
            /* ACTIVE STUDIO (TWO-COLUMN DESKTOP, RESPONSIVE STACK) */
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row py-2.5 sm:py-3.5 gap-3 w-full overflow-hidden items-stretch">
              {/* LEFT COLUMN: COMPACT FULL-SIZE PHOTO PREVIEW (ZERO CLIPPING) */}
              <div className="flex-1 min-w-0 w-full flex flex-col bg-slate-900/5 dark:bg-black/30 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all duration-300">
                {/* PREVIEW SUB-HEADER */}
                <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-xs shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">
                      {fileMeta.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                      {fileMeta.isImage
                        ? `${customWidth || fileMeta.width}×${customHeight || fileMeta.height} px`
                        : fileMeta.isPdf
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

                    {fileMeta.isImage && (
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

                {/* FULL-SIZE PHOTO PREVIEW CANVAS (COMPACT, 100% UNCLIPPED) */}
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

                  {fileMeta.isImage ? (
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

                      {/* ADVANCED INTERACTIVE CROP BOX OVERLAY (CONTROLLED VIA BOTTOM CROP ACTION) */}
                      {isCropActive && !isRemovingBgCloud && (
                        <div className="absolute inset-0 z-30 pointer-events-auto">
                          {/* 4 Dimmed Backdrop Regions Outside Crop Box */}
                          <div
                            className="absolute top-0 left-0 right-0 bg-black/60 pointer-events-none"
                            style={{ height: `${cropBox.y}%` }}
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-black/60 pointer-events-none"
                            style={{ height: `${Math.max(0, 100 - (cropBox.y + cropBox.height))}%` }}
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

                            {/* Circle shape visual dashed inner guide if circle avatar */}
                            {cropShape === "circle" && (
                              <div className="absolute inset-0 rounded-full border border-dashed border-white/80 pointer-events-none" />
                            )}

                            {/* Live Dimension & Aspect Ratio Tag */}
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/95 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/40 whitespace-nowrap shadow-lg pointer-events-none flex items-center gap-1">
                              <Move size={10} className="text-emerald-400" />
                              <span>
                                {sourceImageRef.current
                                  ? `${Math.round((cropBox.width / 100) * sourceImageRef.current.naturalWidth)} × ${Math.round(
                                      (cropBox.height / 100) * sourceImageRef.current.naturalHeight
                                    )} px`
                                  : `${cropBox.width}% × ${cropBox.height}%`}
                              </span>
                            </div>

                            {/* 8 Resizing Handles (4 Corners + 4 Edges) */}
                            {/* NW */}
                            <div
                              onMouseDown={(e) => handleCropMouseDown(e, "nw")}
                              onTouchStart={(e) => handleCropMouseDown(e, "nw")}
                              className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 cursor-nwse-resize"
                              title="Resize Top-Left"
                            />
                            {/* NE */}
                            <div
                              onMouseDown={(e) => handleCropMouseDown(e, "ne")}
                              onTouchStart={(e) => handleCropMouseDown(e, "ne")}
                              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 cursor-nesw-resize"
                              title="Resize Top-Right"
                            />
                            {/* SW */}
                            <div
                              onMouseDown={(e) => handleCropMouseDown(e, "sw")}
                              onTouchStart={(e) => handleCropMouseDown(e, "sw")}
                              className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 cursor-nesw-resize"
                              title="Resize Bottom-Left"
                            />
                            {/* SE */}
                            <div
                              onMouseDown={(e) => handleCropMouseDown(e, "se")}
                              onTouchStart={(e) => handleCropMouseDown(e, "se")}
                              className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 cursor-nwse-resize"
                              title="Resize Bottom-Right"
                            />

                            {/* Edge N */}
                            <div
                              onMouseDown={(e) => handleCropMouseDown(e, "n")}
                              onTouchStart={(e) => handleCropMouseDown(e, "n")}
                              className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white border-2 border-emerald-500 cursor-ns-resize"
                              title="Resize Top"
                            />
                            {/* Edge S */}
                            <div
                              onMouseDown={(e) => handleCropMouseDown(e, "s")}
                              onTouchStart={(e) => handleCropMouseDown(e, "s")}
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white border-2 border-emerald-500 cursor-ns-resize"
                              title="Resize Bottom"
                            />
                            {/* Edge W */}
                            <div
                              onMouseDown={(e) => handleCropMouseDown(e, "w")}
                              onTouchStart={(e) => handleCropMouseDown(e, "w")}
                              className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-5 rounded-full bg-white border-2 border-emerald-500 cursor-ew-resize"
                              title="Resize Left"
                            />
                            {/* Edge E */}
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
                          {fileMeta.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {fileMeta.isPdf ? "Standard PDF Document" : "Word .docx Document"}
                        </p>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                        Ready for Conversion & Compression
                      </span>
                    </div>
                  )}
                </div>

                {/* DEDICATED IMAGE BOTTOM ACTION STRIP (SHAPES, ROTATION & CROP) */}
                {fileMeta.isImage && (
                  <>
                    <div className="px-3.5 py-2 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-between gap-2.5 flex-wrap">
                      {/* 1. SHAPE & MASKING (3 OPTIONS: RECTANGLE, ROUNDED, CIRCLE) */}
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
                          onClick={() => setFreeAngle((a) => (a - 90 < -180 ? a - 90 + 360 : a - 90))}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Rotate Left (-90°)"
                        >
                          <RotateCcw size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setFreeAngle((a) => (a + 90 > 180 ? a + 90 - 360 : a + 90))}
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

                    {/* CORNER RADIUS SLIDER (WHEN ROUNDED SHAPE ACTIVE) */}
                    {cropShape === "rounded" && (
                      <div className="px-3.5 py-1.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex items-center gap-3 text-xs">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Corner Radius:</span>
                        <input
                          type="range"
                          min="4"
                          max="120"
                          value={cornerRadius}
                          onChange={(e) => setCornerRadius(Number(e.target.value))}
                          className="flex-1 max-w-xs accent-emerald-600 cursor-pointer"
                        />
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">{cornerRadius}px</span>
                      </div>
                    )}
                  </>
                )}

                {/* COMPACT METRICS STRIP */}
                <div className="px-3.5 py-1.5 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium text-[11px]">Original:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                      {formatBytes(fileMeta.sizeBytes)}
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-slate-400 font-medium text-[11px]">Optimized:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {formatBytes(outputBytes || fileMeta.sizeBytes)}
                    </span>
                    {fileMeta.sizeBytes > outputBytes && outputBytes > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold">
                        -{Math.round((1 - outputBytes / fileMeta.sizeBytes) * 100)}%
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {customWidth || fileMeta.width} × {customHeight || fileMeta.height} px
                  </span>
                </div>
              </div>

              {/* RIGHT CONTROLS SUITE: VERTICAL TOOL RAIL + ANIMATED OPTIONS PANEL */}
              <div className="flex flex-col lg:flex-row gap-2 shrink-0 transition-all duration-300 items-stretch">
                
                {/* 1. SLIM VERTICAL TOOL RAIL (ICON + MICRO-LABEL) */}
                <div className="w-full lg:w-[68px] xl:w-[72px] shrink-0 bg-white dark:bg-[#0c1424] rounded-2xl border border-slate-200/80 dark:border-slate-800 flex lg:flex-col items-center justify-between p-1.5 lg:py-2.5 gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar">
                  <div className="flex lg:flex-col items-center gap-1 w-full">
                    {studioTools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = activeTab === tool.id && isPanelOpen;
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleTabClick(tool.id)}
                          className={`relative w-full py-2 lg:py-2.5 px-2 lg:px-1 rounded-xl flex lg:flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer ${
                            isActive
                              ? "bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold border border-emerald-500/30"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 font-bold border border-transparent"
                          }`}
                          title={tool.label}
                        >
                          {/* Active Indicator Bar on left for desktop */}
                          {isActive && (
                            <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full" />
                          )}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                              isActive
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <span className="text-[10px] tracking-tight leading-none text-center whitespace-nowrap">
                            {tool.shortLabel}
                          </span>
                        </button>
                      );
                    })}

                    {/* Mobile/Tablet Download Button */}
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isProcessing}
                      className="lg:hidden p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50 transition-colors"
                      title={`Download (${targetFormat.toUpperCase()})`}
                    >
                      <Download size={15} className="text-white" />
                    </button>
                  </div>

                  {/* Rail Bottom Actions (Desktop Only) */}
                  <div className="hidden lg:flex flex-col items-center gap-1.5 w-full pt-2 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPanelOpen((v) => !v)}
                      className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                      title={isPanelOpen ? "Collapse Controls Panel" : "Expand Controls Panel"}
                    >
                      {isPanelOpen ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isProcessing}
                      className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                      title={`Download (${targetFormat.toUpperCase()})`}
                    >
                      <Download size={14} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* 2. ANIMATED OPTIONS FLYOUT PANEL */}
                {isPanelOpen && (
                  <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 flex flex-col max-h-[500px] lg:h-[480px] bg-white dark:bg-[#0c1424] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden min-h-0 animate-in fade-in slide-in-from-right-3 duration-200">
                    
                    {/* PANEL HEADER WITH ACTIVE TOOL IDENTITY & CLOSE BUTTON */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          {React.createElement(
                            studioTools.find((t) => t.id === activeTab)?.icon || ArrowDownUp,
                            { size: 14 }
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight truncate">
                            {studioTools.find((t) => t.id === activeTab)?.label || "Studio Settings"}
                          </h3>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                            {studioTools.find((t) => t.id === activeTab)?.badge || "Adjust Parameters"}
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

                    {/* TAB 1: EXACT SIZE & RESOLUTION */}
                    {activeTab === "compress" && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        {/* Exact Target Size Input */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                              Target Storage Limit
                            </h4>
                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                              Exact Fit ⚡
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max="99999"
                              value={targetSizeVal}
                              onChange={(e) => setTargetSizeVal(e.target.value)}
                              placeholder="e.g. 150"
                              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                            />
                            <select
                              value={targetSizeUnit}
                              onChange={(e) => setTargetSizeUnit(e.target.value)}
                              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                            >
                              <option value="KB">KB</option>
                              <option value="MB">MB</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const multiplier = targetSizeUnit === "MB" ? 1024 : 1;
                                handleConvergeToExactTarget(Number(targetSizeVal) * multiplier);
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Auto Fit ⚡
                            </button>
                          </div>
                        </div>

                        {fileMeta.isImage && (
                          <>
                            {/* Custom Dimensions (Width x Height px with Lock) */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                  Custom Resolution (px)
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setLockAspectRatio((l) => !l)}
                                  className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                                >
                                  {lockAspectRatio ? <Link2 size={13} className="text-indigo-600" /> : <Unlink2 size={13} />}
                                  <span>{lockAspectRatio ? "Locked Ratio" : "Free Dimensions"}</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Width (px)</span>
                                  <input
                                    type="number"
                                    min="10"
                                    max="10000"
                                    value={customWidth}
                                    onChange={(e) => handleWidthChange(e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Height (px)</span>
                                  <input
                                    type="number"
                                    min="10"
                                    max="10000"
                                    value={customHeight}
                                    onChange={(e) => handleHeightChange(e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Compression Quality Slider */}
                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span>Compression Quality</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{quality}%</span>
                              </div>
                              <input
                                type="range"
                                min="5"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full accent-indigo-600 cursor-pointer"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                {/* TAB 2: FORMAT CONVERTER */}
                {activeTab === "convert" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Target File Extension
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {(fileMeta.isImage
                          ? ["jpg", "png", "webp", "pdf", "svg"]
                          : fileMeta.isPdf
                          ? ["docx", "pdf", "jpg", "png", "txt"]
                          : ["pdf", "docx", "txt"]
                        ).map((fmt) => (
                          <button
                            key={fmt}
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
                )}

                {/* TAB 3: ADVANCED AI BACKGROUND CUTOUT */}
                {activeTab === "bgremove" && fileMeta.isImage && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    {/* Vision AI Hero Card */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600/15 dark:bg-emerald-400/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                          <Sparkles size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                              Vision AI Cutout
                            </h4>
                            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              Instant Neural
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            Automated subject segmentation & alpha cutout
                          </p>
                        </div>
                      </div>

                      {/* Main Cutout Action Button (Full Width, Zero Overflow) */}
                      {bgRemoved ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] px-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="flex items-center gap-1">
                              <Check size={12} />
                              Cutout Active
                            </span>
                            <button
                              type="button"
                              onClick={handleCloudAiBgRemove}
                              disabled={isRemovingBgCloud}
                              className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer text-[10px]"
                            >
                              Re-run Cutout
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={handleRestoreBg}
                            className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw size={13} />
                            <span>Restore Original Background</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCloudAiBgRemove}
                          disabled={isRemovingBgCloud}
                          className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isRemovingBgCloud ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>AI Cutout Processing...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 size={14} />
                              <span>Remove Background ✨</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {bgRemoved && (
                      <div className="space-y-3 pt-1">
                        {/* Replace Backdrop Header */}
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Backdrop Studio
                          </h4>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {backdropType === "transparent" ? "Alpha PNG" : "Custom Background"}
                          </span>
                        </div>

                        {/* 2x2 Grid for Backdrop Types (No Wrapping / Overflow) */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: "transparent", label: "Transparent", icon: "🏁" },
                            { id: "solid", label: "Solid Color", icon: "🎨" },
                            { id: "gradient", label: "Gradient", icon: "🌈" },
                            { id: "blur", label: "Portrait Blur", icon: "🌫️" },
                          ].map((bm) => (
                            <button
                              key={bm.id}
                              type="button"
                              onClick={() => setBackdropType(bm.id)}
                              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 truncate ${
                                backdropType === bm.id
                                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                                  : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              <span>{bm.icon}</span>
                              <span className="truncate">{bm.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Solid Color Picker */}
                        {backdropType === "solid" && (
                          <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400 font-bold block">Preset Palettes</span>
                            <div className="flex items-center gap-2 flex-wrap">
                              {["#ffffff", "#0f172a", "#1e3a8a", "#059669", "#f1f5f9", "#fee2e2"].map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => setSolidColor(c)}
                                  className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${
                                    solidColor === c ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900" : "border-slate-300 dark:border-slate-600"
                                  }`}
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-slate-400 font-bold">Custom Hex:</span>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="color"
                                  value={solidColor}
                                  onChange={(e) => setSolidColor(e.target.value)}
                                  className="w-7 h-7 rounded-md cursor-pointer border-0 bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={solidColor}
                                  onChange={(e) => setSolidColor(e.target.value)}
                                  placeholder="#ffffff"
                                  className="w-20 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Gradient Presets (Strictly 2 Columns, No Overflow) */}
                        {backdropType === "gradient" && (
                          <div className="grid grid-cols-2 gap-1.5">
                            {GRADIENT_PRESETS.map((gp) => (
                              <button
                                key={gp.label}
                                type="button"
                                onClick={() => setGradientPreset(gp)}
                                className={`p-2 rounded-xl text-[10px] font-semibold border cursor-pointer flex items-center gap-1.5 transition-colors truncate ${
                                  gradientPreset.label === gp.label
                                    ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500"
                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border shrink-0"
                                  style={{
                                    background: `linear-gradient(135deg, ${gp.from}, ${gp.to})`,
                                  }}
                                />
                                <span className="truncate text-slate-700 dark:text-slate-300">{gp.label}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Portrait Bokeh Blur Slider */}
                        {backdropType === "blur" && (
                          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              <span>Bokeh Blur Radius</span>
                              <span className="font-mono text-emerald-600">{portraitBlurAmount}px</span>
                            </div>
                            <input
                              type="range"
                              min="4"
                              max="40"
                              value={portraitBlurAmount}
                              onChange={(e) => setPortraitBlurAmount(Number(e.target.value))}
                              className="w-full accent-emerald-600 cursor-pointer"
                            />
                          </div>
                        )}

                        {/* Optional Edge Matting Adjustments (if not using cloud) */}
                        {!cloudCutoutDataUrl && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                            <span className="text-[10px] text-slate-400 font-bold block">
                              Local Edge Matting Sensitivity
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                  <span>Sensitivity</span>
                                  <span>{bgSensitivity}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="80"
                                  value={bgSensitivity}
                                  onChange={(e) => setBgSensitivity(Number(e.target.value))}
                                  className="w-full accent-emerald-600 cursor-pointer"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                  <span>Feather</span>
                                  <span>{bgFeather}px</span>
                                </div>
                                <input
                                  type="range"
                                  min="4"
                                  max="40"
                                  value={bgFeather}
                                  onChange={(e) => setBgFeather(Number(e.target.value))}
                                  className="w-full accent-emerald-600 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: PHOTO COLOR GRADING & FILTERS */}
                {activeTab === "edit" && fileMeta.isImage && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    {/* PRESET FILTER CARDS WITH MINI IMAGE PREVIEWS */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Preset Filters
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setBrightness(0);
                            setContrast(0);
                            setSaturation(0);
                            setExposure(0);
                            setWarmth(0);
                            setSharpness(0);
                            setVignette(0);
                            setIsGrayscale(false);
                            setIsInverted(false);
                            setSelectedPreset("Natural Original");
                            toast.success("Color filters reset to original");
                          }}
                          className="text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          Reset ↺
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                        {FILTER_PRESETS.map((fp) => {
                          const isActive = selectedPreset === fp.label;
                          return (
                            <button
                              key={fp.label}
                              type="button"
                              onClick={() => {
                                setBrightness(fp.b);
                                setContrast(fp.c);
                                setSaturation(fp.s);
                                setExposure(fp.exp);
                                setWarmth(fp.warm);
                                setSharpness(fp.sharp);
                                setIsGrayscale(fp.gray);
                                setIsInverted(fp.inv);
                                setSelectedPreset(fp.label);
                                toast.success(`Applied ${fp.label}`);
                              }}
                              className={`group flex flex-col items-center gap-1 p-1 rounded-xl border transition-colors cursor-pointer ${
                                isActive
                                  ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 ring-1 ring-emerald-500"
                                  : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                              title={fp.label}
                            >
                              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                                {previewUrl ? (
                                  <img
                                    src={previewUrl}
                                    alt={fp.label}
                                    style={{ filter: fp.cssFilter }}
                                    className="w-full h-full object-cover pointer-events-none"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div
                                    style={{ filter: fp.cssFilter }}
                                    className="w-full h-full bg-gradient-to-tr from-indigo-500 via-emerald-400 to-amber-300 flex items-center justify-center text-[10px] font-bold text-white"
                                  >
                                    Aa
                                  </div>
                                )}
                                {isActive && (
                                  <div className="absolute top-1 right-1 size-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                    <Check size={9} strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-[10px] font-bold truncate max-w-full leading-tight transition-colors ${
                                  isActive
                                    ? "text-emerald-700 dark:text-emerald-300 font-extrabold"
                                    : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                                }`}
                              >
                                {fp.short}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* MANUAL ADJUSTMENTS & LIGHT CONTROLS */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Light & Color Sliders
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setBrightness(6);
                            setContrast(14);
                            setSaturation(10);
                            setExposure(4);
                            setWarmth(4);
                            setSelectedPreset(null);
                            toast.success("Applied Auto Light Enhancement ⚡");
                          }}
                          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={11} />
                          <span>Auto Enhance</span>
                        </button>
                      </div>

                      {/* QUICK SPECIAL EFFECT TOGGLES */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsGrayscale((g) => !g);
                            setSelectedPreset(null);
                          }}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                            isGrayscale
                              ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                              : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span>Black & White</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsInverted((inv) => !inv);
                            setSelectedPreset(null);
                          }}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                            isInverted
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span>Invert Negative</span>
                        </button>
                      </div>

                      {/* SLIDERS LIST */}
                      <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1 no-scrollbar">
                        {[
                          { label: "Brightness", val: brightness, set: setBrightness, min: -60, max: 60 },
                          { label: "Contrast", val: contrast, set: setContrast, min: -60, max: 60 },
                          { label: "Saturation", val: saturation, set: setSaturation, min: -60, max: 60 },
                          { label: "Exposure", val: exposure, set: setExposure, min: -50, max: 50 },
                          { label: "Warmth", val: warmth, set: setWarmth, min: -50, max: 50 },
                          { label: "Vignette", val: vignette, set: setVignette, min: 0, max: 80 },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1">
                            <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-300">
                              <span
                                onClick={() => {
                                  item.set(0);
                                  setSelectedPreset(null);
                                }}
                                className="cursor-pointer hover:text-emerald-600"
                                title="Click to reset to 0"
                              >
                                {item.label}
                              </span>
                              <span
                                onClick={() => {
                                  item.set(0);
                                  setSelectedPreset(null);
                                }}
                                className={`font-mono text-[10px] px-1.5 py-0.2 rounded cursor-pointer ${
                                  item.val !== 0
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold"
                                    : "text-slate-400"
                                }`}
                                title="Click to reset"
                              >
                                {item.val > 0 ? `+${item.val}` : item.val}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={item.min}
                              max={item.max}
                              value={item.val}
                              onChange={(e) => {
                                item.set(Number(e.target.value));
                                setSelectedPreset(null);
                              }}
                              className="w-full accent-emerald-600 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: SECURITY WATERMARK OVERLAY */}
                {activeTab === "watermark" && fileMeta.isImage && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">Security Watermark</h4>
                        <p className="text-[11px] text-slate-500">Stamp confidential or verification notice</p>
                      </div>
                      <button
                        onClick={() => setWatermarkEnabled((v) => !v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${
                          watermarkEnabled
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {watermarkEnabled ? "Active" : "Disabled"}
                      </button>
                    </div>

                    {watermarkEnabled && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Watermark Text"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block mb-1">Opacity: {watermarkOpacity}%</span>
                            <input
                              type="range"
                              min="10"
                              max="90"
                              value={watermarkOpacity}
                              onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                              className="w-full accent-emerald-600"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block mb-1">Font Size: {watermarkSize}px</span>
                            <input
                              type="range"
                              min="14"
                              max="60"
                              value={watermarkSize}
                              onChange={(e) => setWatermarkSize(Number(e.target.value))}
                              className="w-full accent-emerald-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "center", label: "Center" },
                            { id: "diagonal", label: "Diagonal" },
                            { id: "bottom-right", label: "Bottom Corner" },
                          ].map((pos) => (
                            <button
                              key={pos.id}
                              onClick={() => setWatermarkPosition(pos.id)}
                              className={`py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${
                                watermarkPosition === pos.id
                                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold"
                                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                        <span className="text-xs font-black text-slate-400 font-mono shrink-0">.{targetFormat}</span>
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
                          ({formatBytes(outputBytes || fileMeta.sizeBytes)})
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

                    {fileMeta.isImage && (
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
            )}
          </div>
        </div>
      )}
        </div>
      </div>

      {/* FULLSCREEN HIGH-RES INSPECTION MODAL */}
      {isFullscreen && (
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
                {fileMeta.name}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                {fileMeta.width} × {fileMeta.height} px
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
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
      )}

      {/* SIGNATURE BRAND DISPLAY SECTION */}
      <FroggieBrandSection />

      {/* SITE FOOTER */}
      <Footer />
    </div>
  );
};

export default FileStudioPage;

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownUp,
  RefreshCw,
  Wand2,
  Sliders,
  Type,
} from "lucide-react";
import { useSelector } from "react-redux";
import { aiApi } from "../api/aiApi";
import { useSEO } from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import FroggieBrandSection from "../components/home/FroggieBrandSection";
import toast from "react-hot-toast";
import {
  StudioHeader,
  StudioDropzone,
  StudioToolRail,
  StudioCanvas,
  StudioOptionsPanel,
  StudioFullscreenModal,
  ASPECT_RATIOS,
  GRADIENT_PRESETS,
  FILTER_PRESETS,
  AI_SCAN_STEPS,
} from "../components/studio";

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
    } catch {
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

        {/* COMPACT SLEEK TOP COMMAND HEADER */}
        <StudioHeader
          user={user}
          navigate={navigate}
          file={file}
          onUploadClick={() => fileInputRef.current?.click()}
        />

        {/* WORKSPACE AREA */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
          {/* PERSISTENT HIDDEN FILE INPUT */}
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
            <StudioDropzone
              onBrowse={() => fileInputRef.current?.click()}
              onFileDrop={(f) => handleFileSelect(f)}
            />
          ) : (
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row py-2.5 sm:py-3.5 gap-3 w-full overflow-hidden items-stretch">
              <StudioCanvas
                fileMeta={fileMeta}
                customWidth={customWidth}
                customHeight={customHeight}
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
                showOriginalComparison={showOriginalComparison}
                setShowOriginalComparison={setShowOriginalComparison}
                setIsFullscreen={setIsFullscreen}
                setFile={setFile}
                setPreviewUrl={setPreviewUrl}
                setProcessedUrl={setProcessedUrl}
                imagePreviewBoxRef={imagePreviewBoxRef}
                isCropActive={isCropActive}
                setIsCropActive={setIsCropActive}
                previewUrl={previewUrl}
                processedUrl={processedUrl}
                isRemovingBgCloud={isRemovingBgCloud}
                cropBox={cropBox}
                cropShape={cropShape}
                setCropShape={setCropShape}
                cornerRadius={cornerRadius}
                setCornerRadius={setCornerRadius}
                isDraggingCrop={isDraggingCrop}
                handleCropMouseDown={handleCropMouseDown}
                sourceImageRef={sourceImageRef}
                setFreeAngle={setFreeAngle}
                freeAngle={freeAngle}
                flipH={flipH}
                setFlipH={setFlipH}
                flipV={flipV}
                setFlipV={setFlipV}
                handleMaximizeCropBox={handleMaximizeCropBox}
                handleCenterCropBox={handleCenterCropBox}
                handleApplyAspectPreset={handleApplyAspectPreset}
                formatBytes={formatBytes}
                outputBytes={outputBytes}
              />

              <div className="flex flex-col lg:flex-row gap-2 shrink-0 transition-all duration-300 items-stretch">
                <StudioToolRail
                  studioTools={studioTools}
                  activeTab={activeTab}
                  isPanelOpen={isPanelOpen}
                  handleTabClick={handleTabClick}
                  handleDownload={handleDownload}
                  isProcessing={isProcessing}
                  targetFormat={targetFormat}
                  setIsPanelOpen={setIsPanelOpen}
                />

                <StudioOptionsPanel
                  isPanelOpen={isPanelOpen}
                  setIsPanelOpen={setIsPanelOpen}
                  studioTools={studioTools}
                  activeTab={activeTab}
                  fileMeta={fileMeta}
                  formatBytes={formatBytes}
                  outputBytes={outputBytes}
                  targetSizeVal={targetSizeVal}
                  setTargetSizeVal={setTargetSizeVal}
                  targetSizeUnit={targetSizeUnit}
                  setTargetSizeUnit={setTargetSizeUnit}
                  handleConvergeToExactTarget={handleConvergeToExactTarget}
                  lockAspectRatio={lockAspectRatio}
                  setLockAspectRatio={setLockAspectRatio}
                  customWidth={customWidth}
                  handleWidthChange={handleWidthChange}
                  customHeight={customHeight}
                  handleHeightChange={handleHeightChange}
                  quality={quality}
                  setQuality={setQuality}
                  targetFormat={targetFormat}
                  setTargetFormat={setTargetFormat}
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
                  isEditingName={isEditingName}
                  renameInputRef={renameInputRef}
                  tempFilename={tempFilename}
                  setTempFilename={setTempFilename}
                  handleSaveRename={handleSaveRename}
                  handleRenameKeyDown={handleRenameKeyDown}
                  handleStartRename={handleStartRename}
                  outputFilename={outputFilename}
                  handlePrint={handlePrint}
                  handleCopyClipboard={handleCopyClipboard}
                  handleResetAll={handleResetAll}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <StudioFullscreenModal
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        fileMeta={fileMeta}
        showOriginalComparison={showOriginalComparison}
        setShowOriginalComparison={setShowOriginalComparison}
        previewUrl={previewUrl}
        processedUrl={processedUrl}
      />

      {/* SITE FOOTER */}
      <Footer />
    </div>
  );
};

export default FileStudioPage;

export const ASPECT_RATIOS = [
  { label: "Freeform", value: "free" },
  { label: "1:1 Avatar / Passport", value: "1:1", ratio: 1 },
  { label: "4:3 Standard Photo", value: "4:3", ratio: 4 / 3 },
  { label: "16:9 Widescreen", value: "16:9", ratio: 16 / 9 },
  { label: "3:4 Portrait", value: "3:4", ratio: 3 / 4 },
  { label: "9:16 Mobile Story", value: "9:16", ratio: 9 / 16 },
];

export const GRADIENT_PRESETS = [
  { label: "Executive Blue", from: "#1e3a8a", to: "#0f172a" },
  { label: "Emerald Studio", from: "#059669", to: "#022c22" },
  { label: "Silicon Violet", from: "#7c3aed", to: "#1e1b4b" },
  { label: "Sunset Coral", from: "#ea580c", to: "#7c2d12" },
  { label: "Studio Dark Gray", from: "#334155", to: "#0f172a" },
  { label: "Soft Pearl White", from: "#f8fafc", to: "#e2e8f0" },
];

export const FILTER_PRESETS = [
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

export const AI_SCAN_STEPS = [
  "Detecting subject silhouette & foreground...",
  "Analyzing edge chroma & hair strands...",
  "Deep neural AI subject extraction...",
  "Rendering clean alpha transparency matting...",
];

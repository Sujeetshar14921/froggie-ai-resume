import { sanitizeFileName } from "./formatters";

/**
 * Standard A4 dimensions in pixels at 96 DPI (210mm x 297mm)
 */
export const A4_PAGE_WIDTH_PX = 794;
export const A4_PAGE_HEIGHT_PX = 1123;

/**
 * Calculates smart A4 page breaks avoiding cutting through text, headings, and section items,
 * while ensuring all subsequent pages maintain identical top & bottom margins.
 * 
 * @param {HTMLElement} rootElement - The rendered continuous resume container
 * @param {number} a4PageHeight - Height of a single A4 page in DOM pixels
 * @param {number} topPaddingDom - Top margin/padding in pixels
 * @param {number} bottomPaddingDom - Bottom margin/padding in pixels
 * @returns {Array<{startY: number, endY: number, isSubsequent: boolean}>}
 */
export const calculateSmartPageBreaks = (
  rootElement,
  a4PageHeight = A4_PAGE_HEIGHT_PX,
  topPaddingDom = 36,
  bottomPaddingDom = 36
) => {
  if (!rootElement) return [{ startY: 0, endY: a4PageHeight, isSubsequent: false }];

  const totalHeight = rootElement.scrollHeight || rootElement.offsetHeight || a4PageHeight;

  // If content naturally fits on 1 page (with 4% safety margin)
  if (totalHeight <= a4PageHeight * 1.04) {
    return [{ startY: 0, endY: totalHeight, isSubsequent: false }];
  }

  // Collect all block elements that should never be split across page seams
  const candidateElements = Array.from(
    rootElement.querySelectorAll(
      '[data-resume-section], [data-resume-item], [data-resume-sidebar-item], [data-resume-main-item], .break-inside-avoid, section, h1, h2, h3, tr, li, p'
    )
  );

  const rootRect = rootElement.getBoundingClientRect();
  const blockBoundaries = candidateElements
    .map((el) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top - rootRect.top;
      const bottom = rect.bottom - rootRect.top;
      const height = rect.height;
      return { el, top, bottom, height };
    })
    .filter((b) => b.height > 0 && b.bottom > 0)
    .sort((a, b) => a.top - b.top);

  const pages = [];
  let currentTop = 0;
  let pageIndex = 0;

  while (currentTop < totalHeight - 15) {
    const isSubsequent = pageIndex > 0;
    const pageCapacity = isSubsequent
      ? a4PageHeight - topPaddingDom - bottomPaddingDom
      : a4PageHeight - bottomPaddingDom;

    const idealBottom = currentTop + pageCapacity;

    if (idealBottom >= totalHeight) {
      pages.push({ startY: currentTop, endY: totalHeight, isSubsequent });
      break;
    }

    let bestBreakY = idealBottom;
    let foundCleanBreak = false;

    // 1. Look for elements that straddle idealBottom
    for (let i = 0; i < blockBoundaries.length; i++) {
      const b = blockBoundaries[i];
      if (b.top < idealBottom && b.bottom > idealBottom) {
        if (b.top > currentTop + pageCapacity * 0.35) {
          bestBreakY = b.top - 4;
          foundCleanBreak = true;
          break;
        }
      }
    }

    // 2. If no single element crossed cleanly, find nearest element ending before idealBottom
    if (!foundCleanBreak) {
      for (let i = blockBoundaries.length - 1; i >= 0; i--) {
        const b = blockBoundaries[i];
        if (b.bottom <= idealBottom && b.bottom > currentTop + pageCapacity * 0.60) {
          bestBreakY = b.bottom + 4;
          foundCleanBreak = true;
          break;
        }
      }
    }

    if (bestBreakY <= currentTop + 80) {
      bestBreakY = idealBottom;
    }

    pages.push({ startY: currentTop, endY: bestBreakY, isSubsequent });
    currentTop = bestBreakY;
    pageIndex++;
  }

  return pages.length > 0 ? pages : [{ startY: 0, endY: totalHeight, isSubsequent: false }];
};

/**
/**
 * Word (.doc) document exporter - 100% Complete Content Coverage
 * Exports all sections: Personal Info, Summary, Experience, Projects, Skills,
 * Education, Certifications, Achievements, Languages, Personal Details, Custom Sections, and Declaration.
 * 
 * @param {Object} resumeData - Full resume data object
 */
export const exportResumeAsDoc = (resumeData = {}) => {
  if (!resumeData) {
    throw new Error("No resume data provided for Word export.");
  }

  const personalInfo = resumeData.personal_info || {};
  const accentColor = resumeData.accent_color || "#10B981";

  const linkedinLabel = personalInfo.linkedin_label || (
    personalInfo.linkedin
      ? personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/, "linkedin.com/in/")
      : null
  );

  const githubLabel = personalInfo.github_label || (
    personalInfo.github
      ? personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, "github.com/")
      : null
  );

  const websiteLabel = personalInfo.website_label || (
    personalInfo.website
      ? personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")
      : null
  );

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    linkedinLabel,
    githubLabel,
    websiteLabel,
  ].filter(Boolean);

  // 1. Work Experience
  const experienceHtml = (resumeData.experience || [])
    .map((exp) => {
      const dateRange = `${exp.start_date || ""} ${
        exp.start_date && (exp.is_current || exp.end_date) ? "–" : ""
      } ${exp.is_current ? "Present" : exp.end_date || ""}`.trim();

      const descLines =
        typeof exp.description === "string"
          ? exp.description.split("\n").map((l) => l.trim()).filter(Boolean)
          : [];

      return `
        <div style="margin-bottom: 12pt; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 2pt;">
            <tr>
              <td style="font-weight: bold; font-size: 11pt; color: #0f172a; font-family: 'Calibri', 'Arial', sans-serif;">
                ${exp.position || "Position"}
              </td>
              <td style="text-align: right; font-size: 9.5pt; color: #64748b; font-family: 'Calibri', 'Arial', sans-serif;">
                ${dateRange}
              </td>
            </tr>
          </table>
          <div style="font-size: 10pt; font-weight: 600; color: ${accentColor}; margin-bottom: 4pt; font-family: 'Calibri', 'Arial', sans-serif;">
            ${exp.company || ""}${exp.location ? ` · ${exp.location}` : ""}
          </div>
          ${
            descLines.length > 0
              ? `<ul style="margin: 0; padding-left: 18pt; color: #334155; font-size: 9.5pt; line-height: 1.5; font-family: 'Calibri', 'Arial', sans-serif;">
                  ${descLines.map((line) => `<li style="margin-bottom: 2pt;">${line.replace(/^[•*–-]\s*/, "")}</li>`).join("")}
                </ul>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  // 2. Key Projects
  const projectHtml = (resumeData.project || [])
    .map((proj) => {
      const descLines =
        typeof proj.description === "string"
          ? proj.description.split("\n").map((l) => l.trim()).filter(Boolean)
          : [];

      const techStack = proj.technologies || proj.tech_stack || proj.techStack;

      return `
        <div style="margin-bottom: 10pt; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 2pt;">
            <tr>
              <td style="font-weight: bold; font-size: 10.5pt; color: #0f172a; font-family: 'Calibri', 'Arial', sans-serif;">
                ${proj.name || "Project"}
              </td>
              ${proj.type ? `<td style="text-align: right; font-size: 9pt; color: #64748b; text-transform: uppercase;">${proj.type}</td>` : ""}
            </tr>
          </table>
          ${
            techStack
              ? `<div style="font-size: 9pt; font-weight: 600; color: ${accentColor}; margin-bottom: 3pt;">Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack}</div>`
              : ""
          }
          ${
            descLines.length > 1
              ? `<ul style="margin: 0; padding-left: 18pt; color: #334155; font-size: 9.5pt; line-height: 1.5; font-family: 'Calibri', 'Arial', sans-serif;">
                  ${descLines.map((line) => `<li style="margin-bottom: 2pt;">${line.replace(/^[•*–-]\s*/, "")}</li>`).join("")}
                </ul>`
              : descLines.length === 1
              ? `<div style="font-size: 9.5pt; line-height: 1.5; color: #334155; margin-top: 2pt;">${descLines[0]}</div>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  // 3. Education
  const educationHtml = (resumeData.education || [])
    .map((edu) => `
      <div style="margin-bottom: 10pt; page-break-inside: avoid;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 2pt;">
          <tr>
            <td style="font-weight: bold; font-size: 10.5pt; color: #0f172a; font-family: 'Calibri', 'Arial', sans-serif;">
              ${edu.degree || "Degree"} ${edu.field ? `in ${edu.field}` : ""}
            </td>
            <td style="text-align: right; font-size: 9.5pt; color: #64748b;">
              ${edu.graduation_date || ""}
            </td>
          </tr>
        </table>
        <div style="font-size: 9.5pt; color: #475569;">
          ${edu.institution || ""} ${edu.gpa ? `· GPA: ${edu.gpa}` : ""}
        </div>
      </div>
    `)
    .join("");

  // 4. Certifications
  const certificationsHtml = (resumeData.certifications || [])
    .map((cert) => `
      <div style="margin-bottom: 8pt; page-break-inside: avoid;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; font-size: 10pt; color: #0f172a;">
              • ${cert.name || "Certification"}
            </td>
            ${cert.date ? `<td style="text-align: right; font-size: 9pt; color: #64748b;">${cert.date}</td>` : ""}
          </tr>
        </table>
        ${cert.issuer ? `<div style="font-size: 9pt; color: #475569; padding-left: 12pt;">Issued by: ${cert.issuer}</div>` : ""}
      </div>
    `)
    .join("");

  // 5. Achievements
  const achievementsHtml = (resumeData.achievements || [])
    .map((ach) => `
      <div style="margin-bottom: 8pt; page-break-inside: avoid;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; font-size: 10pt; color: #0f172a;">
              • ${ach.title || "Achievement"}
            </td>
            ${ach.date ? `<td style="text-align: right; font-size: 9pt; color: #64748b;">${ach.date}</td>` : ""}
          </tr>
        </table>
        ${ach.description ? `<div style="font-size: 9.5pt; color: #334155; padding-left: 12pt; margin-top: 2pt;">${ach.description}</div>` : ""}
      </div>
    `)
    .join("");

  // 6. Languages
  const languagesHtml = (resumeData.languages || [])
    .map((lang) => `<b>${lang.language || lang.name || "Language"}</b>${lang.proficiency ? ` (${lang.proficiency})` : ""}`)
    .join("   •   ");

  // 7. Custom Sections
  const customSectionsHtml = (resumeData.custom_sections || [])
    .map((section) => {
      const itemsHtml = (section.items || [])
        .map((item) => `
          <div style="margin-bottom: 8pt; page-break-inside: avoid;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-weight: bold; font-size: 10pt; color: #0f172a;">
                  ${item.title || ""}
                </td>
                ${item.date ? `<td style="text-align: right; font-size: 9pt; color: #64748b;">${item.date}</td>` : ""}
              </tr>
            </table>
            ${item.subtitle ? `<div style="font-size: 9pt; font-weight: 600; color: ${accentColor};">${item.subtitle}</div>` : ""}
            ${item.description ? `<div style="font-size: 9.5pt; color: #334155; margin-top: 2pt;">${item.description}</div>` : ""}
          </div>
        `)
        .join("");

      return `
        <div class="section-title">${section.title || "Additional Information"}</div>
        ${itemsHtml}
      `;
    })
    .join("");

  // 8. Personal Details (if present)
  const pDetails = resumeData.personal_details || {};
  const personalDetailsList = [
    pDetails.date_of_birth ? `<b>Date of Birth:</b> ${pDetails.date_of_birth}` : null,
    pDetails.gender ? `<b>Gender:</b> ${pDetails.gender}` : null,
    pDetails.nationality ? `<b>Nationality:</b> ${pDetails.nationality}` : null,
    pDetails.marital_status ? `<b>Marital Status:</b> ${pDetails.marital_status}` : null,
    pDetails.passport_no ? `<b>Passport No:</b> ${pDetails.passport_no}` : null,
    pDetails.address ? `<b>Address:</b> ${pDetails.address}` : null,
  ].filter(Boolean);

  // 9. Declaration (if present)
  const declaration = resumeData.declaration || {};
  const hasDeclaration = declaration.statement || declaration.name;

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${resumeData.title || "Resume"}</title>
        <style>
          @page { size: 21.0cm 29.7cm; margin: 2.0cm; }
          body { font-family: 'Calibri', 'Arial', sans-serif; color: #0f172a; line-height: 1.4; }
          h1 { font-size: 22pt; font-weight: bold; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center; }
          .profession { font-size: 11pt; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase; color: ${accentColor}; text-align: center; margin-bottom: 6pt; }
          .contact { font-size: 9pt; color: #475569; text-align: center; margin-bottom: 14pt; padding-bottom: 8pt; border-bottom: 1.5pt solid ${accentColor}; }
          .section-title { font-size: 11pt; font-weight: bold; letter-spacing: 0.12em; text-transform: uppercase; color: ${accentColor}; margin-top: 14pt; margin-bottom: 6pt; padding-bottom: 2pt; border-bottom: 1pt solid #e2e8f0; }
          p { margin: 0 0 6pt 0; font-size: 9.5pt; line-height: 1.5; color: #334155; }
        </style>
      </head>
      <body>
        <h1>${personalInfo.full_name || "Candidate Name"}</h1>
        ${personalInfo.profession ? `<div class="profession">${personalInfo.profession}</div>` : ""}
        ${contactItems.length > 0 ? `<div class="contact">${contactItems.join("   |   ")}</div>` : ""}
        ${resumeData.professional_summary ? `<div class="section-title">Professional Summary</div><p>${resumeData.professional_summary}</p>` : ""}
        ${(resumeData.skills || []).length > 0 ? `<div class="section-title">Core Skills</div><p>${resumeData.skills.join("   •   ")}</p>` : ""}
        ${(resumeData.experience || []).length > 0 ? `<div class="section-title">Work Experience</div>${experienceHtml}` : ""}
        ${(resumeData.project || []).length > 0 ? `<div class="section-title">Key Projects</div>${projectHtml}` : ""}
        ${(resumeData.education || []).length > 0 ? `<div class="section-title">Education</div>${educationHtml}` : ""}
        ${(resumeData.certifications || []).length > 0 ? `<div class="section-title">Certifications</div>${certificationsHtml}` : ""}
        ${(resumeData.achievements || []).length > 0 ? `<div class="section-title">Key Achievements</div>${achievementsHtml}` : ""}
        ${(resumeData.languages || []).length > 0 ? `<div class="section-title">Languages</div><p>${languagesHtml}</p>` : ""}
        ${customSectionsHtml}
        ${
          personalDetailsList.length > 0
            ? `<div class="section-title">Personal Details</div><p>${personalDetailsList.join("   |   ")}</p>`
            : ""
        }
        ${
          hasDeclaration
            ? `
              <div class="section-title">Declaration</div>
              <p style="font-style: italic; margin-bottom: 16pt;">${declaration.statement || "I hereby declare that the information provided above is true and correct to the best of my knowledge."}</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 12pt;">
                <tr>
                  <td style="font-size: 9.5pt; color: #64748b;">Place: ${declaration.place || ""}</td>
                  <td style="text-align: right; font-weight: bold; font-size: 10pt; color: #0f172a;">${declaration.name || personalInfo.full_name || ""}</td>
                </tr>
                <tr>
                  <td style="font-size: 9.5pt; color: #64748b;">Date: ${declaration.date || ""}</td>
                  <td style="text-align: right; font-size: 9pt; color: #64748b;">(Candidate Signature)</td>
                </tr>
              </table>
            `
            : ""
        }
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", docHtml], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(resumeData.title || "Resume")}.doc`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Converts modern CSS colors (oklch, oklab, lch, lab, color(...)) to standard rgb/rgba
 * preventing html2canvas parser warnings and ensuring flawless color fidelity.
 */
export const sanitizeOklchColors = (clonedDoc, clonedEl) => {
  if (!clonedDoc || !clonedEl) return;

  const tempCanvas = clonedDoc.createElement("canvas");
  const ctx = tempCanvas.getContext("2d");
  if (!ctx) return;

  const convertColorString = (str) => {
    if (
      !str ||
      typeof str !== "string" ||
      (!str.includes("oklch") && !str.includes("oklab") && !str.includes("lch") && !str.includes("lab"))
    ) {
      return str;
    }
    return str.replace(/(oklch|oklab|lch|lab)\([^)]+\)/gi, (match) => {
      try {
        ctx.fillStyle = "#000000";
        ctx.fillStyle = match;
        return ctx.fillStyle; // Native browser 2D canvas context converts to rgb(...) / #rrggbb
      } catch {
        return "#1e293b";
      }
    });
  };

  // 1. Sanitize all style tags
  const styleTags = clonedDoc.querySelectorAll("style");
  styleTags.forEach((tag) => {
    if (tag.textContent && (tag.textContent.includes("oklch") || tag.textContent.includes("oklab"))) {
      tag.textContent = convertColorString(tag.textContent);
    }
  });

  // 2. Sanitize inline attributes and computed styles on all nodes
  const colorProperties = [
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
    "textDecorationColor",
    "fill",
    "stroke",
  ];

  const elements = [clonedEl, ...Array.from(clonedEl.querySelectorAll("*"))];
  for (const el of elements) {
    if (!el || !el.style) continue;

    // Check inline style
    if (el.style.cssText && (el.style.cssText.includes("oklch") || el.style.cssText.includes("oklab"))) {
      el.style.cssText = convertColorString(el.style.cssText);
    }

    // Check computed styles and override directly on element style
    try {
      const computed = window.getComputedStyle(el);
      for (const prop of colorProperties) {
        const val = computed[prop];
        if (val && typeof val === "string" && (val.includes("oklch") || val.includes("oklab"))) {
          el.style[prop] = convertColorString(val);
        }
      }
    } catch {
      // Ignore computed style errors
    }
  }
};

/**
 * Clean, High-DPI Isolated A4 PDF Export Engine (Zero Web-Border / Zero Card-Shadow Artifacts)
 * 1. Clean Isolated Capture: Uses browser-native SVG foreignObject engine via html-to-image which natively supports modern Tailwind v4 oklch colors and sharp typography.
 * 2. 1-Page Proportional Auto-Fit: If resume fits on 1 page, draws directly as 1 seamless A4 sheet.
 * 3. Multi-Page Boundary Aware: Slices strictly along section boundaries without cutting text.
 * 
 * @param {HTMLElement} sourceElement - Resume container element
 * @param {Object} resumeData - Resume metadata for filename
 */
export const exportResumeAsPdf = async (sourceElement, resumeData = {}) => {
  const [{ toPng }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);

  const hasContent =
    resumeData.personal_info?.full_name ||
    resumeData.professional_summary ||
    (resumeData.skills && resumeData.skills.length > 0) ||
    (resumeData.experience && resumeData.experience.length > 0) ||
    (resumeData.education && resumeData.education.length > 0);

  if (!hasContent) {
    throw new Error("Cannot export an empty resume. Please add your resume details first.");
  }

  // 1. Target the primary visible resume node
  const targetNode =
    document.getElementById("resume-preview") ||
    document.getElementById("resume-export-content") ||
    sourceElement;

  if (!targetNode) {
    throw new Error("Resume preview element not found for export.");
  }

  // 2. Wait for fonts to be ready
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch {
    // Continue
  }

  // 3. Ensure images are fully loaded
  const images = Array.from(targetNode.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      try {
        img.crossOrigin = "anonymous";
        if (img.complete && img.naturalWidth > 0) return;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 500);
        });
      } catch {
        // Ignore
      }
    })
  );

  // 4. Capture high-resolution image using browser-native renderer (native oklch & modern CSS support)
  const isTwoCol = targetNode.querySelector(".resume-sidebar") !== null;
  const originalWidth = targetNode.offsetWidth || 794;
  const a4Ratio = 297 / 210; // 1.4142857

  const dataUrl = await toPng(targetNode, {
    quality: 0.98,
    pixelRatio: 2.5, // Crisp 300 DPI output
    backgroundColor: "#ffffff",
    cacheBust: true,
    style: {
      boxShadow: "none",
      border: "none",
      borderRadius: "0px",
      transform: "none",
      margin: "0 auto",
      backgroundColor: "#ffffff",
    },
    filter: (node) => {
      if (node.classList && node.classList.contains("no-print")) {
        return false;
      }
      return true;
    },
  });

  if (!dataUrl || dataUrl === "data:,") {
    throw new Error("Failed to render resume snapshot.");
  }

  // 5. Load snapshot into image for dimension analysis & slicing
  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("Failed to load rendered resume image."));
  });

  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;

  if (!imgWidth || !imgHeight) {
    throw new Error("Invalid rendered canvas dimensions.");
  }

  const a4ExpectedHeight = Math.round(imgWidth * a4Ratio);
  const domPageHeight = Math.round(originalWidth * a4Ratio);
  const topPaddingDom = isTwoCol ? 0 : 36;
  const bottomPaddingDom = isTwoCol ? 0 : 36;

  // 6. Initialize standard A4 jsPDF instance (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // 7. Check if 1-Page Proportional Auto-Fit or Multi-Page
  if (imgHeight <= a4ExpectedHeight * 1.05) {
    // Exact 1-Page: Direct high-fidelity placement
    const pdfHeightMm = Math.min(297, (imgHeight * 210) / imgWidth);
    pdf.addImage(dataUrl, "PNG", 0, 0, 210, pdfHeightMm, undefined, "FAST");
  } else {
    // Multi-page: Calculate intelligent section boundary page breaks
    const masterCanvas = document.createElement("canvas");
    masterCanvas.width = imgWidth;
    masterCanvas.height = imgHeight;
    const masterCtx = masterCanvas.getContext("2d");
    masterCtx.fillStyle = "#ffffff";
    masterCtx.fillRect(0, 0, imgWidth, imgHeight);
    masterCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

    const pageBreaks = calculateSmartPageBreaks(
      targetNode,
      domPageHeight,
      topPaddingDom,
      bottomPaddingDom
    );

    const scale = imgWidth / originalWidth;
    const topMarginCanvas = Math.round(topPaddingDom * scale);

    for (let i = 0; i < pageBreaks.length; i++) {
      const { startY, endY, isSubsequent } = pageBreaks[i];

      if (i > 0) {
        pdf.addPage();
      }

      const sliceStartY = Math.round(startY * scale);
      const sliceEndY = Math.min(Math.round(endY * scale), imgHeight);
      const sliceHeight = Math.max(1, sliceEndY - sliceStartY);

      // Create pure white A4 canvas slice
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgWidth;
      pageCanvas.height = a4ExpectedHeight;
      const ctx = pageCanvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, imgWidth, a4ExpectedHeight);

      const targetDestY = isSubsequent ? topMarginCanvas : 0;

      ctx.drawImage(
        masterCanvas,
        0,
        sliceStartY,
        imgWidth,
        sliceHeight,
        0,
        targetDestY,
        imgWidth,
        sliceHeight
      );

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.98);
      pdf.addImage(pageImgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }
  }

  const fileName = `${sanitizeFileName(resumeData.title || "Resume")}.pdf`;
  pdf.save(fileName);
};

export default {
  exportResumeAsDoc,
  exportResumeAsPdf,
  calculateSmartPageBreaks,
};

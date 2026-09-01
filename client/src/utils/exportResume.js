import { sanitizeFileName } from "./formatters";

/**
 * Standard A4 dimensions in pixels at 96 DPI
 */
export const A4_PAGE_WIDTH_PX = 794;
export const A4_PAGE_HEIGHT_PX = 1123;

/**
 * Calculates smart A4 page breaks avoiding cutting through text, headings, and section items,
 * while ensuring all subsequent pages maintain the exact same top & bottom margins as the first page.
 * 
 * @param {HTMLElement} rootElement - The rendered continuous resume container
 * @returns {Array<{startY: number, endY: number, isSubsequent: boolean}>}
 */
export const calculateSmartPageBreaks = (rootElement) => {
  if (!rootElement) return [{ startY: 0, endY: 1123, isSubsequent: false }];

  const rootRect = rootElement.getBoundingClientRect();
  const totalHeight = rootElement.scrollHeight || rootRect.height;
  const rootWidth = rootElement.offsetWidth || 794;

  // Exact A4 height in DOM pixels matching standard A4 ratio (297/210 = 1.4142857)
  const a4PageHeight = Math.round((rootWidth * 297) / 210); // ~1123px at 794px width

  // Detect top and bottom padding of the template to maintain identical top margins on all pages
  const computedStyle = window.getComputedStyle ? window.getComputedStyle(rootElement) : null;
  const topPaddingDom = computedStyle && parseFloat(computedStyle.paddingTop) > 0 ? parseFloat(computedStyle.paddingTop) : 36;
  const bottomPaddingDom = computedStyle && parseFloat(computedStyle.paddingBottom) > 0 ? parseFloat(computedStyle.paddingBottom) : 36;

  if (totalHeight <= a4PageHeight * 1.03) {
    // Fits on a single page
    return [{ startY: 0, endY: totalHeight, isSubsequent: false }];
  }

  // Collect all block elements that should not be split across page seams
  const candidateElements = Array.from(
    rootElement.querySelectorAll(
      '[data-resume-section], [data-resume-item], .break-inside-avoid, section, h1, h2, h3, tr, li, p'
    )
  );

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
    // On subsequent pages, available content capacity is reduced by topPaddingDom to reserve top margin
    const pageCapacity = isSubsequent
      ? a4PageHeight - topPaddingDom - bottomPaddingDom
      : a4PageHeight - bottomPaddingDom;

    const idealBottom = currentTop + pageCapacity;

    if (idealBottom >= totalHeight) {
      // Remaining content fits cleanly on this final page
      pages.push({ startY: currentTop, endY: totalHeight, isSubsequent });
      break;
    }

    // Find any block element that crosses the idealBottom boundary
    let bestBreakY = idealBottom;
    let foundCleanBreak = false;

    // Look for elements that cross idealBottom (top < idealBottom && bottom > idealBottom)
    for (let i = 0; i < blockBoundaries.length; i++) {
      const b = blockBoundaries[i];

      if (b.top < idealBottom && b.bottom > idealBottom) {
        // Element is straddling the page break line
        // If element starts below (currentTop + 40% of page capacity), we break before it
        if (b.top > currentTop + pageCapacity * 0.40) {
          bestBreakY = b.top - 4; // Clean break 4px above item
          foundCleanBreak = true;
          break;
        }
      }
    }

    // If no single element crossed or it was too large, find nearest element ending before idealBottom
    if (!foundCleanBreak) {
      for (let i = blockBoundaries.length - 1; i >= 0; i--) {
        const b = blockBoundaries[i];
        if (b.bottom <= idealBottom && b.bottom > currentTop + pageCapacity * 0.65) {
          bestBreakY = b.bottom + 4;
          foundCleanBreak = true;
          break;
        }
      }
    }

    // Ensure forward progress
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
 * High-fidelity Word (.doc / .docx compatible) document exporter
 * Uses UTF-8 BOM and Microsoft Word XML / HTML schemas
 * @param {Object} resumeData - Full resume data object
 */
export const exportResumeAsDoc = (resumeData = {}) => {
  if (!resumeData) {
    throw new Error("No resume data provided for Word export.");
  }

  const personalInfo = resumeData.personal_info || {};
  const accentColor = resumeData.accent_color || "#2563eb";

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

  // Format Experience
  const experienceHtml = (resumeData.experience || [])
    .map((exp) => {
      const dateRange = `${exp.start_date || ""} ${
        exp.start_date && (exp.is_current || exp.end_date) ? "–" : ""
      } ${exp.is_current ? "Present" : exp.end_date || ""}`.trim();

      const descLines =
        typeof exp.description === "string"
          ? exp.description
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
          : [];

      return `
        <div style="margin-bottom: 14pt; page-break-inside: avoid;">
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
            ${exp.company || ""}
          </div>
          ${
            descLines.length > 0
              ? `<ul style="margin: 0; padding-left: 18pt; color: #334155; font-size: 9.5pt; line-height: 1.5; font-family: 'Calibri', 'Arial', sans-serif;">
                  ${descLines
                    .map(
                      (line) =>
                        `<li style="margin-bottom: 2pt;">${line.replace(
                          /^[•*–-]\s*/,
                          ""
                        )}</li>`
                    )
                    .join("")}
                </ul>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  // Format Projects
  const projectHtml = (resumeData.project || [])
    .map((proj) => {
      return `
        <div style="margin-bottom: 12pt; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 2pt;">
            <tr>
              <td style="font-weight: bold; font-size: 10.5pt; color: #0f172a; font-family: 'Calibri', 'Arial', sans-serif;">
                ${proj.name || "Project"}
              </td>
              ${
                proj.type
                  ? `<td style="text-align: right; font-size: 9pt; color: #64748b; text-transform: uppercase; font-family: 'Calibri', 'Arial', sans-serif;">${proj.type}</td>`
                  : ""
              }
            </tr>
          </table>
          ${
            proj.description
              ? `<div style="font-size: 9.5pt; line-height: 1.5; color: #334155; margin-top: 2pt; font-family: 'Calibri', 'Arial', sans-serif;">
                  ${proj.description}
                </div>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  // Format Education
  const educationHtml = (resumeData.education || [])
    .map((edu) => {
      return `
        <div style="margin-bottom: 10pt; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 2pt;">
            <tr>
              <td style="font-weight: bold; font-size: 10.5pt; color: #0f172a; font-family: 'Calibri', 'Arial', sans-serif;">
                ${edu.degree || "Degree"} ${edu.field ? `in ${edu.field}` : ""}
              </td>
              <td style="text-align: right; font-size: 9.5pt; color: #64748b; font-family: 'Calibri', 'Arial', sans-serif;">
                ${edu.graduation_date || ""}
              </td>
            </tr>
          </table>
          <div style="font-size: 9.5pt; color: #475569; font-family: 'Calibri', 'Arial', sans-serif;">
            ${edu.institution || ""} ${edu.gpa ? `· GPA: ${edu.gpa}` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  // Format Certifications
  const certificationsHtml = (resumeData.certifications || [])
    .map((cert) => {
      return `
        <div style="margin-bottom: 8pt; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; font-size: 10pt; color: #0f172a; font-family: 'Calibri', 'Arial', sans-serif;">
                ${cert.name || "Certification"}
              </td>
              <td style="text-align: right; font-size: 9pt; color: #64748b; font-family: 'Calibri', 'Arial', sans-serif;">
                ${cert.date || ""}
              </td>
            </tr>
          </table>
          <div style="font-size: 9pt; color: #475569; font-family: 'Calibri', 'Arial', sans-serif;">
            ${cert.issuer || ""}
          </div>
        </div>
      `;
    })
    .join("");

  // Format Achievements
  const achievementsHtml = (resumeData.achievements || [])
    .map((item) => {
      return `
        <div style="margin-bottom: 8pt; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; font-size: 10pt; color: #0f172a; font-family: 'Calibri', 'Arial', sans-serif;">
                ${item.title || "Achievement"}
              </td>
              <td style="text-align: right; font-size: 9pt; color: #64748b; font-family: 'Calibri', 'Arial', sans-serif;">
                ${item.date || ""}
              </td>
            </tr>
          </table>
          ${
            item.description
              ? `<div style="font-size: 9pt; color: #334155; margin-top: 2pt; font-family: 'Calibri', 'Arial', sans-serif;">
                  ${item.description}
                </div>`
              : ""
          }
        </div>
      `;
    })
    .join("");

  // Format Skills
  const skillsHtml =
    (resumeData.skills || []).length > 0
      ? `<div style="font-size: 9.5pt; color: #1e293b; line-height: 1.6; font-family: 'Calibri', 'Arial', sans-serif;">
          ${resumeData.skills.join("   •   ")}
        </div>`
      : "";

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${resumeData.title || "Resume"}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 21.0cm 29.7cm;
            margin: 2.0cm 2.0cm 2.0cm 2.0cm;
            mso-page-orientation: portrait;
          }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            color: #0f172a;
            line-height: 1.4;
          }
          h1 {
            font-size: 22pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0 0 3pt 0;
            color: #0f172a;
            text-align: center;
          }
          .profession {
            font-size: 11pt;
            font-weight: bold;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: ${accentColor};
            text-align: center;
            margin-bottom: 6pt;
          }
          .contact {
            font-size: 9pt;
            color: #475569;
            text-align: center;
            margin-bottom: 14pt;
            padding-bottom: 8pt;
            border-bottom: 1.5pt solid ${accentColor};
          }
          .section-title {
            font-size: 11pt;
            font-weight: bold;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: ${accentColor};
            margin-top: 14pt;
            margin-bottom: 6pt;
            padding-bottom: 2pt;
            border-bottom: 1pt solid #e2e8f0;
          }
          p {
            margin: 0 0 6pt 0;
            font-size: 9.5pt;
            line-height: 1.5;
            color: #334155;
          }
        </style>
      </head>
      <body>
        <h1>${personalInfo.full_name || "Candidate Name"}</h1>
        ${
          personalInfo.profession
            ? `<div class="profession">${personalInfo.profession}</div>`
            : ""
        }
        ${
          contactItems.length > 0
            ? `<div class="contact">${contactItems.join("   |   ")}</div>`
            : ""
        }

        ${
          resumeData.professional_summary
            ? `
          <div class="section-title">Professional Summary</div>
          <p>${resumeData.professional_summary}</p>
        `
            : ""
        }

        ${
          (resumeData.experience || []).length > 0
            ? `
          <div class="section-title">Work Experience</div>
          ${experienceHtml}
        `
            : ""
        }

        ${
          (resumeData.project || []).length > 0
            ? `
          <div class="section-title">Key Projects</div>
          ${projectHtml}
        `
            : ""
        }

        ${
          (resumeData.education || []).length > 0
            ? `
          <div class="section-title">Education</div>
          ${educationHtml}
        `
            : ""
        }

        ${
          (resumeData.certifications || []).length > 0
            ? `
          <div class="section-title">Certifications & Licenses</div>
          ${certificationsHtml}
        `
            : ""
        }

        ${
          (resumeData.achievements || []).length > 0
            ? `
          <div class="section-title">Honors & Achievements</div>
          ${achievementsHtml}
        `
            : ""
        }

        ${
          (resumeData.skills || []).length > 0
            ? `
          <div class="section-title">Core Competencies</div>
          ${skillsHtml}
        `
            : ""
        }
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", docHtml], {
    type: "application/msword;charset=utf-8",
  });
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
 * Intelligent Multi-Page PDF Exporter (Zero-Cutoff A4 Document Engine)
 * Automatically segments single-page and multi-page resumes with clean boundary breaks.
 * Ensures that Page 2, Page 3, etc. maintain the EXACT same top margin as Page 1.
 *
 * @param {HTMLElement} sourceElement - Resume container element
 * @param {Object} resumeData - Resume metadata for filename
 */
export const exportResumeAsPdf = async (sourceElement, resumeData = {}) => {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);

  if (!sourceElement) {
    throw new Error("Resume element not found for export.");
  }

  // Pre-flight validation
  const hasContent =
    resumeData.personal_info?.full_name ||
    resumeData.professional_summary ||
    (resumeData.skills && resumeData.skills.length > 0) ||
    (resumeData.experience && resumeData.experience.length > 0) ||
    (resumeData.education && resumeData.education.length > 0);

  if (!hasContent) {
    throw new Error(
      "Cannot export an empty resume. Please add your resume details first."
    );
  }

  // 1. Wait for web fonts to load
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch {
    // Continue
  }

  // 2. Identify the target element to capture
  let targetNode =
    document.getElementById("resume-preview") ||
    document.getElementById("resume-export-content") ||
    sourceElement;

  // 3. Ensure all images inside target are fully loaded
  const images = Array.from(targetNode.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      try {
        img.crossOrigin = "anonymous";
        if (img.complete && img.naturalWidth > 0) return;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 800);
        });
      } catch {
        // Ignore individual image load exceptions
      }
    })
  );

  // Settle DOM layout
  await new Promise((resolve) => setTimeout(resolve, 80));

  // 4. Measure template top padding
  const computedStyle = window.getComputedStyle ? window.getComputedStyle(targetNode) : null;
  const topPaddingDom = computedStyle && parseFloat(computedStyle.paddingTop) > 0 ? parseFloat(computedStyle.paddingTop) : 36;

  // 5. Calculate smart page breaks based on DOM element positions
  const pageBreaks = calculateSmartPageBreaks(targetNode);

  // 6. Render full high-resolution canvas of the entire resume
  const fullCanvas = await toCanvas(targetNode, {
    quality: 0.98,
    pixelRatio: 2.5, // 300 DPI print quality
    backgroundColor: "#ffffff",
    cacheBust: true,
    filter: (node) => {
      // Exclude non-print controls
      if (
        node.classList &&
        node.classList.contains("no-print")
      ) {
        return false;
      }
      return true;
    },
  });

  if (!fullCanvas || fullCanvas.width === 0 || fullCanvas.height === 0) {
    throw new Error("Failed to render resume canvas. Please try again.");
  }

  const canvasWidth = fullCanvas.width;
  const canvasHeight = fullCanvas.height;
  const domWidth = targetNode.offsetWidth || 794;
  const scale = canvasWidth / domWidth;

  // A4 aspect ratio height in canvas pixels (297 / 210 = 1.4142857)
  const a4CanvasHeight = Math.round((canvasWidth * 297) / 210);
  const topMarginCanvas = Math.round(topPaddingDom * scale);

  // 7. Initialize jsPDF document (Standard A4: 210mm x 297mm)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // 8. Render each page slice into the PDF maintaining identical top margins
  for (let i = 0; i < pageBreaks.length; i++) {
    const { startY, endY, isSubsequent } = pageBreaks[i];

    if (i > 0) {
      pdf.addPage();
    }

    const sliceStartY = Math.round(startY * scale);
    const sliceEndY = Math.min(Math.round(endY * scale), canvasHeight);
    const sliceHeight = Math.max(1, sliceEndY - sliceStartY);

    // Create discrete A4 page canvas with pure white background
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvasWidth;
    pageCanvas.height = a4CanvasHeight;
    const ctx = pageCanvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, a4CanvasHeight);

    // Position content:
    // Page 1 already contains top padding from startY = 0 -> drawn at y = 0
    // Page 2, Page 3, etc. are offset by topMarginCanvas -> perfectly matches Page 1 top margin!
    const targetDestY = isSubsequent ? topMarginCanvas : 0;

    ctx.drawImage(
      fullCanvas,
      0,
      sliceStartY,
      canvasWidth,
      sliceHeight,
      0,
      targetDestY,
      canvasWidth,
      sliceHeight
    );

    const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.98);

    // Place exact single A4 page cleanly at (0, 0, 210mm, 297mm)
    pdf.addImage(pageImgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
  }

  const fileName = `${sanitizeFileName(resumeData.title || "Resume")}.pdf`;
  pdf.save(fileName);
};

export default {
  exportResumeAsDoc,
  exportResumeAsPdf,
  calculateSmartPageBreaks,
};

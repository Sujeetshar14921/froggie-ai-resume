/**
 * Format date string into human-readable format (e.g. "Jun 2023")
 * @param {string} dateStr - e.g. "2023-06" or "2023-06-15" or "Present"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.toLowerCase() === "present" || dateStr.toLowerCase() === "current") {
    return "Present";
  }

  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [y, m] = dateStr.split("-");
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
      : dateStr;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m] = dateStr.split("-");
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
      : dateStr;
  }

  return dateStr;
};

/**
 * Sanitize filename for exports (e.g. "Sujeet-Sharma-Resume")
 * @param {string} rawTitle
 */
export const sanitizeFileName = (rawTitle) => {
  const raw = rawTitle || "resume";
  return raw.replace(/[^a-zA-Z0-9\s-_]/g, "").trim().replace(/\s+/g, "-") || "resume";
};

/**
 * Format file size in KB/MB
 * @param {number} bytes
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

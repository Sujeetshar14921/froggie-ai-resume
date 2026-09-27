import { createRequire } from "module";
import { extractPdfText } from "./pdfExtractor.js";

const require = createRequire(import.meta.url);
let mammoth;
try {
  mammoth = require("mammoth");
} catch {
  mammoth = null;
}

/**
 * Universal Document Text Extractor
 * Extracts plain text from PDF, Word (.docx, .doc), and plain text documents.
 * 
 * @param {Buffer} buffer - Binary file buffer
 * @param {string} originalName - Original uploaded filename
 * @param {string} mimetype - MIME type
 * @returns {Promise<string>} Extracted plain text
 */
export const extractDocumentText = async (buffer, originalName = "", mimetype = "") => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid or missing file buffer");
  }

  const name = (originalName || "").toLowerCase();

  // 1. PDF
  if (name.endsWith(".pdf") || mimetype === "application/pdf") {
    return await extractPdfText(buffer);
  }

  // 2. DOCX / DOC
  if (name.endsWith(".docx") || name.endsWith(".doc") || mimetype.includes("word") || mimetype.includes("officedocument")) {
    if (mammoth) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        if (result && result.value && result.value.trim().length > 0) {
          return result.value.trim();
        }
      } catch (docxErr) {
        console.warn("Mammoth extraction notice, attempting fallback:", docxErr.message);
      }
    }

    // Fallback: If mammoth failed on older binary .doc, extract printable strings from buffer
    const text = buffer.toString("utf-8");
    const cleanText = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (cleanText.length >= 20) {
      return cleanText;
    }
  }

  // 3. Fallback: try PDF parser, then UTF-8 plain text
  try {
    const pdfAttempt = await extractPdfText(buffer);
    if (pdfAttempt && pdfAttempt.trim().length > 0) return pdfAttempt;
  } catch {
    // Continue to text fallback
  }

  return buffer.toString("utf-8").trim();
};

export default {
  extractDocumentText,
  extractPdfText,
};

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
 * Multimodal AI OCR Text Extractor using Google Gemini
 * Extracts text from scanned PDFs, image-based resumes, or non-standard documents
 */
export const extractPdfWithGeminiOcr = async (buffer) => {
  const rawKey =
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    "";
  const apiKey = rawKey.replace(/["']/g, "").trim();
  if (!apiKey) {
    throw new Error("No Gemini API key available for OCR fallback");
  }

  const model = (
    process.env.OPENAI_MODEL ||
    process.env.GEMINI_MODEL ||
    "gemini-3.5-flash-lite"
  )
    .replace(/["']/g, "")
    .trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: buffer.toString("base64"),
            },
          },
          {
            text: "Extract all text content from this resume document accurately with zero omissions. Return only the extracted plain text without any conversational preamble.",
          },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || text.trim().length === 0) {
    throw new Error(data.error?.message || "Gemini OCR returned empty text");
  }
  return text.trim();
};

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
    let pdfText = "";
    try {
      pdfText = await extractPdfText(buffer);
    } catch (pdfErr) {
      console.warn("pdf-parse extraction warning:", pdfErr.message);
    }

    if (pdfText && pdfText.trim().length >= 20) {
      return pdfText.trim();
    }

    // High-performance Gemini AI Vision OCR fallback for scanned/image PDFs
    try {
      const ocrText = await extractPdfWithGeminiOcr(buffer);
      if (ocrText && ocrText.trim().length >= 20) {
        return ocrText.trim();
      }
    } catch (ocrErr) {
      console.warn("Gemini OCR fallback notice:", ocrErr.message);
    }

    if (pdfText && pdfText.trim().length > 0) {
      return pdfText.trim();
    }
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

  // 3. Fallback: try PDF parser, then Gemini OCR, then UTF-8 plain text
  try {
    const pdfAttempt = await extractPdfText(buffer);
    if (pdfAttempt && pdfAttempt.trim().length >= 20) return pdfAttempt.trim();
  } catch {
    // Continue
  }

  try {
    const ocrAttempt = await extractPdfWithGeminiOcr(buffer);
    if (ocrAttempt && ocrAttempt.trim().length >= 20) return ocrAttempt.trim();
  } catch {
    // Continue
  }

  return buffer.toString("utf-8").trim();
};

export default {
  extractDocumentText,
  extractPdfText,
  extractPdfWithGeminiOcr,
};

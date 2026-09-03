import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");

/**
 * Universal PDF text extractor supporting both pdf-parse v1 (function) and v2 (PDFParse class)
 * @param {Buffer} dataBuffer - Binary buffer of uploaded PDF file
 * @returns {Promise<string>} Extracted plain text
 */
export const extractPdfText = async (dataBuffer) => {
  if (!dataBuffer || !Buffer.isBuffer(dataBuffer)) {
    throw new Error("Invalid or missing PDF data buffer");
  }

  if (typeof pdfParseModule === "function") {
    const data = await pdfParseModule(dataBuffer);
    return data.text || "";
  }

  if (pdfParseModule?.PDFParse) {
    const parser = new pdfParseModule.PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text || "";
  }

  throw new Error("PDF text extraction engine is not available");
};

export default {
  extractPdfText,
};

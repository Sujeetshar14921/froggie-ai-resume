import api from "../configs/api";

/**
 * AI Generation & PDF Parser API Service
 * All prompts and PDF document parsing are handled securely on the backend.
 */
export const aiApi = {
  /**
   * Enhance professional summary text using backend AI
   * @param {string} summary - The current draft summary
   * @param {string} token
   */
  enhanceSummary: async (summary, token) => {
    const { data } = await api.post(
      "/api/ai/enhance-pro-sum",
      { summary },
      { headers: { Authorization: token } }
    );
    return data;
  },

  /**
   * Enhance job description text using backend AI
   * @param {Object} payload - { description, position, company }
   * @param {string} token
   */
  enhanceJobDescription: async ({ description, position, company }, token) => {
    const { data } = await api.post(
      "/api/ai/enhance-job-desc",
      { description, position, company },
      { headers: { Authorization: token } }
    );
    return data;
  },

  /**
   * Upload PDF resume file to backend for server-side parsing
   * @param {Object|FormData} payload - { file, title } or FormData
   * @param {string} token
   */
  uploadResumePdf: async (payload, token) => {
    let requestData = payload;
    let headers = { Authorization: token };

    if (payload.file instanceof File || payload.file instanceof Blob) {
      const formData = new FormData();
      formData.append("resume", payload.file);
      if (payload.title) {
        formData.append("title", payload.title);
      }
      requestData = formData;
      headers["Content-Type"] = "multipart/form-data";
    }

    const { data } = await api.post("/api/ai/upload-resume", requestData, { headers });
    return data;
  },

  /**
   * Run Deep Gemini AI ATS X-Ray Audit
   * @param {Object} resumeData
   * @param {string} token
   */
  runXRayAudit: async (resumeData, token) => {
    const { data } = await api.post(
      "/api/ai/xray-audit",
      { resumeData },
      { headers: { Authorization: token } }
    );
    return data;
  },
};

export default aiApi;

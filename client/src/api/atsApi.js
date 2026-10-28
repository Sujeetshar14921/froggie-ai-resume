import api from "../configs/api";

/**
 * ATS Resume Score Checker API Service
 */
export const atsApi = {
  /**
   * Analyze a resume against a job description
   * @param {Object|FormData} payload - { resumeId, jobDescription, customJobTitle } OR FormData with file
   * @param {string} token
   */
  analyzeResume: async (payload, token) => {
    let requestData = payload;
    const headers = {};
    if (token) {
      headers.Authorization = token;
    }

    if (payload instanceof FormData) {
      requestData = payload;
    } else if (payload?.file) {
      const formData = new FormData();
      formData.append("resume", payload.file);
      formData.append("jobDescription", payload.jobDescription || "");
      if (payload.customJobTitle) {
        formData.append("customJobTitle", payload.customJobTitle);
      }
      requestData = formData;
    } else if (payload?.resumeText) {
      requestData = {
        resumeText: payload.resumeText,
        jobDescription: payload.jobDescription || "",
        customJobTitle: payload.customJobTitle,
      };
    }

    const { data } = await api.post("/api/ats/analyze", requestData, { headers });
    return data;
  },

  /**
   * Get previous ATS scan history for the user
   * @param {string} token
   */
  getHistory: async (token) => {
    const { data } = await api.get("/api/ats/history", {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Get a specific past ATS report by ID
   * @param {string} reportId
   * @param {string} token
   */
  getReportById: async (reportId, token) => {
    const { data } = await api.get(`/api/ats/report/${reportId}`, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Delete a past scan report
   * @param {string} reportId
   * @param {string} token
   */
  deleteReport: async (reportId, token) => {
    const { data } = await api.delete(`/api/ats/report/${reportId}`, {
      headers: { Authorization: token },
    });
    return data;
  },
};

export default atsApi;

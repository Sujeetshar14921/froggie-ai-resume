import api from "../configs/api";

/**
 * Resume CRUD & Advanced Versioning API Service
 */
export const resumeApi = {
  /**
   * Fetch all resumes for the authenticated user
   * @param {string} token
   */
  getUserResumes: async (token) => {
    const { data } = await api.get("/api/users/resumes", {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Fetch a single resume by ID (authenticated)
   * @param {string} resumeId
   * @param {string} token
   */
  getResumeById: async (resumeId, token) => {
    const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Fetch a public resume by ID (no auth required)
   * @param {string} resumeId
   */
  getPublicResumeById: async (resumeId) => {
    const { data } = await api.get(`/api/resumes/public/${resumeId}`);
    return data;
  },

  /**
   * Create a new resume
   * @param {Object} payload - { title, template, accent_color }
   * @param {string} token
   */
  createResume: async (payload, token) => {
    const { data } = await api.post("/api/resumes/create", payload, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Update an existing resume (FormData for image/background removal or JSON)
   * @param {FormData} formData
   * @param {string} token
   */
  updateResume: async (formData, token) => {
    const { data } = await api.put("/api/resumes/update", formData, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Fetch resume version history snapshots
   * @param {string} resumeId
   * @param {string} token
   */
  getResumeHistory: async (resumeId, token) => {
    const { data } = await api.get(`/api/resumes/${resumeId}/history`, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Rollback / restore resume to a specific snapshot version
   * @param {string} resumeId
   * @param {number} versionNumber
   * @param {string} token
   */
  restoreResumeVersion: async (resumeId, versionNumber, token) => {
    const { data } = await api.post(
      `/api/resumes/${resumeId}/rollback/${versionNumber}`,
      {},
      { headers: { Authorization: token } }
    );
    return data;
  },

  /**
   * Fetch soft-deleted resumes in Trash
   * @param {string} token
   */
  getTrashResumes: async (token) => {
    const { data } = await api.get("/api/resumes/trash", {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Restore a soft-deleted resume from Trash
   * @param {string} resumeId
   * @param {string} token
   */
  restoreDeletedResume: async (resumeId, token) => {
    const { data } = await api.patch(
      `/api/resumes/${resumeId}/restore`,
      {},
      { headers: { Authorization: token } }
    );
    return data;
  },

  /**
   * Empty trash permanently
   * @param {string} token
   */
  emptyTrash: async (token) => {
    const { data } = await api.delete("/api/resumes/trash/empty", {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Export resume as Word (.docx) file
   * @param {string} resumeId
   * @param {string} defaultFileName
   */
  exportDocx: async (resumeId, defaultFileName = "Resume.docx") => {
    const response = await api.get(`/api/resumes/${resumeId}/export-docx`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", defaultFileName.endsWith(".docx") ? defaultFileName : `${defaultFileName}.docx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  },

  /**
   * Fetch public talent pool resumes with filters & search
   * @param {Object} params - { q, skill, role, experienceLevel, template, sortBy, page, limit }
   */
  getPublicTalentPool: async (params = {}) => {
    const { data } = await api.get("/api/resumes/talent-pool", { params });
    return data;
  },

  /**
   * AI Match candidates against a Job Description
   * @param {string} jdText
   */
  matchJdWithCandidates: async (jdText) => {
    const { data } = await api.post("/api/resumes/match-jd", { jdText });
    return data;
  },

  /**
   * Toggle resume public visibility
   * @param {string} resumeId
   * @param {boolean} isPublic
   * @param {string} token
   */
  toggleVisibility: async (resumeId, isPublic, token) => {
    const { data } = await api.patch(
      `/api/resumes/${resumeId}/visibility`,
      { isPublic },
      { headers: { Authorization: token } }
    );
    return data;
  },

  /**
   * Soft-delete a resume by ID
   * @param {string} resumeId
   * @param {string} token
   * @param {boolean} permanent
   */
  deleteResume: async (resumeId, token, permanent = false) => {
    const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
      params: { permanent },
      headers: { Authorization: token },
    });
    return data;
  },
};

export default resumeApi;

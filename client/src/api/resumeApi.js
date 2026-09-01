import api from "../configs/api";

/**
 * Resume CRUD API Service
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
   * Delete a resume by ID
   * @param {string} resumeId
   * @param {string} token
   */
  deleteResume: async (resumeId, token) => {
    const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
      headers: { Authorization: token },
    });
    return data;
  },
};

export default resumeApi;

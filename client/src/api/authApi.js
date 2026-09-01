import api from "../configs/api";

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Log in user
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    const { data } = await api.post("/api/users/login", credentials);
    return data;
  },

  /**
   * Register new user
   * @param {Object} userData - { name, email, password }
   */
  register: async (userData) => {
    const { data } = await api.post("/api/users/register", userData);
    return data;
  },

  /**
   * Fetch authenticated user's profile data
   * @param {string} token
   */
  getUserData: async (token) => {
    const { data } = await api.get("/api/users/data", {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Update user profile information & avatar
   * @param {FormData} formData
   * @param {string} token
   */
  updateProfile: async (formData, token) => {
    const { data } = await api.put("/api/users/profile", formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};

export default authApi;

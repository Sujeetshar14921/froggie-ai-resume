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
   * Send OTP for account signup verification
   * @param {Object} userData - { name, email, password }
   */
  sendSignupOtp: async (userData) => {
    const { data } = await api.post("/api/users/send-signup-otp", userData);
    return data;
  },

  /**
   * Verify signup OTP and complete user registration
   * @param {Object} payload - { email, otp }
   */
  verifySignupOtp: async (payload) => {
    const { data } = await api.post("/api/users/verify-signup-otp", payload);
    return data;
  },

  /**
   * Send OTP for password reset
   * @param {Object} payload - { email }
   */
  sendResetOtp: async (payload) => {
    const { data } = await api.post("/api/users/send-reset-otp", payload);
    return data;
  },

  /**
   * Verify OTP and set new password
   * @param {Object} payload - { email, otp, newPassword }
   */
  resetPassword: async (payload) => {
    const { data } = await api.post("/api/users/reset-password", payload);
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

  /**
   * Change user password
   * @param {Object} payload - { currentPassword, newPassword }
   * @param {string} token
   */
  changePassword: async (payload, token) => {
    const { data } = await api.put("/api/users/change-password", payload, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Deactivate user account
   * @param {Object} feedbackData
   * @param {string} token
   */
  deactivateAccount: async (feedbackData, token) => {
    const { data } = await api.post("/api/users/deactivate", feedbackData, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Permanently delete user account and all data
   * @param {Object} feedbackData
   * @param {string} token
   */
  deleteAccount: async (feedbackData, token) => {
    const { data } = await api.delete("/api/users/account", {
      headers: { Authorization: token },
      data: feedbackData,
    });
    return data;
  },
};

export default authApi;

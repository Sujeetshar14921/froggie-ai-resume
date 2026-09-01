import api from "../configs/api";

/**
 * Testimonial & Feedback API Service
 */
export const testimonialApi = {
  /**
   * Get all live testimonials
   */
  getTestimonials: async () => {
    const { data } = await api.get("/api/testimonials");
    return data;
  },

  /**
   * Submit new feedback / testimonial
   * @param {Object} payload - { feedback, rating, title }
   * @param {string} token
   */
  addTestimonial: async (payload, token) => {
    const { data } = await api.post("/api/testimonials", payload, {
      headers: { Authorization: token },
    });
    return data;
  },
};

export default testimonialApi;

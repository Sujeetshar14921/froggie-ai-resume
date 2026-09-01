import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  addTestimonial,
  getTestimonials,
} from "../controllers/testimonialController.js";

const testimonialRouter = express.Router();

// Public: Get all testimonials
testimonialRouter.get("/", getTestimonials);

// Protected: Submit new feedback / testimonial
testimonialRouter.post("/", protect, addTestimonial);

export default testimonialRouter;

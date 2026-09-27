import express from "express";
import protect from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
  runAtsXRayAudit,
  streamAiSuggestions,
} from "../controllers/aiController.js";
import { aiLimiter } from "../middlewares/rateLimiter.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, aiLimiter, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, aiLimiter, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, upload.single("resume"), uploadResume);
aiRouter.post("/xray-audit", aiLimiter, runAtsXRayAudit);
aiRouter.post("/stream-suggest", protect, aiLimiter, streamAiSuggestions);

export default aiRouter;
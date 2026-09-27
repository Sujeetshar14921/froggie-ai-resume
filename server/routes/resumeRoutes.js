import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createResume,
  deleteResume,
  deleteAllResumes,
  getPublicResumeById,
  getPublicTalentPool,
  getResumeById,
  matchJdWithCandidates,
  toggleResumeVisibility,
  updateResume,
  getResumeHistory,
  restoreResumeVersion,
  restoreDeletedResume,
  getTrashResumes,
  emptyTrash,
  exportResumeDocx,
} from "../controllers/resumeController.js";
import upload from "../configs/multer.js";
import { talentLimiter, aiLimiter } from "../middlewares/rateLimiter.js";

const resumeRouter = express.Router();

// Resume CRUD
resumeRouter.post("/create", protect, createResume);
resumeRouter.put("/update", upload.single("image"), protect, updateResume);
resumeRouter.patch("/:resumeId/visibility", protect, toggleResumeVisibility);
resumeRouter.delete("/delete-all", protect, deleteAllResumes);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeById);

// Version History & Rollback
resumeRouter.get("/:resumeId/history", protect, getResumeHistory);
resumeRouter.post("/:resumeId/rollback/:versionNumber", protect, restoreResumeVersion);

// Soft Delete Trash Management
resumeRouter.get("/trash", protect, getTrashResumes);
resumeRouter.patch("/:resumeId/restore", protect, restoreDeletedResume);
resumeRouter.delete("/trash/empty", protect, emptyTrash);

// Server-side DOCX Export
resumeRouter.get("/:resumeId/export-docx", exportResumeDocx);

// Public Talent Directory & AI Matching (with rate limiting & caching)
resumeRouter.get("/talent-pool", talentLimiter, getPublicTalentPool);
resumeRouter.post("/match-jd", aiLimiter, matchJdWithCandidates);
resumeRouter.get("/public/:resumeId", talentLimiter, getPublicResumeById);

export default resumeRouter;
import express from "express";
import protect, { optionalProtect } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";
import {
  analyzeResume,
  getAtsHistory,
  getAtsReportById,
  deleteAtsReport,
} from "../controllers/atsController.js";

const atsRouter = express.Router();

// Analyze resume (Public / Guest accessible OR authenticated with saved resume)
atsRouter.post("/analyze", optionalProtect, upload.single("resume"), analyzeResume);

// Fetch scan history
atsRouter.get("/history", protect, getAtsHistory);

// Get specific scan report
atsRouter.get("/report/:reportId", protect, getAtsReportById);

// Delete specific scan report
atsRouter.delete("/report/:reportId", protect, deleteAtsReport);

export default atsRouter;

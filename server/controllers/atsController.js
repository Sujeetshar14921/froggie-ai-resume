import fs from "fs";
import Resume from "../models/Resume.js";
import AtsReport from "../models/AtsReport.js";
import { extractDocumentText } from "../utils/documentExtractor.js";
import {
  ATS_WEIGHTS,
  getMatchLabel,
  formatResumeTextForAts,
  evaluateResumeWithGemini,
} from "../services/ats/atsEngine.js";

export { ATS_WEIGHTS, getMatchLabel };

/**
 * POST /api/ats/analyze
 * Analyze Resume against Job Description
 */
export const analyzeResume = async (req, res) => {
  let tempFilePath = req.file?.path;

  try {
    const userId = req.userId || null;
    const { resumeId, jobDescription, customJobTitle } = req.body;

    // 1. Validate Job Description
    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ message: "Job description is required" });
    }

    const trimmedJd = jobDescription.trim();
    if (trimmedJd.length < 30) {
      return res.status(400).json({
        message: "Job description is too short. Please provide at least 30 characters of job details.",
      });
    }

    if (trimmedJd.length > 15000) {
      return res.status(400).json({
        message: "Job description is too long (maximum 15,000 characters).",
      });
    }

    // 2. Obtain Resume Data (Uploaded file takes precedence over saved resumeId)
    let resumeText = "";
    let resumeTitle = "Uploaded Resume";
    let resumeDoc = null;

    if (req.file) {
      // Parse uploaded PDF / Word DOC / DOCX / TXT file
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        resumeText = await extractDocumentText(
          dataBuffer,
          req.file.originalname,
          req.file.mimetype
        );
      } catch (parseErr) {
        console.error("Document text extraction failed:", parseErr);
        return res.status(400).json({
          message: `Failed to read document "${req.file.originalname}": ${parseErr.message || "Invalid or corrupt file"}`,
        });
      }

      if (!resumeText || resumeText.trim().length < 20) {
        return res.status(400).json({
          message: "Could not extract readable text from the uploaded resume document. Please check the file or ensure it contains readable text.",
        });
      }

      resumeTitle = req.file.originalname.replace(/\.(pdf|docx?|txt)$/i, "");
    } else if (resumeId) {
      if (!userId) {
        return res.status(401).json({
          message: "Please log in to analyze saved resumes, or upload your resume file directly.",
        });
      }

      resumeDoc = await Resume.findOne({ _id: resumeId, userId });
      if (!resumeDoc) {
        return res.status(404).json({ message: "Selected resume not found or unauthorized" });
      }

      resumeTitle = resumeDoc.title || "My Resume";
      resumeText = formatResumeTextForAts(resumeDoc);

      if (!resumeText || resumeText.trim().length < 20) {
        return res.status(400).json({
          message: "The selected resume does not contain sufficient details to analyze. Please add some experience, skills, or summary first.",
        });
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText.trim();
      if (resumeText.length < 20) {
        return res.status(400).json({ message: "Resume content is too short" });
      }
    } else {
      return res.status(400).json({
        message: "Please select a saved resume or upload a PDF or Word DOC resume file to analyze",
      });
    }

    // 3. AI ATS Semantic Evaluation using Modular ATS Engine
    const evaluatedReport = await evaluateResumeWithGemini({
      resumeText,
      jobDescription: trimmedJd,
      targetRole: customJobTitle,
    });

    const {
      jobTitle,
      overallScore,
      matchLabel,
      summaryMessage,
      scores,
      skills,
      keywords,
      experience,
      strengths,
      improvements,
      atsIssues,
      recommendations,
    } = evaluatedReport;

    // 5. Save Analysis Report to MongoDB
    const reportData = {
      userId,
      resumeId: resumeDoc ? resumeDoc._id : null,
      resumeTitle,
      jobTitle: customJobTitle || jobTitle || "Target Role",
      jobDescription: trimmedJd,
      overallScore,
      summary: {
        label: matchLabel,
        message: summaryMessage,
      },
      scores,
      skills: skills || { matched: [], missing: [], partial: [] },
      keywords: keywords || { matched: [], missing: [], important: [] },
      experience: experience || { requiredYears: 0, resumeYears: 0, score: 0, analysis: "" },
      strengths: strengths || [],
      improvements: improvements || [],
      atsIssues: atsIssues || [],
      recommendations: recommendations || [],
    };

    const createdReport = await AtsReport.create(reportData);

    return res.status(200).json({
      message: "ATS analysis complete",
      report: createdReport,
    });
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    const statusCode = error.statusCode || error.status || 500;
    return res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
      message: error.message || "Failed to complete ATS resume analysis",
    });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.warn("Could not delete temp file:", e);
      }
    }
  }
};

/**
 * GET /api/ats/history
 * Fetch previous ATS scan history for the authenticated user
 */
export const getAtsHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const history = await AtsReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .select("jobTitle resumeTitle overallScore summary createdAt _id");

    return res.status(200).json({ history });
  } catch (error) {
    console.error("ATS History Error:", error);
    return res.status(400).json({ message: error.message || "Failed to load scan history" });
  }
};

/**
 * GET /api/ats/report/:reportId
 * Fetch full ATS report by ID
 */
export const getAtsReportById = async (req, res) => {
  try {
    const userId = req.userId;
    const { reportId } = req.params;

    const report = await AtsReport.findOne({ _id: reportId, userId });
    if (!report) {
      return res.status(404).json({ message: "ATS report not found" });
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error("ATS Report Error:", error);
    return res.status(400).json({ message: error.message || "Failed to load ATS report" });
  }
};

/**
 * DELETE /api/ats/report/:reportId
 * Delete a specific ATS scan report
 */
export const deleteAtsReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { reportId } = req.params;

    const deleted = await AtsReport.findOneAndDelete({ _id: reportId, userId });
    if (!deleted) {
      return res.status(404).json({ message: "ATS report not found" });
    }

    return res.status(200).json({ message: "Scan report deleted successfully" });
  } catch (error) {
    console.error("Delete ATS Report Error:", error);
    return res.status(400).json({ message: error.message || "Failed to delete scan report" });
  }
};

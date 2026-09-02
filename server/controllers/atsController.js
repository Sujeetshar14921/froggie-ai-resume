import fs from "fs";
import { createRequire } from "module";
import Resume from "../models/Resume.js";
import AtsReport from "../models/AtsReport.js";
import ai from "../configs/ai.js";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");

/**
 * Universal PDF text extractor
 */
const extractPdfText = async (dataBuffer) => {
  if (typeof pdfParseModule === "function") {
    const data = await pdfParseModule(dataBuffer);
    return data.text || "";
  }
  if (pdfParseModule?.PDFParse) {
    const parser = new pdfParseModule.PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text || "";
  }
  throw new Error("PDF parser not available");
};

/**
 * Centralized Category Weights for ATS Scoring
 */
export const ATS_WEIGHTS = {
  keywordMatch: 0.30,
  skillsMatch: 0.25,
  experienceMatch: 0.15,
  titleMatch: 0.10,
  educationMatch: 0.10,
  structure: 0.05,
  readability: 0.05,
};

/**
 * Determine Match Label from Overall Score
 */
export const getMatchLabel = (score) => {
  if (score >= 90) return "Excellent Match";
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Fair Match";
  if (score >= 40) return "Needs Improvement";
  return "Poor Match";
};

/**
 * POST /api/ats/analyze
 * Analyze Resume against Job Description
 */
export const analyzeResume = async (req, res) => {
  let tempFilePath = req.file?.path;

  try {
    const userId = req.userId;
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

    // 2. Obtain Resume Data
    let resumeText = "";
    let resumeTitle = "Uploaded Resume";
    let resumeDoc = null;

    if (resumeId) {
      // Find existing user resume
      resumeDoc = await Resume.findOne({ _id: resumeId, userId });
      if (!resumeDoc) {
        return res.status(404).json({ message: "Selected resume not found or unauthorized" });
      }

      resumeTitle = resumeDoc.title || "My Resume";

      // Build text representation from structured resume document
      resumeText = `
Candidate Name: ${resumeDoc.personal_info?.full_name || ""}
Profession/Title: ${resumeDoc.personal_info?.profession || ""}
Email: ${resumeDoc.personal_info?.email || ""}
Location: ${resumeDoc.personal_info?.location || ""}

Professional Summary:
${resumeDoc.professional_summary || "None provided"}

Core Skills:
${(resumeDoc.skills || []).join(", ") || "None listed"}

Work Experience:
${(resumeDoc.experience || [])
  .map(
    (exp) =>
      `Role: ${exp.position || "Position"} at ${exp.company || "Company"} (${exp.start_date || ""} - ${
        exp.is_current ? "Present" : exp.end_date || ""
      })\nResponsibilities: ${exp.description || ""}`
  )
  .join("\n\n")}

Projects:
${(resumeDoc.project || [])
  .map((p) => `Project: ${p.name || ""} (${p.type || ""})\nDetails: ${p.description || ""}`)
  .join("\n\n")}

Education:
${(resumeDoc.education || [])
  .map(
    (edu) =>
      `Degree: ${edu.degree || ""} in ${edu.field || ""} from ${edu.institution || ""} (Graduation: ${
        edu.graduation_date || ""
      })`
  )
  .join("\n")}
      `.trim();
    } else if (req.file) {
      // Parse uploaded PDF file
      const dataBuffer = fs.readFileSync(req.file.path);
      resumeText = await extractPdfText(dataBuffer);

      if (!resumeText || resumeText.trim().length < 30) {
        return res.status(400).json({
          message: "Could not extract readable text from the uploaded PDF resume.",
        });
      }

      resumeTitle = req.file.originalname.replace(/\.pdf$/i, "");
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText.trim();
      if (resumeText.length < 30) {
        return res.status(400).json({ message: "Resume content is too short" });
      }
    } else {
      return res.status(400).json({
        message: "Please select a saved resume or upload a PDF resume file to analyze",
      });
    }

    // 3. AI ATS Semantic Evaluation
    const systemPrompt = `You are a strict, professional Applicant Tracking System (ATS) auditor and hiring manager AI.
Your objective is to perform a thorough, realistic evaluation of how well the provided candidate resume matches the target job description.

Rules:
1. Ground all scores in actual candidate experience and job requirements. Never invent experience.
2. Score each category strictly between 0 and 100 based on standard industry criteria:
   - keywordMatch (0-100): Coverage of essential technical & domain keywords.
   - skillsMatch (0-100): Overlap of required and preferred hard/soft skills.
   - experienceMatch (0-100): Relevance of roles, seniority, and years of experience.
   - titleMatch (0-100): Alignment between target job title and candidate's headlines/past roles.
   - educationMatch (0-100): Degree/field requirements match (if JD does not mention degree, give 100).
   - structure (0-100): Presence of standard resume sections (Summary, Experience, Skills, Education).
   - readability (0-100): ATS readability, bullet clarity, absence of formatting issues.
3. Return ONLY valid JSON in the exact schema specified. No markdown fences, no conversational prose.`;

    const userPrompt = `Job Description:
${trimmedJd}

Candidate Resume:
${resumeText}

Analyze and return JSON matching this exact structure:
{
  "jobTitle": "Target job title identified from JD",
  "scores": {
    "keywordMatch": 85,
    "skillsMatch": 80,
    "experienceMatch": 75,
    "titleMatch": 90,
    "educationMatch": 100,
    "structure": 95,
    "readability": 90
  },
  "skills": {
    "matched": ["Skill 1", "Skill 2"],
    "missing": ["Missing Skill 1", "Missing Skill 2"],
    "partial": ["Partial Match 1"]
  },
  "keywords": {
    "matched": ["Keyword 1", "Keyword 2"],
    "missing": ["Keyword 3"],
    "important": ["Keyword 1", "Keyword 2", "Keyword 3"]
  },
  "experience": {
    "requiredYears": 3,
    "resumeYears": 2,
    "score": 75,
    "analysis": "Explanation of experience match"
  },
  "strengths": [
    "Specific verified strength 1",
    "Specific verified strength 2"
  ],
  "improvements": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ],
  "atsIssues": [
    {
      "severity": "low",
      "message": "Specific formatting or structural notice"
    }
  ],
  "recommendations": [
    "Tip 1 (e.g. 'If you have experience with X, consider mentioning it')",
    "Tip 2"
  ]
}`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-3.5-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    let rawOutput = response.choices[0]?.message?.content?.trim() || "{}";
    if (rawOutput.startsWith("```")) {
      rawOutput = rawOutput.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }
    const parsedResult = JSON.parse(rawOutput);

    // 4. Calculate Deterministic Weighted Overall Score
    const rawScores = parsedResult.scores || {};
    const clampedScores = {
      keywordMatch: Math.min(100, Math.max(0, Number(rawScores.keywordMatch) || 0)),
      skillsMatch: Math.min(100, Math.max(0, Number(rawScores.skillsMatch) || 0)),
      experienceMatch: Math.min(100, Math.max(0, Number(rawScores.experienceMatch) || 0)),
      titleMatch: Math.min(100, Math.max(0, Number(rawScores.titleMatch) || 0)),
      educationMatch: Math.min(100, Math.max(0, Number(rawScores.educationMatch) || 0)),
      structure: Math.min(100, Math.max(0, Number(rawScores.structure) || 0)),
      readability: Math.min(100, Math.max(0, Number(rawScores.readability) || 0)),
    };

    const weightedScore =
      clampedScores.keywordMatch * ATS_WEIGHTS.keywordMatch +
      clampedScores.skillsMatch * ATS_WEIGHTS.skillsMatch +
      clampedScores.experienceMatch * ATS_WEIGHTS.experienceMatch +
      clampedScores.titleMatch * ATS_WEIGHTS.titleMatch +
      clampedScores.educationMatch * ATS_WEIGHTS.educationMatch +
      clampedScores.structure * ATS_WEIGHTS.structure +
      clampedScores.readability * ATS_WEIGHTS.readability;

    const overallScore = Math.round(weightedScore);
    const matchLabel = getMatchLabel(overallScore);

    const summaryMessage =
      overallScore >= 80
        ? "Your resume strongly aligns with this job description with high keyword and skills coverage."
        : overallScore >= 60
        ? "Your resume is a fair match. Adding missing key competencies could significantly boost your ranking."
        : "Significant skill and experience gaps detected for this specific role. Review the recommendations below.";

    // 5. Save Analysis Report to MongoDB
    const reportData = {
      userId,
      resumeId: resumeDoc ? resumeDoc._id : null,
      resumeTitle,
      jobTitle: customJobTitle || parsedResult.jobTitle || "Target Role",
      jobDescription: trimmedJd,
      overallScore,
      summary: {
        label: matchLabel,
        message: summaryMessage,
      },
      scores: clampedScores,
      skills: parsedResult.skills || { matched: [], missing: [], partial: [] },
      keywords: parsedResult.keywords || { matched: [], missing: [], important: [] },
      experience: parsedResult.experience || { requiredYears: 0, resumeYears: 0, score: 0 },
      strengths: parsedResult.strengths || [],
      improvements: parsedResult.improvements || [],
      atsIssues: parsedResult.atsIssues || [],
      recommendations: parsedResult.recommendations || [],
    };

    const createdReport = await AtsReport.create(reportData);

    return res.status(200).json({
      message: "ATS analysis complete",
      report: createdReport,
    });
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    return res.status(400).json({
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

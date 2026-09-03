import fs from "fs";
import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
import { extractPdfText } from "../utils/pdfExtractor.js";

/**
 * Controller for enhancing a resume's professional summary
 * POST: /api/ai/enhance-pro-sum
 * Accepts: { summary } or { userContent }
 */
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { summary, userContent } = req.body;
    const contentToEnhance = summary || userContent;

    if (!contentToEnhance || !contentToEnhance.trim()) {
      return res.status(400).json({ message: "Professional summary is required" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-3.5-flash-lite",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer and ATS specialist. Your task is to enhance the provided professional summary. The summary should be 2-3 concise, impactful sentences highlighting key strengths, quantifiable achievements, and career goals. Make it compelling, professional, and ATS-optimized. Return ONLY the enhanced summary text, with no explanations, markdown quotes, or additional options.",
        },
        {
          role: "user",
          content: `Enhance this professional summary: "${contentToEnhance.trim()}"`,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content.trim();
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("AI Summary Error:", error);
    return res.status(400).json({ message: error.message || "Failed to enhance summary" });
  }
};

/**
 * Controller for enhancing a resume's job description
 * POST: /api/ai/enhance-job-desc
 * Accepts: { description, position, company } or { userContent }
 */
export const enhanceJobDescription = async (req, res) => {
  try {
    const { description, position, company, userContent } = req.body;

    let promptContent = "";
    if (userContent) {
      promptContent = userContent;
    } else if (description) {
      promptContent = `Job Description: ${description.trim()}${
        position ? `\nPosition: ${position.trim()}` : ""
      }${company ? `\nCompany: ${company.trim()}` : ""}`;
    } else {
      return res.status(400).json({ message: "Job description is required" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-3.5-flash-lite",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer and ATS specialist. Your task is to enhance the provided job experience description into strong, action-oriented bullet points or concise sentences. Use powerful action verbs, highlight achievements with metrics where relevant, and optimize for ATS scanning. Return ONLY the enhanced description text, with no markdown quotes or extra commentary.",
        },
        {
          role: "user",
          content: `Enhance this job experience:\n${promptContent}`,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content.trim();
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("AI Job Description Error:", error);
    return res.status(400).json({ message: error.message || "Failed to enhance job description" });
  }
};

/**
 * Controller for parsing an uploaded PDF resume and saving to MongoDB
 * POST: /api/ai/upload-resume
 * Accepts: Multipart PDF file (req.file) OR JSON { resumeText, title }
 */
export const uploadResume = async (req, res) => {
  let tempFilePath = req.file?.path;

  try {
    const userId = req.userId;
    let title = req.body.title || "Imported Resume";
    let extractedResumeText = req.body.resumeText || "";

    // If PDF file was uploaded via multipart/form-data
    if (req.file) {
      const dataBuffer = fs.readFileSync(req.file.path);
      extractedResumeText = await extractPdfText(dataBuffer);

      if (!req.body.title && req.file.originalname) {
        title = req.file.originalname.replace(/\.pdf$/i, "");
      }
    }

    if (!extractedResumeText || extractedResumeText.trim().length < 20) {
      return res.status(400).json({
        message: "Could not extract text from the resume. Please ensure the PDF has selectable text.",
      });
    }

    const systemPrompt =
      "You are an expert AI resume data extractor. Parse the provided resume text and structure all sections into clean, valid JSON matching the exact schema requested.";

    const userPrompt = `Extract structured data from this resume:
${extractedResumeText}

Provide data in the following JSON format with no additional markdown wrapper or conversational text:
{
  "professional_summary": "Extracted summary or empty string",
  "skills": ["Skill 1", "Skill 2"],
  "personal_info": {
    "image": "",
    "full_name": "Full Name",
    "profession": "Profession",
    "email": "Email",
    "phone": "Phone",
    "location": "Location",
    "linkedin": "LinkedIn URL",
    "website": "Website URL"
  },
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM or Present",
      "description": "Responsibilities and accomplishments",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "Project Name",
      "type": "Project Category/Type",
      "description": "Project details"
    }
  ],
  "education": [
    {
      "institution": "Institution Name",
      "degree": "Degree",
      "field": "Field of Study",
      "graduation_date": "YYYY-MM",
      "gpa": "GPA"
    }
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

    let extractedData = response.choices[0]?.message?.content?.trim() || "{}";
    if (extractedData.startsWith("```")) {
      extractedData = extractedData
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
    }
    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({
      userId,
      title: title.trim(),
      ...parsedData,
    });

    return res.status(200).json({
      message: "Resume imported and parsed successfully",
      resumeId: newResume._id,
      resume: newResume,
    });
  } catch (error) {
    console.error("AI Upload Resume Error:", error);
    return res.status(400).json({ message: error.message || "Failed to parse resume" });
  } finally {
    // Clean up temporary uploaded file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkErr) {
        console.warn("Could not delete temp file:", unlinkErr);
      }
    }
  }
};

/**
 * Controller for Deep Gemini AI ATS X-Ray Audit
 * POST: /api/ai/xray-audit
 * Accepts: { resumeData }
 */
export const runAtsXRayAudit = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({ message: "Valid resume data is required for X-Ray audit" });
    }

    const systemPrompt = `You are an elite Enterprise ATS Engineering Architect and Silicon Valley Executive Technical Recruiter.
You are running a deep-level "ATS X-Ray Scanner Audit" on a candidate's resume to assess parser compatibility (Workday, Taleo, Greenhouse, Lever), 6-second recruiter impression, bullet point strength (STAR metrics), and keyword density.

Analyze the provided resume data thoroughly and output a strictly valid JSON object with the following schema:
{
  "geminiScore": <number between 40 and 99 reflecting ATS & recruiter strength>,
  "recruiterImpression": "<2-sentence executive summary of how an executive recruiter perceives this resume in the first 6 seconds>",
  "parserHealth": "<e.g. 100% Workday & Taleo Clean or 85% Notice>",
  "strengths": [
    "<highlight of strongest section or phrasing>",
    "<highlight of quantified impact or architecture skill>"
  ],
  "criticalWarnings": [
    "<critical weakness or missing metric warning>",
    "<formatting or keyword density advisory>"
  ],
  "bulletRewrites": [
    {
      "original": "<an actual weak or unquantified bullet extracted from the candidate's resume>",
      "optimized": "<a powerful, high-impact STAR rewrite of that bullet with quantifiable metrics and action verbs>",
      "rationale": "<brief explanation of why this rewrite scores higher on ATS>"
    }
  ],
  "recommendedKeywords": [
    "<5 to 8 high-gravity industry skills and competencies recommended for this candidate's target role>"
  ],
  "actionVerbCoverage": "<percentage or assessment like High (92%)>"
}

Ensure all JSON strings are properly escaped. Do not output markdown codeblocks. Return ONLY valid JSON.`;

    const userPrompt = `Candidate Resume Data:
${JSON.stringify(resumeData, null, 2)}`;

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
      rawOutput = rawOutput
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
    }

    const auditReport = JSON.parse(rawOutput);

    return res.status(200).json({
      success: true,
      report: auditReport,
    });
  } catch (error) {
    console.error("Gemini ATS X-Ray Audit Error:", error);
    return res.status(500).json({ message: error.message || "Failed to complete Gemini ATS X-Ray Audit" });
  }
};
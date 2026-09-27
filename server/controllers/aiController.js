import fs from "fs";
import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
import { extractDocumentText } from "../utils/documentExtractor.js";

/**
 * Controller for real-time streaming AI suggestions (Server-Sent Events)
 * POST: /api/ai/stream-suggest
 * Accepts: { prompt, type: "summary" | "bullet" | "skills" }
 */
export const streamAiSuggestions = async (req, res) => {
  try {
    const { prompt, type = "summary" } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let systemPrompt = "You are an expert resume writer. Craft a high-impact, ATS-optimized 2-3 sentence professional summary based on the input.";
    if (type === "bullet") {
      systemPrompt = "You are an ATS resume editor. Enhance the provided experience or project into strong, metric-driven STAR bullet points with action verbs. Output directly without conversational preamble.";
    } else if (type === "skills") {
      systemPrompt = "You are a technical recruiter. Suggest the top 10 in-demand technical and soft skills for the provided role or domain as a comma-separated list.";
    }

    const stream = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-3.5-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt.trim() },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("AI Stream Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: error.message });
    }
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

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
 * Controller for parsing an uploaded PDF/DOC/DOCX resume and saving/updating in MongoDB
 * POST: /api/ai/upload-resume
 * Accepts: Multipart file (req.file) OR JSON { resumeText, title, resumeId }
 */
export const uploadResume = async (req, res) => {
  let tempFilePath = req.file?.path;

  try {
    const userId = req.userId;
    let title = req.body.title || "Imported Resume";
    const existingResumeId = req.body.resumeId;
    let extractedResumeText = req.body.resumeText || "";

    // If file was uploaded via multipart/form-data (PDF, DOC, DOCX, TXT)
    if (req.file) {
      const dataBuffer = fs.readFileSync(req.file.path);
      extractedResumeText = await extractDocumentText(
        dataBuffer,
        req.file.originalname,
        req.file.mimetype
      );

      if (!req.body.title && req.file.originalname) {
        title = req.file.originalname.replace(/\.(pdf|docx?|txt)$/i, "");
      }
    }

    if (!extractedResumeText || extractedResumeText.trim().length < 20) {
      return res.status(400).json({
        message: "Could not extract readable text from the document. Please ensure the file has selectable text.",
      });
    }

    const systemPrompt =
      "You are an expert AI resume data extractor and layout analysis specialist. Parse the provided resume text and structure ALL information into clean, valid JSON matching the exact schema requested. Extract EVERY SINGLE DETAIL with zero data loss. CRITICAL: Preserve the exact heading sequence / section order of the original resume in 'section_order' (e.g. ['summary', 'skills', 'experience', 'education', ...]). If the resume contains extra sections like languages, volunteer experience, publications, organizations, honors, summary highlights, or interests, capture them completely in 'languages' or 'custom_sections'. Also detect the most appropriate visual template from ['classic', 'modern', 'minimal', 'executive', 'minimal-image', 'boardroom', 'skill-bullet', 'ivy-league', 'nova-sidebar', 'apex-grid'].";

    const userPrompt = `Extract structured data from this resume text with 100% completeness:
${extractedResumeText}

Provide data in the following JSON format with no additional markdown wrapper or conversational text:
{
  "template": "classic | modern | minimal | executive | minimal-image | boardroom | skill-bullet | ivy-league | nova-sidebar | apex-grid",
  "section_order": [
    "Order of sections exactly as they appear in the original uploaded document from top to bottom. Valid keys: 'summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'achievements', 'languages', 'personal_details', 'declaration', 'custom_sections'"
  ],
  "professional_summary": "Extracted professional summary or career profile",
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "personal_info": {
    "image": "",
    "full_name": "Full Name",
    "profession": "Job Title / Professional Headline",
    "email": "Email Address",
    "phone": "Phone Number",
    "location": "City, State / Country",
    "linkedin": "LinkedIn URL",
    "github": "GitHub URL",
    "website": "Portfolio / Personal Website URL"
  },
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Position / Title",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM or Present",
      "description": "Responsibilities and accomplishments (bullet points or clean sentences)",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "Project Name",
      "type": "Project Category / Tech Stack",
      "description": "Project details and outcomes"
    }
  ],
  "education": [
    {
      "institution": "University / College / School Name",
      "degree": "Degree / Qualification (e.g. Bachelor of Science)",
      "field": "Major / Field of Study",
      "graduation_date": "YYYY-MM",
      "gpa": "GPA / Grade"
    }
  ],
  "certifications": [
    {
      "name": "Certification Title",
      "issuer": "Issuing Organization",
      "date": "YYYY-MM",
      "url": "Verification URL if mentioned"
    }
  ],
  "achievements": [
    {
      "title": "Achievement Title / Honor",
      "date": "YYYY-MM",
      "description": "Details about the honor or milestone"
    }
  ],
  "languages": [
    {
      "language": "Language Name (e.g. English, Spanish, Hindi)",
      "proficiency": "Proficiency Level (e.g. Native, Fluent, Intermediate, Professional Working)"
    }
  ],
  "personal_details": {
    "date_of_birth": "YYYY-MM-DD or Date string if present",
    "gender": "Gender if present",
    "nationality": "Nationality if present",
    "marital_status": "Marital status if present",
    "passport_no": "Passport or ID number if present",
    "address": "Permanent or Residential address if present"
  },
  "declaration": {
    "statement": "Declaration statement text if present in resume",
    "place": "Place / City mentioned in declaration",
    "date": "Date mentioned in declaration",
    "name": "Signatory candidate name"
  },
  "custom_sections": [
    {
      "title": "Section Title (e.g. Volunteer Experience, Publications, Leadership & Activities, Interests)",
      "items": [
        {
          "title": "Item Title / Role / Publication Name",
          "subtitle": "Organization / Venue / Additional context",
          "date": "Date or Date Range",
          "description": "Full details, bullet points, or description"
        }
      ]
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
    
    const firstBrace = extractedData.indexOf("{");
    const lastBrace = extractedData.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      extractedData = extractedData.slice(firstBrace, lastBrace + 1);
    }

    let parsedData = {};
    try {
      parsedData = JSON.parse(extractedData);
    } catch (parseErr) {
      const sanitized = extractedData.replace(/,\s*([\]}])/g, "$1");
      parsedData = JSON.parse(sanitized);
    }

    const normalized = {
      template: parsedData.template || "classic",
      section_order: Array.isArray(parsedData.section_order) ? parsedData.section_order : [],
      personal_info: {
        image: parsedData.personal_info?.image || "",
        full_name: parsedData.personal_info?.full_name || parsedData.personal_info?.name || "",
        profession: parsedData.personal_info?.profession || parsedData.personal_info?.title || parsedData.personal_info?.headline || "",
        email: parsedData.personal_info?.email || "",
        phone: parsedData.personal_info?.phone || "",
        location: parsedData.personal_info?.location || parsedData.personal_info?.address || "",
        linkedin: parsedData.personal_info?.linkedin || "",
        github: parsedData.personal_info?.github || "",
        website: parsedData.personal_info?.website || parsedData.personal_info?.portfolio || "",
      },
      professional_summary: parsedData.professional_summary || parsedData.summary || parsedData.profile || "",
      skills: Array.isArray(parsedData.skills)
        ? parsedData.skills.map((s) => (typeof s === "object" ? (s.name || s.skill || JSON.stringify(s)) : String(s))).filter(Boolean)
        : [],
      experience: Array.isArray(parsedData.experience)
        ? parsedData.experience
        : (Array.isArray(parsedData.work_experience) ? parsedData.work_experience : []),
      education: Array.isArray(parsedData.education) ? parsedData.education : [],
      project: Array.isArray(parsedData.project)
        ? parsedData.project
        : (Array.isArray(parsedData.projects) ? parsedData.projects : []),
      certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
      achievements: Array.isArray(parsedData.achievements) ? parsedData.achievements : [],
      languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
      personal_details: {
        date_of_birth: parsedData.personal_details?.date_of_birth || parsedData.personal_details?.dob || "",
        gender: parsedData.personal_details?.gender || "",
        nationality: parsedData.personal_details?.nationality || "",
        marital_status: parsedData.personal_details?.marital_status || "",
        passport_no: parsedData.personal_details?.passport_no || parsedData.personal_details?.passport || "",
        address: parsedData.personal_details?.address || "",
      },
      declaration: {
        statement: parsedData.declaration?.statement || parsedData.declaration?.text || "",
        place: parsedData.declaration?.place || "",
        date: parsedData.declaration?.date || "",
        name: parsedData.declaration?.name || "",
      },
      custom_sections: Array.isArray(parsedData.custom_sections) ? parsedData.custom_sections : [],
    };

    let targetResume;

    if (existingResumeId) {
      targetResume = await Resume.findOneAndUpdate(
        { _id: existingResumeId, userId },
        {
          ...(title ? { title: title.trim() } : {}),
          ...normalized,
        },
        { new: true }
      );
    }

    if (!targetResume) {
      targetResume = await Resume.create({
        userId,
        title: title.trim(),
        ...normalized,
      });
    }

    return res.status(200).json({
      message: "Resume imported and parsed successfully",
      resumeId: targetResume._id,
      resume: targetResume,
    });
  } catch (error) {
    console.error("AI Upload Resume Error:", error);
    return res.status(400).json({ message: error.message || "Failed to parse resume document" });
  } finally {
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
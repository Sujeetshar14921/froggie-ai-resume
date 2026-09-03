import ai from "../../configs/ai.js";

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
 * Convert structured Resume document into plain text for ATS Evaluation
 */
export const formatResumeTextForAts = (resumeDoc) => {
  if (!resumeDoc) return "";

  return `
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
};

/**
 * Core Gemini ATS Semantic Evaluation Engine
 * Evaluates candidate resume text against target job description or role requirements
 * Applies strict set-intersection mathematics to prevent score hallucinations
 *
 * @param {Object} options
 * @param {string} options.resumeText - Full plain text of the candidate's resume
 * @param {string} options.jobDescription - Target job description or benchmark
 * @param {string} options.targetRole - Optional override role title
 * @param {Object} options.aiClient - Universal AI client
 * @returns {Promise<Object>} Evaluated ATS Report
 */
export const evaluateResumeWithGemini = async ({
  resumeText,
  jobDescription,
  targetRole,
  aiClient = ai,
}) => {
  const trimmedJd = (jobDescription || "").trim();

  const systemPrompt = `You are an elite, highly accurate Applicant Tracking System (ATS) Parser and Evaluation Engine (emulating Workday, Taleo, Greenhouse, and Eightfold AI).
Your task is to mathematically and semantically evaluate a candidate's resume against a target job description.

CRITICAL RULES FOR REALISTIC & ACCURATE ATS SCORING:
1. Ground every single evaluation in the provided resume text and job description. Never invent, hallucinate, or inflate experience.
2. Extract ALL mandatory and preferred technical keywords, tools, frameworks, and domain concepts from the Job Description into keywords.important.
3. Compare against the candidate resume with surgical precision:
   - keywords.matched: Keywords that explicitly appear in or are directly demonstrated by the resume.
   - keywords.missing: Required or preferred keywords that are completely absent from the resume.
   - skills.matched: Hard and soft skills present in the resume that the JD asks for.
   - skills.missing: Skills required or mentioned in the JD that the candidate lacks.
   - skills.partial: Skills where candidate has related experience but lacks exact tool.
4. Calculate rigorous subscores (0-100):
   - keywordMatch: Exactly round((matchedKeywords.length / (matchedKeywords.length + missingKeywords.length)) * 100). (Do NOT default to 80 or 85. If 2 of 10 match, score is 20).
   - skillsMatch: Exactly round((matchedSkills.length / (matchedSkills.length + missingSkills.length)) * 100).
   - titleMatch: 90-100 if candidate's current or past title matches target role; 60-80 if related; 10-35 if unrelated.
   - experienceMatch: Math.min(100, Math.round((candidateYears / requiredYears) * 100)).
   - educationMatch: 100 if candidate meets or exceeds JD requirements, 50-70 if unrelated field.
   - structure: (0-100) Based on presence of clean sections (Contact, Summary, Experience, Skills, Education).
   - readability: (0-100) ATS format compliance and clarity of bullet points.
5. Return strictly valid JSON matching the schema. No markdown fences.`;

  const userPrompt = `Job Description / Requirements:
${trimmedJd}

Candidate Resume:
${resumeText}

Analyze and return JSON matching this exact structure:
{
  "jobTitle": "Target job title identified from JD",
  "scores": {
    "keywordMatch": 0,
    "skillsMatch": 0,
    "experienceMatch": 0,
    "titleMatch": 0,
    "educationMatch": 0,
    "structure": 0,
    "readability": 0
  },
  "skills": {
    "matched": [],
    "missing": [],
    "partial": []
  },
  "keywords": {
    "matched": [],
    "missing": [],
    "important": []
  },
  "experience": {
    "requiredYears": 0,
    "resumeYears": 0,
    "score": 0,
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
    "Tip 1",
    "Tip 2"
  ]
}`;

  const response = await aiClient.chat.completions.create({
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

  // Deterministic Mathematical Set-Theoretic Scoring Verification
  const matchedKws = Array.isArray(parsedResult.keywords?.matched) ? parsedResult.keywords.matched.length : 0;
  const missingKws = Array.isArray(parsedResult.keywords?.missing) ? parsedResult.keywords.missing.length : 0;
  const totalKws = matchedKws + missingKws;
  const verifiedKeywordScore = totalKws > 0
    ? Math.round((matchedKws / totalKws) * 100)
    : Math.min(100, Math.max(0, Number(parsedResult.scores?.keywordMatch) || 0));

  const matchedSks = Array.isArray(parsedResult.skills?.matched) ? parsedResult.skills.matched.length : 0;
  const missingSks = Array.isArray(parsedResult.skills?.missing) ? parsedResult.skills.missing.length : 0;
  const totalSks = matchedSks + missingSks;
  const verifiedSkillsScore = totalSks > 0
    ? Math.round((matchedSks / totalSks) * 100)
    : Math.min(100, Math.max(0, Number(parsedResult.scores?.skillsMatch) || 0));

  const clampedScores = {
    keywordMatch: verifiedKeywordScore,
    skillsMatch: verifiedSkillsScore,
    experienceMatch: Math.min(100, Math.max(0, Number(parsedResult.scores?.experienceMatch) || 0)),
    titleMatch: Math.min(100, Math.max(0, Number(parsedResult.scores?.titleMatch) || 0)),
    educationMatch: Math.min(100, Math.max(0, Number(parsedResult.scores?.educationMatch) || 0)),
    structure: Math.min(100, Math.max(0, Number(parsedResult.scores?.structure) || 0)),
    readability: Math.min(100, Math.max(0, Number(parsedResult.scores?.readability) || 0)),
  };

  const weightedScore =
    clampedScores.keywordMatch * ATS_WEIGHTS.keywordMatch +
    clampedScores.skillsMatch * ATS_WEIGHTS.skillsMatch +
    clampedScores.experienceMatch * ATS_WEIGHTS.experienceMatch +
    clampedScores.titleMatch * ATS_WEIGHTS.titleMatch +
    clampedScores.educationMatch * ATS_WEIGHTS.educationMatch +
    clampedScores.structure * ATS_WEIGHTS.structure +
    clampedScores.readability * ATS_WEIGHTS.readability;

  const overallScore = Math.min(100, Math.max(5, Math.round(weightedScore)));
  const matchLabel = getMatchLabel(overallScore);

  const summaryMessage =
    overallScore >= 80
      ? "Your resume demonstrates excellent alignment with this role, covering primary technical keywords and core competencies."
      : overallScore >= 60
      ? "Your resume is a fair match. Closing the keyword and domain experience gap will significantly boost your ATS ranking."
      : overallScore >= 40
      ? "Noticeable skill and experience gaps detected. Consider targeting missing high-gravity keywords to qualify for recruiter review."
      : "Low alignment detected for this specific position. Significant domain, skill, or seniority discrepancies present.";

  return {
    jobTitle: targetRole || parsedResult.jobTitle || "Target Role",
    overallScore,
    matchLabel,
    summaryMessage,
    scores: clampedScores,
    skills: parsedResult.skills || { matched: [], missing: [], partial: [] },
    keywords: parsedResult.keywords || { matched: [], missing: [], important: [] },
    experience: parsedResult.experience || { requiredYears: 0, resumeYears: 0, score: 0, analysis: "" },
    strengths: parsedResult.strengths || [],
    improvements: parsedResult.improvements || [],
    atsIssues: parsedResult.atsIssues || [],
    recommendations: parsedResult.recommendations || [],
  };
};

export default {
  ATS_WEIGHTS,
  getMatchLabel,
  formatResumeTextForAts,
  evaluateResumeWithGemini,
};

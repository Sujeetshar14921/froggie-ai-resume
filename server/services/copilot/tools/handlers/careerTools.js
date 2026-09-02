import Resume from "../../../../models/Resume.js";
import { formatResumeContext } from "../../contextFormatter.js";

/**
 * Career & Intelligence Tools
 * Powers ATS analysis, JD matching, Resume Tailoring, Cover Letters, Interview Prep, LinkedIn, and Career paths.
 */

export const calculateAtsScoreHandler = async ({
  userId,
  args,
  activeResumeId,
  aiClient,
}) => {
  const { resumeId, jobDescription, targetRole } = args || {};
  const targetId = resumeId || activeResumeId;

  let resumeDoc = null;
  if (targetId) {
    resumeDoc = await Resume.findOne({ _id: targetId, userId });
  } else {
    resumeDoc = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  if (!resumeDoc) {
    return {
      success: false,
      message: "No resume found to analyze. Please create or upload a resume first.",
    };
  }

  const resumeContext = formatResumeContext(resumeDoc);

  const prompt = `You are a strict ATS compliance scanner. Analyze the candidate resume against industry standards and the target job description if provided.
Target Role: ${targetRole || resumeDoc.personal_info?.profession || "Target Role"}
Target Job Description: ${jobDescription || "Standard industry standards for this role"}

Candidate Resume:
${resumeContext}

Return valid JSON:
{
  "overallScore": 85,
  "ratingLabel": "Strong Match",
  "targetRole": "${targetRole || resumeDoc.personal_info?.profession || "Target Role"}",
  "breakdown": {
    "keywordMatch": 88,
    "skillsMatch": 85,
    "experienceMatch": 80,
    "titleMatch": 85,
    "educationMatch": 90,
    "structure": 95,
    "readability": 90
  },
  "matchedSkills": ["Skill 1", "Skill 2"],
  "missingSkills": ["Missing Skill 1"],
  "priorityKeywordsFound": ["Keyword 1"],
  "missingPriorityKeywords": ["Keyword 2"],
  "actionableRecommendations": ["Recommendation 1", "Recommendation 2"]
}`;

  try {
    const res = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an ATS evaluation specialist. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");

    return {
      success: true,
      cardType: "in_chat_ats_score",
      cardData: parsed,
      message: `Your resume ATS Score is **${parsed.overallScore || 85}/100** (${parsed.ratingLabel || "Strong Match"}).`,
    };
  } catch (err) {
    console.error("ATS Score calculation error:", err);
    return {
      success: false,
      message: "Could not calculate ATS score. Please try again.",
    };
  }
};

export const analyzeJobDescriptionHandler = async ({
  userId,
  args,
  activeResumeId,
  aiClient,
}) => {
  const { jobDescription, resumeId } = args || {};
  if (!jobDescription || jobDescription.trim().length < 20) {
    return {
      success: false,
      message: "Please provide a complete job description to analyze.",
    };
  }

  const targetId = resumeId || activeResumeId;
  let resumeDoc = null;
  if (targetId) {
    resumeDoc = await Resume.findOne({ _id: targetId, userId });
  } else {
    resumeDoc = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  const resumeContext = resumeDoc ? formatResumeContext(resumeDoc) : "No resume context.";

  const prompt = `Analyze this Job Description and compare it with the candidate's resume:
Job Description:
${jobDescription}

Candidate Resume:
${resumeContext}

Return valid JSON:
{
  "jobTitle": "Extracted Job Title",
  "overview": "Summary of what this role seeks",
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill3"],
  "whatYouHave": ["skills candidate has"],
  "potentialGaps": ["skills or requirements missing"],
  "whatToHighlight": ["key accomplishments candidate should emphasize"],
  "recommendedResumeChanges": ["tip 1", "tip 2"]
}`;

  try {
    const res = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an expert technical recruiter. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");

    return {
      success: true,
      cardType: "job_analysis",
      cardData: parsed,
      message: `Job Description Analysis complete for **${parsed.jobTitle || "the target role"}**.`,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to analyze job description: " + err.message,
    };
  }
};

export const tailorResumeForJobHandler = async ({
  userId,
  user,
  args,
  activeResumeId,
  aiClient,
}) => {
  const { jobDescription, resumeId, saveAsNewVersion = true } = args || {};
  const targetId = resumeId || activeResumeId;

  let originalResume = null;
  if (targetId) {
    originalResume = await Resume.findOne({ _id: targetId, userId });
  } else {
    originalResume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  if (!originalResume) {
    return {
      success: false,
      message: "No resume found to tailor. Please create a resume first.",
    };
  }

  const prompt = `You are an elite executive resume tailoring expert.
STRICT FACTUAL ACCURACY RULE:
- Do NOT invent fake metrics, fake employers, fake degrees, or fake years of experience.
- Reword the candidate's real experience bullets using high-impact action verbs and ATS keywords matching the target JD.
- Optimize the professional summary for this target job.
- Merge missing technical keywords into skills only if they align with candidate's background.

Target Job Description:
${jobDescription}

Original Resume:
${formatResumeContext(originalResume)}

Return valid JSON:
{
  "targetRole": "Role name",
  "summaryOfChanges": "Tailored professional summary, enhanced experience bullets, and aligned skills for the target role.",
  "updates": {
    "professional_summary": "Tailored 2-3 sentence summary",
    "skills": ["Updated", "Skills", "Array"],
    "experience": [
      {
        "company": "Original Company",
        "position": "Original Position",
        "start_date": "Original Date",
        "end_date": "Original Date",
        "description": "Tailored strong STAR bullets",
        "is_current": false
      }
    ]
  }
}`;

  try {
    const res = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a resume tailoring specialist. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");
    const updates = parsed.updates || {};

    if (saveAsNewVersion) {
      const newTitle = `${originalResume.title} (Tailored for ${parsed.targetRole || "Target Job"})`;
      const newDoc = await Resume.create({
        userId,
        title: newTitle,
        template: originalResume.template || "classic",
        accent_color: originalResume.accent_color || "#10B981",
        personal_info: originalResume.personal_info || {},
        professional_summary: updates.professional_summary || originalResume.professional_summary,
        skills: updates.skills || originalResume.skills,
        experience: updates.experience || originalResume.experience,
        project: originalResume.project,
        education: originalResume.education,
        certifications: originalResume.certifications,
        achievements: originalResume.achievements,
      });

      return {
        success: true,
        action: "tailored_resume_created",
        resumeId: newDoc._id,
        resumeTitle: newDoc.title,
        message: `Created tailored resume version: "${newDoc.title}". Original resume preserved intact!`,
        cardType: "direct_resume_update",
        cardData: {
          isNewResume: true,
          action: "create_resume",
          targetRole: parsed.targetRole,
          resumeTitle: newDoc.title,
          summaryOfChanges: parsed.summaryOfChanges || "Tailored for job description without altering original.",
          affectedSections: ["professional_summary", "skills", "experience"],
          updates: {
            professional_summary: newDoc.professional_summary,
            skills: newDoc.skills,
            experience: newDoc.experience,
          },
        },
      };
    }

    return {
      success: true,
      cardType: "direct_resume_update",
      cardData: {
        isNewResume: false,
        action: "update_resume",
        targetRole: parsed.targetRole,
        resumeTitle: originalResume.title,
        summaryOfChanges: parsed.summaryOfChanges,
        affectedSections: Object.keys(updates),
        updates,
      },
      message: "Prepared tailored resume adjustments. Review and apply below!",
    };
  } catch (err) {
    return {
      success: false,
      message: "Tailoring failed: " + err.message,
    };
  }
};

export const generateCoverLetterHandler = async ({
  userId,
  args,
  activeResumeId,
  aiClient,
}) => {
  const { resumeId, jobDescription, companyName, roleTitle, tone = "professional" } = args || {};
  const targetId = resumeId || activeResumeId;

  let resumeDoc = null;
  if (targetId) {
    resumeDoc = await Resume.findOne({ _id: targetId, userId });
  } else {
    resumeDoc = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  const resumeContext = resumeDoc ? formatResumeContext(resumeDoc) : "Experienced Candidate";

  const prompt = `Write a personalized, high-converting cover letter based strictly on the candidate's real resume experience and the target job:
Target Company: ${companyName || "Hiring Team"}
Target Role: ${roleTitle || resumeDoc?.personal_info?.profession || "Target Role"}
Tone: ${tone}
Job Description:
${jobDescription || "Standard expectations for this role"}

Candidate Resume:
${resumeContext}

Return valid JSON:
{
  "targetCompany": "${companyName || "Target Company"}",
  "targetRole": "${roleTitle || resumeDoc?.personal_info?.profession || "Target Role"}",
  "body": "Full 3-4 paragraph persuasive cover letter text with greeting and sign-off.",
  "keyHighlights": ["Highlight 1", "Highlight 2"]
}`;

  try {
    const res = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an executive career coach. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");

    return {
      success: true,
      cardType: "cover_letter",
      cardData: {
        targetCompany: parsed.targetCompany || companyName || "Target Company",
        targetRole: parsed.targetRole || roleTitle || "Target Role",
        body: parsed.body || "",
        coverLetter: parsed.body || "",
        keyHighlights: parsed.keyHighlights || [],
      },
      message: `Generated custom cover letter for **${parsed.targetRole}** at **${parsed.targetCompany}**.`,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to generate cover letter: " + err.message,
    };
  }
};

export const generateInterviewQuestionsHandler = async ({
  userId,
  args,
  activeResumeId,
  aiClient,
}) => {
  const { resumeId, category = "All", targetRole } = args || {};
  const targetId = resumeId || activeResumeId;

  let resumeDoc = null;
  if (targetId) {
    resumeDoc = await Resume.findOne({ _id: targetId, userId });
  } else {
    resumeDoc = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  const prompt = `Generate an interview question for this candidate:
Category: ${category}
Role: ${targetRole || resumeDoc?.personal_info?.profession || "Software Professional"}
Resume Context:
${resumeDoc ? formatResumeContext(resumeDoc) : "Candidate background"}

Return valid JSON:
{
  "question": "The interview question",
  "questionType": "${category} Interview",
  "hints": ["STAR framework hint 1", "Key metric or concept to include"],
  "sampleGoodResponse": "Brief outline of what an exceptional answer looks like"
}`;

  try {
    const res = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an expert interviewer. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");

    return {
      success: true,
      cardType: "mock_interview",
      cardData: parsed,
      message: `Here is your practice question for **${parsed.questionType || category}**:`,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to generate interview question: " + err.message,
    };
  }
};

export const generateLinkedinProfileHandler = async ({
  userId,
  args,
  activeResumeId,
  aiClient,
}) => {
  const { resumeId, targetRole } = args || {};
  const targetId = resumeId || activeResumeId;

  let resumeDoc = null;
  if (targetId) {
    resumeDoc = await Resume.findOne({ _id: targetId, userId });
  } else {
    resumeDoc = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  const prompt = `Generate an optimized LinkedIn profile package based on this candidate's resume:
Role: ${targetRole || resumeDoc?.personal_info?.profession || "Tech Professional"}
Resume:
${resumeDoc ? formatResumeContext(resumeDoc) : "Candidate skills and experience"}

Return valid JSON:
{
  "headline": "Compelling 220-character LinkedIn headline with keywords and metrics",
  "about": "Engaging, first-person 3-paragraph About section that tells their story and value proposition",
  "topSkills": ["TopSkill1", "TopSkill2", "TopSkill3", "TopSkill4", "TopSkill5"],
  "featuredExperienceSummary": "2-3 bullet highlights for their latest position"
}`;

  try {
    const res = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a personal branding & LinkedIn optimization coach. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");

    return {
      success: true,
      cardType: "linkedin_profile",
      cardData: parsed,
      message: "Your optimized LinkedIn Profile package is ready! Copy sections directly to your LinkedIn account.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to generate LinkedIn profile: " + err.message,
    };
  }
};

export const careerAnalysisHandler = async ({
  userId,
  args,
  activeResumeId,
  aiClient,
}) => {
  const { resumeId, targetCareer } = args || {};
  const targetId = resumeId || activeResumeId;

  let resumeDoc = null;
  if (targetId) {
    resumeDoc = await Resume.findOne({ _id: targetId, userId });
  } else {
    resumeDoc = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  const prompt = `Analyze this candidate's background and provide strategic Career Copilot guidance:
Target Career / Path: ${targetCareer || "Best matching career paths based on current skills"}
Resume Context:
${resumeDoc ? formatResumeContext(resumeDoc) : "Technical professional"}

Return valid JSON:
{
  "targetCareer": "${targetCareer || "Recommended Career Pathways"}",
  "suitableRoles": [
    {"role": "Role Title", "matchPercentage": 90, "whyFit": "Reason why they fit"}
  ],
  "skillGaps": ["Critical missing skill 1", "Recommended technology 2"],
  "learningRoadmap": [
    {"phase": "Month 1-2: Foundations", "topics": ["Topic A", "Topic B"]},
    {"phase": "Month 3-4: Advanced Systems", "topics": ["Topic C", "Topic D"]}
  ],
  "projectRecommendations": [
    {"title": "Project Name", "description": "What to build to prove mastery"}
  ]
}`;

  try {
    const res = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an elite tech career advisor. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");

    return {
      success: true,
      cardType: "career_analysis",
      cardData: parsed,
      message: `Career trajectory and skill gap analysis for **${parsed.targetCareer || targetCareer || "your career"}**:`,
    };
  } catch (err) {
    return {
      success: false,
      message: "Career analysis failed: " + err.message,
    };
  }
};

export default {
  calculateAtsScoreHandler,
  analyzeJobDescriptionHandler,
  tailorResumeForJobHandler,
  generateCoverLetterHandler,
  generateInterviewQuestionsHandler,
  generateLinkedinProfileHandler,
  careerAnalysisHandler,
};

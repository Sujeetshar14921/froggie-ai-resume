import Resume from "../../../../models/Resume.js";
import { formatResumeContext } from "../../contextFormatter.js";
import {
  formatResumeTextForAts,
  evaluateResumeWithGemini,
} from "../../../ats/atsEngine.js";

/**
 * ATS & Job Analysis Copilot Handlers
 */

export const calculateAtsScoreHandler = async ({
  userId,
  args,
  activeResumeId,
  currentResume,
  aiClient,
}) => {
  const { resumeId, jobDescription, targetRole } = args || {};
  const targetId = resumeId || activeResumeId;

  let resumeDoc = currentResume || null;
  if (!resumeDoc && targetId) {
    resumeDoc = await Resume.findOne({ _id: targetId, userId });
  }
  if (!resumeDoc) {
    resumeDoc = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  }

  if (!resumeDoc) {
    return {
      success: false,
      message: "Aapke account me koi resume nahi mila. Pehle ek resume create karein ya upload karein.",
    };
  }

  const resumeText = formatResumeTextForAts(resumeDoc) || formatResumeContext(resumeDoc);
  const resolvedRole = targetRole || resumeDoc.personal_info?.profession || resumeDoc.title || "Target Role";
  const benchmarkDescription =
    jobDescription && jobDescription.trim().length >= 20
      ? jobDescription.trim()
      : `Standard Enterprise ATS Ingestion Benchmark for "${resolvedRole}". Evaluate core technical keywords, verified skills, action verbs in work experience, quantifiable metrics, and structure.`;

  try {
    const report = await evaluateResumeWithGemini({
      resumeText,
      jobDescription: benchmarkDescription,
      targetRole: resolvedRole,
      aiClient,
    });

    const cardData = {
      overallScore: report.overallScore,
      ratingLabel: report.matchLabel,
      targetRole: resolvedRole,
      breakdown: report.scores,
      matchedSkills: report.skills?.matched || [],
      missingSkills: report.skills?.missing || [],
      priorityKeywordsFound: report.keywords?.matched || [],
      missingPriorityKeywords: report.keywords?.missing || [],
      actionableRecommendations: report.improvements?.length > 0
        ? report.improvements
        : [
            "Add quantifiable metric figures (%, $, scale) to work experience bullets.",
            "Ensure top industry keywords appear in both skills and summary sections.",
          ],
    };

    const resumeTitle = resumeDoc.title || "My Resume";

    return {
      success: true,
      cardType: "in_chat_ats_score",
      cardData,
      message: `Maine aapke selected resume (**"${resumeTitle}"**) ka ATS analysis accurately complete kar liya hai!

📊 **Overall ATS Score:** **${report.overallScore}/100** (${report.matchLabel})
🎯 **Target Role:** **${resolvedRole}**

Niche diye gaye interactive card me section-wise breakdown, matched skills, missing keywords aur improvement tips dekh sakte hain.`,
    };
  } catch (err) {
    console.error("ATS Score calculation error:", err);
    return {
      success: false,
      message: "ATS score calculate karne me dikkat aayi. Kripya dubara prayas karein.",
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

export default {
  calculateAtsScoreHandler,
  analyzeJobDescriptionHandler,
};

import Resume from "../../../../models/Resume.js";
import { formatResumeContext } from "../../contextFormatter.js";

/**
 * Career Coaching, Interview & Trajectory Copilot Handlers
 */

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
  generateInterviewQuestionsHandler,
  careerAnalysisHandler,
};

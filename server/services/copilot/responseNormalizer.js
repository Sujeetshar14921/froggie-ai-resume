/**
 * Clean and strip raw JSON code blocks or wrapped strings from AI response text
 * @param {string} content - Raw AI output string
 * @returns {string} Clean conversational markdown text
 */
export const cleanMessageText = (content) => {
  if (typeof content !== "string") return "";

  let trimmed = content.trim();

  // If text is a stringified JSON object, extract human readable message
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const inner = JSON.parse(trimmed);
      trimmed =
        inner.content ||
        inner.message ||
        inner.summary ||
        inner.explanation ||
        inner.summaryOfChanges ||
        "";
    } catch {
      trimmed = trimmed
        .replace(/```json[\s\S]*?```/gi, "")
        .replace(/```[\s\S]*?```/gi, "")
        .trim();
    }
  } else {
    trimmed = trimmed.replace(/```json[\s\S]*?```/gi, "").trim();
  }

  return trimmed;
};

/**
 * Universal Copilot Response Normalizer
 * Guarantees rich, formatted JSON output and maps variable AI responses into clean structured cards.
 * @param {Object} rawParsed - Parsed JSON from AI output
 * @param {string} rawText - Raw text output from AI
 * @param {Object} currentResume - Active candidate resume object
 */
export const normalizeCopilotResponse = (rawParsed, rawText = "", currentResume = null) => {
  let content =
    rawParsed?.content ||
    rawParsed?.message ||
    rawParsed?.text ||
    rawParsed?.response ||
    rawParsed?.answer ||
    rawParsed?.summary ||
    rawText ||
    "";

  let rawCardType = (rawParsed?.cardType || rawParsed?.type || "none").toLowerCase();
  let cardData = rawParsed?.cardData || rawParsed?.data || rawParsed;

  let cardType = "none";

  // Check if response contains direct resume updates/fields
  const hasResumeFields =
    cardData?.updates ||
    rawParsed?.updates ||
    cardData?.skills ||
    rawParsed?.skills ||
    cardData?.personal_info ||
    rawParsed?.personal_info ||
    cardData?.professional_summary ||
    rawParsed?.professional_summary ||
    (Array.isArray(cardData?.experience) && cardData.experience.length > 0) ||
    (Array.isArray(rawParsed?.experience) && rawParsed.experience.length > 0) ||
    (Array.isArray(cardData?.project) && cardData.project.length > 0) ||
    (Array.isArray(rawParsed?.project) && rawParsed.project.length > 0) ||
    (Array.isArray(cardData?.education) && cardData.education.length > 0) ||
    (Array.isArray(rawParsed?.education) && rawParsed.education.length > 0) ||
    (Array.isArray(cardData?.certifications) && cardData.certifications.length > 0) ||
    (Array.isArray(rawParsed?.certifications) && rawParsed.certifications.length > 0) ||
    (Array.isArray(cardData?.achievements) && cardData.achievements.length > 0) ||
    (Array.isArray(rawParsed?.achievements) && rawParsed.achievements.length > 0);

  // 1. Detect In-Chat ATS Score Audit
  if (
    rawCardType.includes("ats") ||
    rawCardType.includes("score") ||
    rawCardType.includes("compatibility") ||
    (cardData?.overallScore !== undefined && cardData?.breakdown)
  ) {
    cardType = "in_chat_ats_score";
    const score = Number(cardData?.overallScore) || 85;
    let label = cardData?.ratingLabel;
    if (!label) {
      if (score >= 90) label = "Excellent Match";
      else if (score >= 75) label = "Strong Match";
      else if (score >= 60) label = "Fair Match";
      else label = "Needs Improvement";
    }

    cardData = {
      overallScore: score,
      ratingLabel: label,
      targetRole: cardData?.targetRole || currentResume?.personal_info?.profession || "Target Role",
      breakdown: cardData?.breakdown || {
        keywordMatch: Math.min(100, score + 4),
        skillsMatch: score,
        experienceMatch: Math.max(50, score - 5),
        titleMatch: 85,
        educationMatch: 90,
        structure: 95,
        readability: 90,
      },
      matchedSkills: Array.isArray(cardData?.matchedSkills)
        ? cardData.matchedSkills
        : currentResume?.skills?.slice(0, 5) || ["React", "JavaScript"],
      missingSkills: Array.isArray(cardData?.missingSkills) ? cardData.missingSkills : [],
      priorityKeywordsFound: Array.isArray(cardData?.priorityKeywordsFound)
        ? cardData.priorityKeywordsFound
        : [],
      missingPriorityKeywords: Array.isArray(cardData?.missingPriorityKeywords)
        ? cardData.missingPriorityKeywords
        : [],
      actionableRecommendations: Array.isArray(cardData?.actionableRecommendations)
        ? cardData.actionableRecommendations
        : ["Add quantifiable metric bullet points to experience.", "Highlight cloud and API integration skills."],
    };
  }
  // 2. Detect Direct Multi-Field Resume Updates (Any Section Update via Chat)
  else if (
    rawCardType.includes("direct") ||
    rawCardType.includes("update") ||
    rawCardType.includes("modify") ||
    rawCardType.includes("resume_update") ||
    hasResumeFields
  ) {
    cardType = "direct_resume_update";
    const updates = { ...(cardData?.updates || rawParsed?.updates || {}) };

    if (cardData?.skills || rawParsed?.skills) {
      updates.skills = cardData?.skills || rawParsed?.skills;
    }
    if (cardData?.personal_info || rawParsed?.personal_info) {
      updates.personal_info = cardData?.personal_info || rawParsed?.personal_info;
    }
    if (cardData?.professional_summary || rawParsed?.professional_summary) {
      updates.professional_summary = cardData?.professional_summary || rawParsed?.professional_summary;
    }
    if (cardData?.experience || rawParsed?.experience) {
      updates.experience = cardData?.experience || rawParsed?.experience;
    }
    if (cardData?.project || rawParsed?.project) {
      updates.project = cardData?.project || rawParsed?.project;
    }
    if (cardData?.education || rawParsed?.education) {
      updates.education = cardData?.education || rawParsed?.education;
    }
    if (cardData?.certifications || rawParsed?.certifications) {
      updates.certifications = cardData?.certifications || rawParsed?.certifications;
    }
    if (cardData?.achievements || rawParsed?.achievements) {
      updates.achievements = cardData?.achievements || rawParsed?.achievements;
    }

    const affected = Object.keys(updates);
    const isNew =
      Boolean(cardData?.isNewResume || rawParsed?.isNewResume) ||
      (affected.includes("professional_summary") &&
        affected.includes("skills") &&
        affected.includes("experience"));

    const role =
      updates.personal_info?.profession ||
      cardData?.targetRole ||
      rawParsed?.targetRole ||
      "Target Role";

    cardData = {
      action: isNew ? "create_resume" : "update_resume",
      isNewResume: isNew,
      targetRole: role,
      resumeTitle:
        cardData?.resumeTitle ||
        rawParsed?.resumeTitle ||
        `${role} ATS Resume`,
      summaryOfChanges:
        cardData?.summaryOfChanges ||
        rawParsed?.summaryOfChanges ||
        (isNew
          ? `Complete 100% ATS-optimized ${role} resume created.`
          : `Updated ${affected.join(", ") || "resume fields"} with your requested modifications.`),
      affectedSections: affected.length > 0 ? affected : ["skills"],
      updates: updates,
    };
  }
  // 3. Detect Job Description Analysis
  else if (
    rawCardType.includes("job") ||
    rawCardType.includes("jd") ||
    rawCardType.includes("analysis") ||
    cardData?.requiredSkills ||
    cardData?.potentialGaps
  ) {
    cardType = "job_analysis";
    cardData = {
      jobTitle: cardData?.jobTitle || cardData?.title || "Target Role",
      overview: cardData?.overview || cardData?.summary || "",
      requiredSkills: Array.isArray(cardData?.requiredSkills) ? cardData.requiredSkills : [],
      preferredSkills: Array.isArray(cardData?.preferredSkills) ? cardData.preferredSkills : [],
      whatYouHave: Array.isArray(cardData?.whatYouHave) ? cardData.whatYouHave : [],
      potentialGaps: Array.isArray(cardData?.potentialGaps) ? cardData.potentialGaps : [],
      whatToHighlight: Array.isArray(cardData?.whatToHighlight) ? cardData.whatToHighlight : [],
      recommendedResumeChanges: Array.isArray(cardData?.recommendedResumeChanges)
        ? cardData.recommendedResumeChanges
        : [],
    };
  }
  // 4. Detect "Should I Apply?"
  else if (
    rawCardType.includes("should") ||
    rawCardType.includes("apply") ||
    rawCardType.includes("fit") ||
    rawCardType.includes("decision") ||
    cardData?.recommendation
  ) {
    cardType = "should_i_apply";
    const rec = (cardData?.recommendation || "possible_match").toLowerCase();
    const isStrong = rec.includes("strong");
    const isLow = rec.includes("low") || rec.includes("poor");

    cardData = {
      recommendation: isStrong ? "strong_match" : isLow ? "low_match" : "possible_match",
      recommendationLabel: isStrong ? "Strong Match" : isLow ? "Low Match" : "Possible Match",
      technicalFit: Number(cardData?.technicalFit) || 75,
      experienceFit: Number(cardData?.experienceFit) || 70,
      projectRelevance: Number(cardData?.projectRelevance) || 75,
      verdictSummary: cardData?.verdictSummary || cardData?.explanation || cardData?.summary || "",
      strengthsForRole: Array.isArray(cardData?.strengthsForRole) ? cardData.strengthsForRole : [],
      missingRequirements: Array.isArray(cardData?.missingRequirements) ? cardData.missingRequirements : [],
      actionPlan: cardData?.actionPlan || cardData?.nextSteps || "",
    };
  }
  // 5. Detect Mock Interview Question
  else if (
    rawCardType.includes("mock") ||
    rawCardType.includes("question") ||
    (rawCardType.includes("interview") && !rawCardType.includes("eval")) ||
    cardData?.question
  ) {
    cardType = "mock_interview";
    cardData = {
      question:
        cardData?.question ||
        "Tell me about a challenging technical project you led and how you resolved unexpected roadblocks.",
      questionType: cardData?.questionType || "Technical & Behavioral",
      hints: Array.isArray(cardData?.hints)
        ? cardData.hints
        : ["Focus on the STAR method (Situation, Task, Action, Result).", "Quantify measurable impact."],
      sampleGoodResponse: cardData?.sampleGoodResponse || cardData?.idealAnswer || "",
    };
  }
  // 6. Detect Interview Evaluation
  else if (
    rawCardType.includes("eval") ||
    rawCardType.includes("rating") ||
    cardData?.overallRating !== undefined
  ) {
    cardType = "interview_evaluation";
    cardData = {
      overallRating: Number(cardData?.overallRating) || 8,
      strengths: Array.isArray(cardData?.strengths) ? cardData.strengths : [],
      improvements: Array.isArray(cardData?.improvements) ? cardData.improvements : [],
      starFeedback: cardData?.starFeedback || {
        situation: "Clear context provided.",
        task: "Defined objective well.",
        action: "Explained technical implementation.",
        result: "Good outcome, consider adding metrics.",
      },
      polishedAnswer: cardData?.polishedAnswer || "",
    };
  }
  // 7. Detect Single Section Resume Suggestion
  else if (
    rawCardType.includes("suggestion") ||
    rawCardType.includes("rewrite") ||
    cardData?.improvedContent ||
    cardData?.suggested
  ) {
    cardType = "resume_suggestion";
    const suggestedText = cardData?.suggested || cardData?.improvedContent || cardData?.content || "";
    const originalText = cardData?.original || cardData?.originalContent || "";
    const reasonText =
      cardData?.reason || cardData?.improvementRationale || "Optimized for ATS keyword density and recruiter readability.";

    cardData = {
      section: cardData?.section || "summary",
      sectionName: cardData?.sectionName || "Professional Summary",
      suggested: suggestedText,
      improvedContent: suggestedText,
      original: originalText,
      originalContent: originalText,
      reason: reasonText,
      improvementRationale: reasonText,
      actionLabel: cardData?.actionLabel || "Apply to Resume",
    };
  }
  // 8. Detect Cover Letter
  else if (
    rawCardType.includes("cover") ||
    rawCardType.includes("letter") ||
    cardData?.body ||
    cardData?.coverLetter
  ) {
    cardType = "cover_letter";
    const mainLetter = cardData?.coverLetter || cardData?.body || cardData?.letter || (typeof cardData === "string" ? cardData : "");
    cardData = {
      targetCompany: cardData?.targetCompany || cardData?.company || "Target Company",
      targetRole: cardData?.targetRole || cardData?.role || currentResume?.personal_info?.profession || "Target Role",
      body: mainLetter,
      coverLetter: mainLetter,
      keyHighlights: Array.isArray(cardData?.keyHighlights) ? cardData.keyHighlights : [],
    };
  }
  // 9. Detect Recruiter Outreach / LinkedIn Message
  // 10. Detect Action Result (Create, Delete, Update status)
  else if (
    rawCardType.includes("action") ||
    cardData?.status === "success" ||
    cardData?.status === "failed" ||
    cardData?.action
  ) {
    cardType = "action_result";
    cardData = {
      action: cardData?.action || "Action Completed",
      status: cardData?.status || "success",
      resumeId: cardData?.resumeId,
      resumeTitle: cardData?.resumeTitle,
      deletedCount: cardData?.deletedCount,
      message: cardData?.message || "Action performed successfully.",
      buttons: Array.isArray(cardData?.buttons) ? cardData.buttons : [],
    };
  }
  // 11. Detect Confirmation Action (Destructive operation warning)
  else if (
    rawCardType.includes("confirm") ||
    cardData?.requiresConfirmation ||
    cardData?.confirmPayload
  ) {
    cardType = "confirm_action";
    cardData = {
      actionType: cardData?.actionType || "delete_resume",
      targetId: cardData?.targetId,
      targetTitle: cardData?.targetTitle,
      totalCount: cardData?.totalCount,
      message:
        cardData?.message ||
        "This action is permanent and cannot be undone. Are you sure you want to proceed?",
      confirmPayload: cardData?.confirmPayload || {},
    };
  }
  // 12. Detect File List / My Resumes listing
  else if (
    rawCardType.includes("file") ||
    rawCardType.includes("list") ||
    Array.isArray(cardData?.files) ||
    Array.isArray(cardData?.resumes)
  ) {
    cardType = "file_list";
    const files = cardData?.files || cardData?.resumes || [];
    cardData = {
      totalCount: cardData?.totalCount || files.length,
      files: files.map((f) => ({
        _id: f._id || f.id,
        title: f.title || "Untitled Resume",
        profession: f.profession || f.personal_info?.profession || "",
        updatedAt: f.updatedAt,
      })),
    };
  }
  // 13. Detect Career Analysis & Learning Roadmap
  else if (
    rawCardType.includes("career") ||
    cardData?.suitableRoles ||
    cardData?.learningRoadmap ||
    cardData?.skillGaps
  ) {
    cardType = "career_analysis";
    cardData = {
      targetCareer: cardData?.targetCareer || "Career Pathways",
      suitableRoles: Array.isArray(cardData?.suitableRoles) ? cardData.suitableRoles : [],
      skillGaps: Array.isArray(cardData?.skillGaps) ? cardData.skillGaps : [],
      learningRoadmap: Array.isArray(cardData?.learningRoadmap) ? cardData.learningRoadmap : [],
      projectRecommendations: Array.isArray(cardData?.projectRecommendations)
        ? cardData.projectRecommendations
        : [],
    };
  }
  // 14. Detect LinkedIn Profile Package
  else if (
    rawCardType.includes("linkedin_profile") ||
    (cardData?.headline && cardData?.about)
  ) {
    cardType = "linkedin_profile";
    cardData = {
      headline: cardData?.headline || "",
      about: cardData?.about || "",
      topSkills: Array.isArray(cardData?.topSkills) ? cardData.topSkills : [],
      featuredExperienceSummary: cardData?.featuredExperienceSummary || "",
    };
  }

  content = cleanMessageText(content);

  // Ensure content is rich, articulate, and friendly
  if (!content || content.trim().length < 5) {
    if (cardType === "direct_resume_update") {
      content =
        "I have updated your resume with your requested changes. You can review the updated fields below and apply them directly into your resume editor!";
    } else if (cardType === "in_chat_ats_score") {
      content =
        "Here is your full ATS Compatibility Audit with score breakdown, matched vs missing skills, and optimization recommendations.";
    } else if (cardType === "resume_suggestion") {
      content = "Here is an enhanced, high-impact version tailored for recruiters and ATS optimization.";
    } else if (cardType === "job_analysis") {
      content = "Here is my detailed breakdown of the target job description against your resume profile.";
    } else if (cardType === "should_i_apply") {
      content = "Here is your role fit evaluation and recommendation on whether to apply.";
    } else if (cardType === "mock_interview") {
      content = "Let's practice! Here is your tailored interview question based on your background.";
    } else {
      content = "Here are my insights and recommendations for your career goals.";
    }
  }

  return { content, cardType, cardData };
};

export default {
  cleanMessageText,
  normalizeCopilotResponse,
};

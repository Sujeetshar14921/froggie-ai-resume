import Resume from "../../../../models/Resume.js";
import { sanitizeResumeData } from "../../../../controllers/resumeController.js";

/**
 * Resume & File management tool handlers
 * Every operation enforces strict user-scoped multi-tenant isolation with req.userId
 */

export const getUserResumesHandler = async ({ userId }) => {
  const resumes = await Resume.find({ userId })
    .select("title template accent_color personal_info.full_name personal_info.profession skills createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .lean();

  return {
    success: true,
    count: resumes.length,
    resumes: resumes.map((r) => ({
      _id: r._id,
      title: r.title || "Untitled Resume",
      profession: r.personal_info?.profession || "Not specified",
      fullName: r.personal_info?.full_name || "",
      skillsCount: (r.skills || []).length,
      updatedAt: r.updatedAt,
    })),
    cardType: "file_list",
    cardData: {
      totalCount: resumes.length,
      files: resumes.map((r) => ({
        _id: r._id,
        title: r.title || "Untitled Resume",
        profession: r.personal_info?.profession || "",
        updatedAt: r.updatedAt,
      })),
    },
  };
};

export const getActiveResumeHandler = async ({ userId, activeResumeId }) => {
  if (!activeResumeId) {
    // Try to get latest resume
    const latest = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
    if (!latest) {
      return {
        success: false,
        message: "No resume found in your account yet. You can ask me to create one!",
      };
    }
    return {
      success: true,
      resume: latest,
      message: `Active resume: "${latest.title}"`,
    };
  }

  const resume = await Resume.findOne({ _id: activeResumeId, userId });
  if (!resume) {
    return {
      success: false,
      message: "Active resume not found or does not belong to your account.",
    };
  }

  return {
    success: true,
    resume,
  };
};

export const getResumeHandler = async ({ userId, args }) => {
  const { resumeId, title } = args || {};

  let query = { userId };
  if (resumeId) {
    query._id = resumeId;
  } else if (title) {
    query.title = { $regex: new RegExp(title.trim(), "i") };
  } else {
    return {
      success: false,
      message: "Please specify either resumeId or title to search.",
    };
  }

  const resume = await Resume.findOne(query);
  if (!resume) {
    return {
      success: false,
      message: `Could not find any resume matching "${title || resumeId}" in your account.`,
    };
  }

  return {
    success: true,
    resume,
    message: `Found resume: "${resume.title}"`,
  };
};

export const createResumeHandler = async ({ userId, user, args }) => {
  const {
    title,
    profession,
    summary,
    skills,
    experience,
    project,
    education,
    certifications,
    achievements,
  } = args || {};

  const cleanTitle = (title || `${profession || "Professional"} ATS Resume`).trim();

  // Enforce authenticated user's name and email
  const personalInfo = {
    full_name: user?.name || "Candidate Name",
    email: user?.email || "candidate@example.com",
    profession: profession || user?.profession || "",
    phone: user?.phone || "",
    location: user?.location || "",
  };

  const rawResumeData = {
    title: cleanTitle,
    personal_info: personalInfo,
    professional_summary: summary || "",
    skills: Array.isArray(skills) ? skills : [],
    experience: Array.isArray(experience) ? experience : [],
    project: Array.isArray(project) ? project : [],
    education: Array.isArray(education) ? education : [],
    certifications: Array.isArray(certifications) ? certifications : [],
    achievements: Array.isArray(achievements) ? achievements : [],
  };

  const sanitized = sanitizeResumeData(rawResumeData);

  const newResume = await Resume.create({
    userId,
    title: cleanTitle,
    template: "classic",
    accent_color: "#10B981",
    ...sanitized,
  });

  return {
    success: true,
    action: "resume_created",
    resumeId: newResume._id,
    resumeTitle: newResume.title,
    message: `Created new resume "${newResume.title}" successfully!`,
    cardType: "action_result",
    cardData: {
      action: "Resume Created",
      resumeId: newResume._id,
      resumeTitle: newResume.title,
      status: "success",
      message: `Your resume "${newResume.title}" was saved to My Resumes.`,
      viewUrl: `/app/builder/${newResume._id}`,
      buttons: [
        { label: "Open in Editor", action: "navigate", url: `/app/builder/${newResume._id}`, variant: "primary" },
        { label: "View in My Resumes", action: "navigate", url: "/app/my-resumes", variant: "secondary" },
      ],
    },
  };
};

export const createResumeFromDataHandler = async ({ userId, user, args, aiClient }) => {
  const { title, targetRole, rawData, useExistingProfile } = args || {};

  // If rawData is provided, parse it with Gemini
  let parsed = {};
  if (rawData && rawData.trim()) {
    try {
      const systemPrompt = `You are a precise resume information extractor. Parse the supplied user notes or resume text into valid JSON matching this schema:
{
  "profession": "Identified profession",
  "professional_summary": "Clean professional summary without fabricated metrics",
  "skills": ["Skill1", "Skill2"],
  "experience": [{"company": "Company", "position": "Position", "start_date": "", "end_date": "", "description": ""}],
  "project": [{"name": "Project Name", "type": "Category/Tech", "description": ""}],
  "education": [{"institution": "", "degree": "", "field": "", "graduation_date": ""}]
}
STRICT RULE: Do NOT fabricate or invent fake companies, metrics, or years. Use only what is mentioned or leave empty.`;

      const res = await aiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract resume data:\nTarget Role: ${targetRole || "Not specified"}\n\nUser Data:\n${rawData}` },
        ],
        response_format: { type: "json_object" },
      });

      const text = res.choices[0]?.message?.content || "{}";
      parsed = JSON.parse(text);
    } catch (e) {
      console.warn("AI parse error in createResumeFromData:", e.message);
    }
  }

  const role = targetRole || parsed.profession || user?.profession || "Full Stack Developer";
  const resumeTitle = title || `${role} Resume`;

  const personalInfo = {
    full_name: user?.name || "Candidate Name",
    email: user?.email || "candidate@example.com",
    profession: role,
    phone: user?.phone || "",
    location: user?.location || "",
  };

  const combined = {
    title: resumeTitle,
    personal_info: personalInfo,
    professional_summary: parsed.professional_summary || "",
    skills: parsed.skills || [],
    experience: parsed.experience || [],
    project: parsed.project || [],
    education: parsed.education || [],
  };

  const sanitized = sanitizeResumeData(combined);

  const newResume = await Resume.create({
    userId,
    title: resumeTitle,
    template: "classic",
    accent_color: "#10B981",
    ...sanitized,
  });

  return {
    success: true,
    action: "resume_created_from_data",
    resumeId: newResume._id,
    resumeTitle: newResume.title,
    message: `Created structured resume "${newResume.title}" from your provided details.`,
    cardType: "action_result",
    cardData: {
      action: "Resume Created from Data",
      resumeId: newResume._id,
      resumeTitle: newResume.title,
      status: "success",
      message: `Created "${newResume.title}" with verified information.`,
      viewUrl: `/app/builder/${newResume._id}`,
      buttons: [
        { label: "Open in Editor", action: "navigate", url: `/app/builder/${newResume._id}`, variant: "primary" },
        { label: "View in My Resumes", action: "navigate", url: "/app/my-resumes", variant: "secondary" },
      ],
    },
  };
};

export const updateResumeHandler = async ({ userId, args, activeResumeId }) => {
  const { resumeId, updates = {}, summaryOfChanges } = args || {};
  const targetId = resumeId || activeResumeId;

  if (!targetId) {
    return {
      success: false,
      message: "No target resume specified to update.",
    };
  }

  const existing = await Resume.findOne({ _id: targetId, userId });
  if (!existing) {
    return {
      success: false,
      message: "Resume not found or does not belong to your account.",
    };
  }

  const sanitizedUpdates = sanitizeResumeData(updates);

  const updatedResume = await Resume.findOneAndUpdate(
    { _id: targetId, userId },
    sanitizedUpdates,
    { new: true }
  );

  return {
    success: true,
    action: "resume_updated",
    resumeId: updatedResume._id,
    resumeTitle: updatedResume.title,
    summaryOfChanges: summaryOfChanges || "Resume updated successfully",
    updatedResume,
    cardType: "direct_resume_update",
    cardData: {
      action: "update_resume",
      isNewResume: false,
      targetRole: updatedResume.personal_info?.profession || "Target Role",
      resumeTitle: updatedResume.title,
      summaryOfChanges: summaryOfChanges || "Updated resume sections with your modifications.",
      affectedSections: Object.keys(updates),
      updates: sanitizedUpdates,
    },
  };
};

export const updateResumeSectionHandler = async ({
  userId,
  args,
  activeResumeId,
}) => {
  const { resumeId, section, data, mode = "replace", summaryOfChanges } = args || {};
  const targetId = resumeId || activeResumeId;

  if (!targetId) {
    return {
      success: false,
      message: "No target resume specified to update section.",
    };
  }

  const existing = await Resume.findOne({ _id: targetId, userId });
  if (!existing) {
    return {
      success: false,
      message: "Resume not found or does not belong to your account.",
    };
  }

  const validSections = [
    "personal_info",
    "professional_summary",
    "skills",
    "experience",
    "project",
    "education",
    "certifications",
    "achievements",
    "title",
    "accent_color",
    "template",
  ];

  if (!validSections.includes(section)) {
    return {
      success: false,
      message: `Invalid section "${section}". Supported sections: ${validSections.join(", ")}`,
    };
  }

  let finalValue = data;
  if (mode === "append" && Array.isArray(existing[section])) {
    const toAdd = Array.isArray(data) ? data : [data];
    finalValue = [...existing[section], ...toAdd];
  }

  const updateObj = { [section]: finalValue };
  const sanitized = sanitizeResumeData(updateObj);

  const updatedResume = await Resume.findOneAndUpdate(
    { _id: targetId, userId },
    sanitized,
    { new: true }
  );

  return {
    success: true,
    action: "section_updated",
    section,
    resumeId: updatedResume._id,
    resumeTitle: updatedResume.title,
    summaryOfChanges: summaryOfChanges || `Updated ${section.replace(/_/g, " ")} section`,
    cardType: "direct_resume_update",
    cardData: {
      action: "update_resume",
      isNewResume: false,
      targetRole: updatedResume.personal_info?.profession || "",
      resumeTitle: updatedResume.title,
      summaryOfChanges: summaryOfChanges || `Updated ${section.replace(/_/g, " ")} section`,
      affectedSections: [section],
      updates: sanitized,
    },
  };
};

export const deleteResumeHandler = async ({ userId, args }) => {
  const { resumeId, resumeTitle, confirmed } = args || {};

  let query = { userId };
  if (resumeId) {
    query._id = resumeId;
  } else if (resumeTitle) {
    query.title = { $regex: new RegExp(resumeTitle.trim(), "i") };
  } else {
    return {
      success: false,
      message: "Please specify the resume to delete by ID or title.",
    };
  }

  const resume = await Resume.findOne(query);
  if (!resume) {
    return {
      success: false,
      message: "Resume not found or does not belong to your account.",
    };
  }

  // Check confirmation requirement
  if (!confirmed) {
    return {
      success: true,
      requiresConfirmation: true,
      cardType: "confirm_action",
      cardData: {
        actionType: "delete_resume",
        targetId: resume._id,
        targetTitle: resume.title,
        message: `Are you sure you want to delete "${resume.title}"? This action is permanent and cannot be undone.`,
        confirmPayload: {
          resumeId: resume._id,
          confirmed: true,
        },
      },
      message: `Are you sure you want to delete "${resume.title}"? Please confirm to proceed.`,
    };
  }

  // Confirmed deletion
  await Resume.findOneAndDelete({ _id: resume._id, userId });

  return {
    success: true,
    action: "resume_deleted",
    resumeId: resume._id,
    resumeTitle: resume.title,
    message: `Resume "${resume.title}" deleted successfully.`,
    cardType: "action_result",
    cardData: {
      action: "Resume Deleted",
      resumeId: resume._id,
      resumeTitle: resume.title,
      status: "success",
      message: `Resume "${resume.title}" was permanently removed.`,
      buttons: [
        { label: "View Remaining Resumes", action: "navigate", url: "/app/my-resumes", variant: "primary" },
      ],
    },
  };
};

export const deleteAllResumesHandler = async ({ userId, args }) => {
  const { confirmed } = args || {};

  const count = await Resume.countDocuments({ userId });
  if (count === 0) {
    return {
      success: true,
      message: "You do not have any resumes in your account to delete.",
    };
  }

  if (!confirmed) {
    return {
      success: true,
      requiresConfirmation: true,
      cardType: "confirm_action",
      cardData: {
        actionType: "delete_all_resumes",
        totalCount: count,
        message: `⚠️ WARNING: You are about to permanently delete all ${count} resumes in your account. This action cannot be reversed!`,
        confirmPayload: {
          confirmed: true,
        },
      },
      message: `You are about to delete all ${count} resumes in your account. Please confirm if you wish to proceed.`,
    };
  }

  // Confirmed: delete only current user's resumes
  const result = await Resume.deleteMany({ userId });

  return {
    success: true,
    action: "all_resumes_deleted",
    deletedCount: result.deletedCount || count,
    message: `All ${result.deletedCount || count} resumes have been permanently deleted from your account.`,
    cardType: "action_result",
    cardData: {
      action: "All Resumes Deleted",
      deletedCount: result.deletedCount || count,
      status: "success",
      message: `Successfully deleted all ${result.deletedCount || count} resumes.`,
      buttons: [
        { label: "Create New Resume", action: "navigate", url: "/app", variant: "primary" },
      ],
    },
  };
};

export default {
  getUserResumesHandler,
  getActiveResumeHandler,
  getResumeHandler,
  createResumeHandler,
  createResumeFromDataHandler,
  updateResumeHandler,
  updateResumeSectionHandler,
  deleteResumeHandler,
  deleteAllResumesHandler,
};

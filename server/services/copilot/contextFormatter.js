/**
 * Format resume document into a rich structured context string for AI model
 * @param {Object} resume - Full resume document/object
 * @returns {string} Structured plain text context
 */
export const formatResumeContext = (resume) => {
  if (!resume) return "No candidate resume context provided.";

  const name = resume.personal_info?.full_name || "Candidate";
  const profession = resume.personal_info?.profession || "Professional";
  const summary = resume.professional_summary || "None provided";
  const skills = (resume.skills || []).join(", ") || "None listed";

  const experience = (resume.experience || [])
    .map(
      (e, i) =>
        `[#${i + 1}] ${e.position || "Role"} at ${e.company || "Company"} (${e.start_date || ""} to ${
          e.is_current ? "Present" : e.end_date || ""
        }):\n  ${e.description || ""}`
    )
    .join("\n\n");

  const projects = (resume.project || [])
    .map((p, i) => `[#${i + 1}] ${p.name || "Project"} (${p.type || "Project"}):\n  ${p.description || ""}`)
    .join("\n\n");

  const education = (resume.education || [])
    .map(
      (edu, i) =>
        `[#${i + 1}] ${edu.degree || ""} in ${edu.field || ""} from ${edu.institution || ""} (${
          edu.graduation_date || ""
        })`
    )
    .join("\n");

  const certifications = (resume.certifications || [])
    .map(
      (cert, i) =>
        `[#${i + 1}] ${cert.name || "Certification"} from ${cert.issuer || "Issuer"} (${cert.date || ""}) ${
          cert.url ? `- Link: ${cert.url}` : ""
        }`
    )
    .join("\n");

  const achievements = (resume.achievements || [])
    .map(
      (ach, i) =>
        `[#${i + 1}] ${ach.title || "Achievement"} (${ach.date || ""}): ${ach.description || ""}`
    )
    .join("\n");

  return `
CANDIDATE CURRENT RESUME JSON STRUCTURE:
${JSON.stringify(
  {
    personal_info: resume.personal_info || {},
    professional_summary: summary,
    skills: resume.skills || [],
    experience: resume.experience || [],
    project: resume.project || [],
    education: resume.education || [],
    certifications: resume.certifications || [],
    achievements: resume.achievements || [],
  },
  null,
  2
)}

HUMAN-READABLE SUMMARY:
Name: ${name}
Target Role / Profession: ${profession}
Email: ${resume.personal_info?.email || ""}
Phone: ${resume.personal_info?.phone || ""}
Location: ${resume.personal_info?.location || ""}
LinkedIn: ${resume.personal_info?.linkedin || ""}
GitHub: ${resume.personal_info?.github || ""}
Website: ${resume.personal_info?.website || ""}

SUMMARY:
${summary}

SKILLS:
${skills}

EXPERIENCE:
${experience || "None listed"}

PROJECTS:
${projects || "None listed"}

EDUCATION:
${education || "None listed"}

CERTIFICATIONS:
${certifications || "None listed"}

ACHIEVEMENTS:
${achievements || "None listed"}
  `.trim();
};

/**
 * Format both the authenticated user profile and their active resume context
 * Strictly delineating Authenticated User Account Identity vs Resume Document Content.
 *
 * @param {Object} options
 * @param {Object} options.user - Authenticated User document
 * @param {Object} options.resume - Verified user-owned resume document (or null)
 * @param {number} options.resumesCount - Total count of user's resumes
 * @param {Array} options.userResumesList - List of user's resume summaries
 * @returns {string} Fully structured, user-isolated context
 */
export const formatUserAndResumeContext = ({
  user,
  resume,
  resumesCount = 0,
  userResumesList = [],
}) => {
  const accountInfo = `
================================================================================
AUTHENTICATED USER ACCOUNT PROFILE (SOURCE OF TRUTH FOR USER IDENTITY):
- User Account ID: ${user?._id || "Unknown"}
- Account Full Name: ${user?.name || "Candidate"}
- Account Email: ${user?.email || "Not specified"}
- Account Profession: ${user?.profession || "Not specified"}
- Account Phone: ${user?.phone || "Not specified"}
- Account Location: ${user?.location || "Not specified"}
- Total Resumes in Account: ${resumesCount}
- Resumes Owned by User: ${
    userResumesList.length > 0
      ? userResumesList
          .map((r, i) => `#${i + 1} "${r.title || "Untitled"}" (ID: ${r._id})`)
          .join(", ")
      : "None created yet"
  }
================================================================================
`.trim();

  let resumeContext = "";
  if (!resume) {
    resumeContext = `
================================================================================
ACTIVE RESUME STATUS:
No active resume selected or user has not created a resume yet.
If the user asks questions about their resume, explain that no resume is currently attached/selected in their account, and offer to help them build a new one.
================================================================================
`.trim();
  } else {
    const resumeName = resume.personal_info?.full_name || "Not specified";
    const resumeProfession = resume.personal_info?.profession || "Not specified";
    const summary = resume.professional_summary || "None provided";
    const skills = (resume.skills || []).join(", ") || "None listed";

    const experience = (resume.experience || [])
      .map(
        (e, i) =>
          `[#${i + 1}] ${e.position || "Role"} at ${e.company || "Company"} (${e.start_date || ""} to ${
            e.is_current ? "Present" : e.end_date || ""
          }):\n  ${e.description || ""}`
      )
      .join("\n\n");

    const projects = (resume.project || [])
      .map((p, i) => `[#${i + 1}] ${p.name || "Project"} (${p.type || "Project"}):\n  ${p.description || ""}`)
      .join("\n\n");

    const education = (resume.education || [])
      .map(
        (edu, i) =>
          `[#${i + 1}] ${edu.degree || ""} in ${edu.field || ""} from ${edu.institution || ""} (${
            edu.graduation_date || ""
          })`
      )
      .join("\n");

    const certifications = (resume.certifications || [])
      .map(
        (cert, i) =>
          `[#${i + 1}] ${cert.name || "Certification"} from ${cert.issuer || "Issuer"} (${cert.date || ""}) ${
            cert.url ? `- Link: ${cert.url}` : ""
          }`
      )
      .join("\n");

    const achievements = (resume.achievements || [])
      .map(
        (ach, i) =>
          `[#${i + 1}] ${ach.title || "Achievement"} (${ach.date || ""}): ${ach.description || ""}`
      )
      .join("\n");

    resumeContext = `
================================================================================
ACTIVE SELECTED RESUME (VERIFIED & OWNED BY THIS USER):
- Resume ID: ${resume._id || "Unsaved Draft"}
- Resume Title: "${resume.title || "My Resume"}"
- Name Stated on Resume Document: ${resumeName}
- Profession Stated on Resume Document: ${resumeProfession}
- Resume Contact: Email: ${resume.personal_info?.email || ""}, Phone: ${resume.personal_info?.phone || ""}, Location: ${resume.personal_info?.location || ""}
- Resume Links: LinkedIn: ${resume.personal_info?.linkedin || ""}, GitHub: ${resume.personal_info?.github || ""}, Website: ${resume.personal_info?.website || ""}

RESUME CONTENT BREAKDOWN:
[Professional Summary]:
${summary}

[Skills]:
${skills}

[Work Experience]:
${experience || "None listed"}

[Projects]:
${projects || "None listed"}

[Education]:
${education || "None listed"}

[Certifications]:
${certifications || "None listed"}

[Achievements]:
${achievements || "None listed"}

ACTIVE RESUME RAW DATA SCHEMA:
${JSON.stringify(
  {
    personal_info: resume.personal_info || {},
    professional_summary: summary,
    skills: resume.skills || [],
    experience: resume.experience || [],
    project: resume.project || [],
    education: resume.education || [],
    certifications: resume.certifications || [],
    achievements: resume.achievements || [],
  },
  null,
  2
)}
================================================================================
`.trim();
  }

  return `${accountInfo}\n\n${resumeContext}`;
};

/**
 * Format conversation history into messages array for LLM
 * @param {Array} messages - Chat session messages
 * @param {number} limit - Recent messages count to include
 */
export const buildConversationHistory = (messages = [], limit = 8) => {
  return messages.slice(-limit).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content:
      m.role === "assistant"
        ? typeof m.content === "string"
          ? m.content
          : JSON.stringify(m.content)
        : m.content,
  }));
};

export default {
  formatResumeContext,
  formatUserAndResumeContext,
  buildConversationHistory,
};

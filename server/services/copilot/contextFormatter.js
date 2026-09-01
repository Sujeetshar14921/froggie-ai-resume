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
  buildConversationHistory,
};

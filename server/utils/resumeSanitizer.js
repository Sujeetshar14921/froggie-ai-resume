/**
 * Resume Data Sanitizer Utility
 * Sanitizes and normalizes resume fields to prevent schema validation, casting, or undefined errors
 * @param {Object} data - Raw resume data object
 * @returns {Object} Sanitized resume object
 */
export const sanitizeResumeData = (data = {}) => {
  const clean = { ...data };

  // 1. Sanitize skills: ensure array of trimmed strings
  if (Array.isArray(clean.skills)) {
    clean.skills = clean.skills
      .map((s) => (typeof s === "string" ? s.trim() : (s?.name || s?.skill || String(s)).trim()))
      .filter(Boolean);
  }

  // 2. Sanitize certifications: ensure array of { name, issuer, date, url }
  if (Array.isArray(clean.certifications)) {
    clean.certifications = clean.certifications
      .map((c) => {
        if (typeof c === "string") {
          return { name: c.trim(), issuer: "", date: "", url: "" };
        }
        return {
          name: c?.name || c?.title || "",
          issuer: c?.issuer || "",
          date: c?.date || "",
          url: c?.url || "",
        };
      })
      .filter((c) => Boolean(c.name));
  }

  // 3. Sanitize achievements: ensure array of { title, date, description }
  if (Array.isArray(clean.achievements)) {
    clean.achievements = clean.achievements
      .map((a) => {
        if (typeof a === "string") {
          return { title: a.trim(), date: "", description: "" };
        }
        return {
          title: a?.title || a?.name || "",
          date: a?.date || "",
          description: a?.description || "",
        };
      })
      .filter((a) => Boolean(a.title));
  }

  // 4. Sanitize experience: ensure array of { company, position, start_date, end_date, description, is_current }
  if (Array.isArray(clean.experience)) {
    clean.experience = clean.experience.map((exp) => ({
      company: exp?.company || exp?.organization || "",
      position: exp?.position || exp?.role || exp?.title || "",
      start_date: exp?.start_date || "",
      end_date: exp?.end_date || "",
      is_current: Boolean(exp?.is_current),
      description: Array.isArray(exp?.points)
        ? exp.points.join("\n")
        : exp?.description || "",
    }));
  }

  // 5. Sanitize project: ensure array of { name, type, description }
  if (Array.isArray(clean.project)) {
    clean.project = clean.project.map((proj) => ({
      name: proj?.name || proj?.title || "Project",
      type:
        proj?.type ||
        (Array.isArray(proj?.tech_stack) ? proj.tech_stack.join(", ") : "") ||
        "",
      description: Array.isArray(proj?.points)
        ? proj.points.join("\n")
        : proj?.description || "",
    }));
  }

  // 6. Sanitize education: ensure array of { institution, degree, field, graduation_date, gpa }
  if (Array.isArray(clean.education)) {
    clean.education = clean.education.map((edu) => ({
      institution: edu?.institution || edu?.school || edu?.university || "",
      degree: edu?.degree || "",
      field: edu?.field || edu?.major || "",
      graduation_date: edu?.graduation_date || edu?.end_year || edu?.year || "",
      gpa: edu?.gpa || "",
    }));
  }

  return clean;
};

export default {
  sanitizeResumeData,
};

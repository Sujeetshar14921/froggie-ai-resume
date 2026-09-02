import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

// Helper to sanitize resume fields and prevent schema validation/casting errors
export const sanitizeResumeData = (data = {}) => {
  const clean = { ...data };

  // 1. Sanitize skills: ensure array of strings
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

// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, template, accent_color, resumeData, ...rest } = req.body;
    const rawFields = resumeData || rest || {};
    const sanitized = sanitizeResumeData(rawFields);

    // create new resume with clean data
    const newResume = await Resume.create({
      userId,
      title: title || sanitized.title || "My Resume",
      template: template || sanitized.template || "classic",
      accent_color: accent_color || sanitized.accent_color || "#10B981",
      personal_info: sanitized.personal_info || {},
      professional_summary: sanitized.professional_summary || "",
      skills: sanitized.skills || [],
      experience: sanitized.experience || [],
      project: sanitized.project || [],
      education: sanitized.education || [],
      certifications: sanitized.certifications || [],
      achievements: sanitized.achievements || [],
    });

    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    console.error("Create resume error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// controller for deleting a resume
// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deleted = await Resume.findOneAndDelete({ userId, _id: resumeId });
    if (!deleted) {
      return res.status(403).json({
        message: "Access denied. Resume not found or does not belong to your account.",
      });
    }

    // return success message
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for deleting all resumes belonging to the authenticated user
// DELETE: /api/resumes/delete-all
export const deleteAllResumes = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await Resume.deleteMany({ userId });
    return res.status(200).json({
      message: `Deleted ${result.deletedCount || 0} resumes successfully`,
      deletedCount: result.deletedCount || 0,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// get user resume by id
// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(403).json({
        message: "Access denied. Resume not found or does not belong to your account.",
      });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id public
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = await JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData || {});
    }

    if (image) {
      try {
        const imageBase64 = fs.readFileSync(image.path).toString("base64");
        const shouldRemoveBg =
          removeBackground === "yes" ||
          removeBackground === "true" ||
          removeBackground === true;

        const uploadOptions = {
          file: imageBase64,
          fileName: `resume_${Date.now()}.png`,
          folder: "user-resumes",
          transformation: {
            pre: `w-400,h-400,fo-face,z-0.75${shouldRemoveBg ? ",e-bgremove" : ""}`,
          },
        };

        const response = await imagekit.files.upload(uploadOptions);

        if (!resumeDataCopy.personal_info) {
          resumeDataCopy.personal_info = {};
        }
        resumeDataCopy.personal_info.image = response.url;
      } catch (uploadErr) {
        console.error("ImageKit upload error:", uploadErr);
        throw new Error(
          uploadErr.message || "Failed to process and upload profile image"
        );
      } finally {
        // Clean up temporary multer upload file
        try {
          if (fs.existsSync(image.path)) {
            fs.unlinkSync(image.path);
          }
        } catch (unlinkErr) {
          console.warn("Could not delete temp image file:", unlinkErr);
        }
      }
    }

    const sanitizedUpdates = sanitizeResumeData(resumeDataCopy);

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      sanitizedUpdates,
      { new: true }
    );

    if (!resume) {
      return res.status(403).json({
        message: "Access denied. Resume not found or does not belong to your account.",
      });
    }

    return res.status(200).json({ message: "Saved successfully", resume });
  } catch (error) {
    console.error("Update resume error:", error);
    return res.status(400).json({ message: error.message });
  }
};
import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";
import fs from "fs";
import ai from "../configs/ai.js";
import { sanitizeResumeData } from "../utils/resumeSanitizer.js";
import memoryCache from "../services/cacheService.js";
import { generateResumeDocxBuffer } from "../utils/docxExporter.js";

export { sanitizeResumeData };

// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, template, accent_color, resumeData, ...rest } = req.body;
    const rawFields = resumeData || rest || {};
    const sanitized = sanitizeResumeData(rawFields);

    let initialImage = sanitized.personal_info?.image || "";
    if (!initialImage) {
      const userDoc = await User.findById(userId).select("image").lean();
      if (userDoc?.image) {
        initialImage = userDoc.image;
      }
    }

    const personalInfoWithFallback = {
      ...(sanitized.personal_info || {}),
      image: initialImage,
    };

    // create new resume with clean data
    const newResume = await Resume.create({
      userId,
      title: title || sanitized.title || "My Resume",
      template: template || sanitized.template || "classic",
      accent_color: accent_color || sanitized.accent_color || "#10B981",
      personal_info: personalInfoWithFallback,
      professional_summary: sanitized.professional_summary || "",
      skills: sanitized.skills || [],
      experience: sanitized.experience || [],
      project: sanitized.project || [],
      education: sanitized.education || [],
      certifications: sanitized.certifications || [],
      achievements: sanitized.achievements || [],
      languages: sanitized.languages || [],
      personal_details: sanitized.personal_details || {},
      custom_sections: sanitized.custom_sections || [],
      isDeleted: false,
      versions: [
        {
          versionNumber: 1,
          savedAt: new Date(),
          note: "Initial creation",
          snapshot: sanitized,
        },
      ],
    });

    // Invalidate talent pool cache
    memoryCache.invalidatePattern("talent_pool");

    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    console.error("Create resume error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// controller for updating a resume with version snapshotting
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground, versionNote } = req.body;
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

    // Fetch existing resume to snapshot previous state
    const existing = await Resume.findOne({ userId, _id: resumeId, isDeleted: { $ne: true } });
    if (!existing) {
      return res.status(403).json({
        message: "Access denied. Resume not found or does not belong to your account.",
      });
    }

    const currentVersions = Array.isArray(existing.versions) ? existing.versions : [];
    const nextVerNum = currentVersions.length > 0 ? currentVersions[currentVersions.length - 1].versionNumber + 1 : 1;

    // Build snapshot of previous state before overwrite
    const snapshotObject = {
      title: existing.title,
      template: existing.template,
      accent_color: existing.accent_color,
      personal_info: existing.personal_info,
      professional_summary: existing.professional_summary,
      skills: existing.skills,
      experience: existing.experience,
      project: existing.project,
      education: existing.education,
      certifications: existing.certifications,
      achievements: existing.achievements,
      languages: existing.languages,
      personal_details: existing.personal_details,
      custom_sections: existing.custom_sections,
    };

    const newVersionEntry = {
      versionNumber: nextVerNum,
      savedAt: new Date(),
      note: versionNote || `Autosave v${nextVerNum}`,
      snapshot: snapshotObject,
    };

    // Keep up to 10 latest snapshots
    const updatedVersions = [...currentVersions.slice(-9), newVersionEntry];

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      {
        ...sanitizedUpdates,
        versions: updatedVersions,
      },
      { new: true }
    );

    // Invalidate caches
    memoryCache.delete(`public_resume_${resumeId}`);
    memoryCache.invalidatePattern("talent_pool");

    return res.status(200).json({ message: "Saved successfully", resume });
  } catch (error) {
    console.error("Update resume error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// get user resume by id
// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId, isDeleted: { $ne: true } })
      .populate("userId", "name email image profession")
      .lean();

    if (!resume) {
      return res.status(403).json({
        message: "Access denied. Resume not found or does not belong to your account.",
      });
    }

    if (!resume.personal_info?.image && resume.userId?.image) {
      if (!resume.personal_info) resume.personal_info = {};
      resume.personal_info.image = resume.userId.image;
    }

    delete resume.__v;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume version history snapshots
// GET: /api/resumes/:resumeId/history
export const getResumeHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId }).select("versions title updatedAt").lean();
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const versions = (resume.versions || []).map((v) => ({
      versionNumber: v.versionNumber,
      savedAt: v.savedAt,
      note: v.note,
    })).reverse();

    return res.status(200).json({
      success: true,
      title: resume.title,
      totalVersions: versions.length,
      versions,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// restore / rollback resume to a specific previous version
// POST: /api/resumes/:resumeId/rollback/:versionNumber
export const restoreResumeVersion = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, versionNumber } = req.params;
    const targetVer = parseInt(versionNumber, 10);

    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const versionEntry = (resume.versions || []).find((v) => v.versionNumber === targetVer);
    if (!versionEntry || !versionEntry.snapshot) {
      return res.status(404).json({ message: `Version ${versionNumber} not found in history` });
    }

    const snapshot = versionEntry.snapshot;

    // Apply snapshot fields
    Object.keys(snapshot).forEach((key) => {
      resume[key] = snapshot[key];
    });

    resume.versions.push({
      versionNumber: (resume.versions[resume.versions.length - 1]?.versionNumber || 0) + 1,
      savedAt: new Date(),
      note: `Rollback to v${targetVer}`,
      snapshot: structuredClone(snapshot),
    });

    await resume.save();

    // Invalidate caches
    memoryCache.delete(`public_resume_${resumeId}`);
    memoryCache.invalidatePattern("talent_pool");

    return res.status(200).json({
      success: true,
      message: `Successfully rolled back to version ${targetVer}`,
      resume,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// soft-delete a resume (moves to Trash)
// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const { permanent } = req.query;

    if (permanent === "true") {
      const deleted = await Resume.findOneAndDelete({ userId, _id: resumeId });
      if (!deleted) {
        return res.status(404).json({ message: "Resume not found" });
      }
      memoryCache.delete(`public_resume_${resumeId}`);
      memoryCache.invalidatePattern("talent_pool");
      return res.status(200).json({ message: "Resume permanently deleted" });
    }

    // Soft delete
    const softDeleted = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: { isDeleted: true, deletedAt: new Date(), public: false } },
      { new: true }
    );

    if (!softDeleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    memoryCache.delete(`public_resume_${resumeId}`);
    memoryCache.invalidatePattern("talent_pool");

    return res.status(200).json({
      message: "Resume moved to Trash (can be restored anytime)",
      resume: softDeleted,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// restore a soft-deleted resume from Trash
// PATCH: /api/resumes/:resumeId/restore
export const restoreDeletedResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const restored = await Resume.findOneAndUpdate(
      { userId, _id: resumeId, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } },
      { new: true }
    );

    if (!restored) {
      return res.status(404).json({ message: "Resume not found in Trash" });
    }

    return res.status(200).json({
      message: "Resume restored successfully",
      resume: restored,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get all resumes currently in Trash for the authenticated user
// GET: /api/resumes/trash
export const getTrashResumes = async (req, res) => {
  try {
    const userId = req.userId;
    const trashResumes = await Resume.find({ userId, isDeleted: true })
      .select("title template updatedAt deletedAt personal_info")
      .sort({ deletedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: trashResumes.length,
      resumes: trashResumes,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// empty trash (permanently delete all soft-deleted resumes)
// DELETE: /api/resumes/trash/empty
export const emptyTrash = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await Resume.deleteMany({ userId, isDeleted: true });
    return res.status(200).json({
      message: `Permanently removed ${result.deletedCount || 0} resumes from Trash`,
      deletedCount: result.deletedCount || 0,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// delete all active resumes belonging to the authenticated user
// DELETE: /api/resumes/delete-all
export const deleteAllResumes = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await Resume.updateMany(
      { userId, isDeleted: { $ne: true } },
      { $set: { isDeleted: true, deletedAt: new Date(), public: false } }
    );
    memoryCache.invalidatePattern("talent_pool");
    return res.status(200).json({
      message: `Moved ${result.modifiedCount || 0} resumes to Trash`,
      deletedCount: result.modifiedCount || 0,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get all public resumes for talent pool discovery with in-memory caching
// GET: /api/resumes/talent-pool
export const getPublicTalentPool = async (req, res) => {
  try {
    const cacheKey = `talent_pool_${JSON.stringify(req.query)}`;
    const cachedData = memoryCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ ...cachedData, cached: true });
    }

    const {
      q,
      skill,
      role,
      location,
      experienceLevel,
      degree,
      ageRange,
      hasProjects,
      hasCertifications,
      template,
      sortBy = "newest",
      page = 1,
      limit = 24,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
    const skip = (pageNum - 1) * limitNum;

    const filter = { public: true, isDeleted: { $ne: true } };
    const andConditions = [];

    // 1. Text Search across name, profession, location, summary, skills, experience, projects
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      andConditions.push({
        $or: [
          { "personal_info.full_name": regex },
          { "personal_info.profession": regex },
          { "personal_info.location": regex },
          { "personal_details.address": regex },
          { professional_summary: regex },
          { skills: regex },
          { "experience.position": regex },
          { "experience.company": regex },
          { "project.name": regex },
          { "education.degree": regex },
          { "education.field": regex },
          { title: regex },
        ],
      });
    }

    // 2. Skill Filter
    if (skill && skill.trim() && skill.toLowerCase() !== "all") {
      const skillsArray = skill
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillsArray.length > 0) {
        andConditions.push({
          skills: {
            $in: skillsArray.map((s) => new RegExp(`^${s}$|${s}`, "i")),
          },
        });
      }
    }

    // 3. Job Role / Specialization Category Filter
    if (role && role.trim() && role.toLowerCase() !== "all") {
      const roleRegex = new RegExp(role.trim(), "i");
      andConditions.push({
        $or: [
          { "personal_info.profession": roleRegex },
          { "experience.position": roleRegex },
          { title: roleRegex },
        ],
      });
    }

    // 4. Location Filter
    if (location && location.trim() && location.toLowerCase() !== "all") {
      const locRegex = new RegExp(location.trim(), "i");
      andConditions.push({
        $or: [
          { "personal_info.location": locRegex },
          { "personal_details.address": locRegex },
        ],
      });
    }

    // 5. Degree / Education Qualification Filter
    if (degree && degree.trim() && degree.toLowerCase() !== "all") {
      const degRegex = new RegExp(degree.trim(), "i");
      andConditions.push({
        $or: [
          { "education.degree": degRegex },
          { "education.field": degRegex },
          { "education.institution": degRegex },
        ],
      });
    }

    // 6. Experience Level Filter
    if (experienceLevel && experienceLevel.trim() && experienceLevel.toLowerCase() !== "all") {
      const exp = experienceLevel.toLowerCase();
      if (exp === "fresher" || exp === "0-1" || exp === "entry") {
        andConditions.push({
          $or: [
            { experience: { $size: 0 } },
            { experience: { $size: 1 } },
            { experience: { $exists: false } },
          ],
        });
      } else if (exp === "mid" || exp === "1-3" || exp === "2-4") {
        andConditions.push({
          $expr: {
            $and: [
              { $gte: [{ $size: { $ifNull: ["$experience", []] } }, 1] },
              { $lte: [{ $size: { $ifNull: ["$experience", []] } }, 3] },
            ],
          },
        });
      } else if (exp === "senior" || exp === "3-5" || exp === "4-6") {
        andConditions.push({
          $expr: {
            $and: [
              { $gte: [{ $size: { $ifNull: ["$experience", []] } }, 2] },
              { $lte: [{ $size: { $ifNull: ["$experience", []] } }, 5] },
            ],
          },
        });
      } else if (exp === "lead" || exp === "5+" || exp === "executive") {
        andConditions.push({
          $expr: {
            $gte: [{ $size: { $ifNull: ["$experience", []] } }, 4],
          },
        });
      }
    }

    // 7. Age Range Filter
    if (ageRange && ageRange.trim() && ageRange.toLowerCase() !== "all") {
      const currentYear = new Date().getFullYear();
      let minYear = 1960;
      let maxYear = currentYear;

      if (ageRange === "18-24") {
        minYear = currentYear - 24;
        maxYear = currentYear - 18;
      } else if (ageRange === "25-30") {
        minYear = currentYear - 30;
        maxYear = currentYear - 25;
      } else if (ageRange === "31-35") {
        minYear = currentYear - 35;
        maxYear = currentYear - 31;
      } else if (ageRange === "36+") {
        minYear = 1960;
        maxYear = currentYear - 36;
      }

      const yearRegexList = [];
      for (let y = minYear; y <= maxYear; y++) {
        yearRegexList.push(String(y));
      }
      if (yearRegexList.length > 0) {
        andConditions.push({
          "personal_details.date_of_birth": {
            $regex: new RegExp(yearRegexList.join("|")),
          },
        });
      }
    }

    // 8. Projects & Certifications requirement
    if (hasProjects === "true" || hasProjects === true) {
      andConditions.push({
        $expr: { $gt: [{ $size: { $ifNull: ["$project", []] } }, 0] },
      });
    }

    if (hasCertifications === "true" || hasCertifications === true) {
      andConditions.push({
        $expr: { $gt: [{ $size: { $ifNull: ["$certifications", []] } }, 0] },
      });
    }

    // 9. Template Filter
    if (template && template.trim() && template.toLowerCase() !== "all") {
      andConditions.push({
        template: new RegExp(`^${template.trim()}$`, "i"),
      });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    // Determine Sort
    let sortOptions = { updatedAt: -1 };
    if (sortBy === "oldest") sortOptions = { updatedAt: 1 };
    else if (sortBy === "title") sortOptions = { "personal_info.full_name": 1, title: 1 };

    // Execute query & count
    const [resumes, totalResumes] = await Promise.all([
      Resume.find(filter)
        .populate("userId", "name email image profession")
        .select("-__v")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Resume.countDocuments(filter),
    ]);

    // Apply profile photo fallback if resume-specific photo is empty
    resumes.forEach((r) => {
      if (!r.personal_info?.image && r.userId?.image) {
        if (!r.personal_info) r.personal_info = {};
        r.personal_info.image = r.userId.image;
      }
    });

    // Compute aggregated popular skills, roles & locations for quick filtering tags
    const allPublicResumes = await Resume.find({ public: true, isDeleted: { $ne: true } })
      .select("skills personal_info.profession personal_info.location education.degree")
      .lean();

    const skillCounts = {};
    const roleCounts = {};
    const locationCounts = {};
    const degreeCounts = {};

    allPublicResumes.forEach((r) => {
      if (Array.isArray(r.skills)) {
        r.skills.forEach((s) => {
          if (s && typeof s === "string") {
            const clean = s.trim();
            if (clean.length >= 2) {
              skillCounts[clean] = (skillCounts[clean] || 0) + 1;
            }
          }
        });
      }
      const prof = r.personal_info?.profession?.trim();
      if (prof && prof.length >= 3) {
        roleCounts[prof] = (roleCounts[prof] || 0) + 1;
      }
      const loc = r.personal_info?.location?.trim();
      if (loc && loc.length >= 2) {
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      }
      if (Array.isArray(r.education)) {
        r.education.forEach((edu) => {
          const deg = edu.degree?.trim();
          if (deg && deg.length >= 2) {
            degreeCounts[deg] = (degreeCounts[deg] || 0) + 1;
          }
        });
      }
    });

    const popularSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count }));

    const popularRoles = Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, count]) => ({ name, count }));

    const popularLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const popularDegrees = Object.entries(degreeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const resultPayload = {
      success: true,
      resumes,
      totalResumes,
      totalPages: Math.ceil(totalResumes / limitNum) || 1,
      currentPage: pageNum,
      popularSkills,
      popularRoles,
      popularLocations,
      popularDegrees,
    };

    // Cache in memory for 60 seconds
    memoryCache.set(cacheKey, resultPayload, 60);

    return res.status(200).json(resultPayload);
  } catch (error) {
    console.error("Public talent pool query error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id public with cache
// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const cacheKey = `public_resume_${resumeId}`;
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const resume = await Resume.findOne({ public: true, _id: resumeId, isDeleted: { $ne: true } })
      .populate("userId", "name email image profession")
      .lean();

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or is set to private" });
    }

    if (!resume.personal_info?.image && resume.userId?.image) {
      if (!resume.personal_info) resume.personal_info = {};
      resume.personal_info.image = resume.userId.image;
    }

    const payload = { success: true, resume };
    memoryCache.set(cacheKey, payload, 120);

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Server-side DOCX Word export endpoint
// GET: /api/resumes/:resumeId/export-docx
export const exportResumeDocx = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      $or: [{ userId }, { public: true }],
      isDeleted: { $ne: true },
    }).lean();

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or access denied" });
    }

    const buffer = await generateResumeDocxBuffer(resume);
    const fileName = `${(resume.personal_info?.full_name || resume.title || "Resume").replace(/[^a-zA-Z0-9_-]/g, "_")}.docx`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Length", buffer.length);

    return res.end(buffer);
  } catch (error) {
    console.error("Docx export error:", error);
    return res.status(500).json({ message: "Failed to generate DOCX file", error: error.message });
  }
};

// AI Job Description Matcher Controller
// POST: /api/resumes/match-jd
export const matchJdWithCandidates = async (req, res) => {
  try {
    const { jdText } = req.body;
    if (!jdText || !jdText.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }

    // 1. Extract criteria via AI or heuristic fallback
    let extracted = {
      role: "",
      skills: [],
      experienceLevel: "",
      location: "",
      keywords: [],
    };

    try {
      const aiResponse = await ai.chat.completions.create({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are an expert technical recruiter and resume parser.
Analyze the following Job Description (JD) and extract key requirements in strict JSON format:
{
  "role": "Target role or title (e.g., Full Stack Developer, Frontend Developer, AI Engineer, etc.)",
  "skills": ["Array of technical and key skills, e.g. React, Node.js, Python, AWS, Docker, MongoDB"],
  "experienceLevel": "fresher" | "mid" | "senior" | "lead",
  "location": "Remote or specific city if specified, else empty",
  "keywords": ["5 key industry keywords"]
}
Return ONLY valid JSON with no markdown formatting.`,
          },
          {
            role: "user",
            content: jdText.trim(),
          },
        ],
        response_format: { type: "json_object" },
      });

      const raw = aiResponse.choices[0].message.content.trim();
      const cleaned = raw.replace(/^```json\s*|\s*```$/g, "");
      const parsed = JSON.parse(cleaned);
      if (parsed.skills && Array.isArray(parsed.skills)) {
        extracted = {
          role: parsed.role || "",
          skills: parsed.skills.map((s) => String(s).trim()).filter(Boolean),
          experienceLevel: parsed.experienceLevel || "",
          location: parsed.location || "",
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        };
      }
    } catch (aiErr) {
      console.warn("AI JD extraction error, using heuristic fallback:", aiErr.message);
      const commonTechs = [
        "react", "node.js", "nodejs", "python", "javascript", "typescript", "java", "aws",
        "docker", "sql", "mongodb", "postgresql", "figma", "graphql", "flutter", "next.js",
        "nextjs", "django", "fastapi", "spring", "c++", "c#", "golang", "kubernetes", "redis",
        "tailwind", "html", "css", "express", "redux", "git", "ci/cd", "rest api"
      ];
      const matchedTechs = commonTechs.filter((tech) =>
        new RegExp(`\\b${tech.replace(".", "\\.")}\\b`, "i").test(jdText)
      );
      extracted.skills = matchedTechs.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
      
      if (/senior|lead|architect|5\+/i.test(jdText)) extracted.experienceLevel = "senior";
      else if (/fresher|intern|entry|junior|0-1/i.test(jdText)) extracted.experienceLevel = "fresher";
      else extracted.experienceLevel = "mid";
    }

    // 2. Fetch all public non-deleted resumes
    const allPublicResumes = await Resume.find({ public: true, isDeleted: { $ne: true } })
      .populate("userId", "name email image profession")
      .select("-__v")
      .lean();

    allPublicResumes.forEach((r) => {
      if (!r.personal_info?.image && r.userId?.image) {
        if (!r.personal_info) r.personal_info = {};
        r.personal_info.image = r.userId.image;
      }
    });

    const requiredSkillsLower = (extracted.skills || []).map((s) => s.toLowerCase());

    // 3. Compute matching score for each candidate
    const scoredCandidates = allPublicResumes.map((candidate) => {
      let score = 0;
      const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
      const candidateSkillsLower = candidateSkills.map((s) => (typeof s === "string" ? s.toLowerCase() : ""));

      // Match skills (45% weight)
      const matchedSkills = [];
      requiredSkillsLower.forEach((reqSkill) => {
        const hasSkill = candidateSkillsLower.some((cSkill) =>
          cSkill.includes(reqSkill) || reqSkill.includes(cSkill)
        );
        if (hasSkill) {
          matchedSkills.push(reqSkill);
        }
      });

      if (requiredSkillsLower.length > 0) {
        const skillRatio = matchedSkills.length / requiredSkillsLower.length;
        score += Math.round(skillRatio * 45);
      } else {
        score += 30;
      }

      // Match Role (25% weight)
      const prof = (candidate.personal_info?.profession || candidate.title || "").toLowerCase();
      if (extracted.role) {
        const roleLower = extracted.role.toLowerCase();
        if (prof.includes(roleLower) || roleLower.includes(prof)) {
          score += 25;
        } else if (/developer|engineer|designer|manager/.test(prof) && /developer|engineer|designer|manager/.test(roleLower)) {
          score += 15;
        }
      } else {
        score += 20;
      }

      // Match Experience (15% weight)
      const expCount = Array.isArray(candidate.experience) ? candidate.experience.length : 0;
      if (extracted.experienceLevel === "senior" && expCount >= 3) score += 15;
      else if (extracted.experienceLevel === "mid" && expCount >= 1) score += 15;
      else if (extracted.experienceLevel === "fresher") score += 15;
      else if (expCount > 0) score += 10;

      // Match Projects & Summary Context (15% weight)
      const summaryLower = (candidate.professional_summary || "").toLowerCase();
      let contextMatches = 0;
      requiredSkillsLower.forEach((s) => {
        if (summaryLower.includes(s)) contextMatches++;
      });
      if (contextMatches > 0) score += Math.min(15, contextMatches * 5);
      if (Array.isArray(candidate.project) && candidate.project.length > 0) score += 5;

      const finalMatchScore = Math.min(99, Math.max(35, score));

      return {
        ...candidate,
        matchScore: finalMatchScore,
        matchedSkills: Array.from(new Set(matchedSkills)),
      };
    });

    // Sort highest match first
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      extracted,
      extractedCriteria: extracted,
      candidates: scoredCandidates,
      resumes: scoredCandidates,
      totalMatched: scoredCandidates.length,
    });
  } catch (error) {
    console.error("Match JD error:", error);
    return res.status(400).json({ message: error.message || "Failed to process JD matching" });
  }
};

// toggle resume public visibility
// PATCH: /api/resumes/:resumeId/visibility
export const toggleResumeVisibility = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const { isPublic } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId, isDeleted: { $ne: true } },
      { $set: { public: Boolean(isPublic) } },
      { new: true }
    );

    if (!resume) {
      return res.status(403).json({
        message: "Access denied. Resume not found or does not belong to your account.",
      });
    }

    memoryCache.delete(`public_resume_${resumeId}`);
    memoryCache.invalidatePattern("talent_pool");

    return res.status(200).json({
      message: resume.public ? "Resume published to Public Talent Pool" : "Resume set to private",
      public: resume.public,
      resume,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
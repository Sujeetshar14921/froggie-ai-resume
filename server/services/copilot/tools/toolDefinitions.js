/**
 * Tool definitions for Google Gemini AI Career Copilot
 * Follows Gemini Function Declarations standard schema
 */

export const COPILOT_TOOLS = [
  {
    name: "get_user_profile",
    description:
      "Get the authenticated user's verified account profile (name, email, profession, phone, location, bio). Use this as the single source of truth for personal identity questions.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "update_profile",
    description:
      "Update the authenticated user's account profile fields (name, profession, phone, location, bio).",
    parameters: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING", description: "User's full name" },
        profession: { type: "STRING", description: "Target profession or title" },
        phone: { type: "STRING", description: "Contact phone number" },
        location: { type: "STRING", description: "City / Country location" },
        bio: { type: "STRING", description: "Short professional bio" },
      },
    },
  },
  {
    name: "get_user_resumes",
    description:
      "Retrieve all resumes and files belonging to the currently authenticated user's account.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "get_my_files",
    description:
      "Retrieve all resume files in the user's 'My Files' / 'My Resumes' area.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "get_active_resume",
    description:
      "Get the complete content, sections, and metadata of the currently selected/active resume document.",
    parameters: {
      type: "OBJECT",
      properties: {},
    },
  },
  {
    name: "get_resume",
    description:
      "Find and retrieve a specific resume by its ID or title belonging to the authenticated user.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Specific resume MongoDB ID if known" },
        title: { type: "STRING", description: "Title or partial title of the resume to find" },
      },
    },
  },
  {
    name: "create_resume",
    description:
      "Create a brand-new resume document under the current user's account. Automatically populates user's account name and email.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "Title of the resume (e.g. 'AI Engineer Resume')" },
        profession: { type: "STRING", description: "Target role / profession" },
        summary: { type: "STRING", description: "Professional summary" },
        skills: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of technical and soft skills",
        },
        experience: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              company: { type: "STRING" },
              position: { type: "STRING" },
              start_date: { type: "STRING" },
              end_date: { type: "STRING" },
              description: { type: "STRING" },
              is_current: { type: "BOOLEAN" },
            },
          },
          description: "Work history entries",
        },
        project: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              type: { type: "STRING" },
              description: { type: "STRING" },
            },
          },
          description: "Portfolio projects",
        },
        education: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              institution: { type: "STRING" },
              degree: { type: "STRING" },
              field: { type: "STRING" },
              graduation_date: { type: "STRING" },
            },
          },
          description: "Educational degrees",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "create_file",
    description: "Alias for create_resume. Create a new resume file under the user's account.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "Resume file name/title" },
        profession: { type: "STRING", description: "Target profession" },
        skills: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["title"],
    },
  },
  {
    name: "create_resume_from_data",
    description:
      "Parse and create a structured resume from user-supplied raw text, notes, or profile data without hallucinating unverified facts.",
    parameters: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING", description: "Resume title" },
        targetRole: { type: "STRING", description: "Target role/profession" },
        rawData: { type: "STRING", description: "Raw user input text containing skills, experience, etc." },
        useExistingProfile: { type: "BOOLEAN", description: "Whether to merge existing profile information" },
      },
      required: ["title"],
    },
  },
  {
    name: "update_resume",
    description:
      "Update multiple fields or sections of an existing resume owned by the authenticated user.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID to update (or omit to update active resume)" },
        updates: {
          type: "OBJECT",
          description: "Fields to update (title, personal_info, professional_summary, skills, experience, project, education, certifications, achievements)",
        },
        summaryOfChanges: { type: "STRING", description: "Brief explanation of what was changed" },
      },
      required: ["updates"],
    },
  },
  {
    name: "update_resume_section",
    description:
      "Update a specific section of the user's resume (e.g. summary, skills, experience, projects, education).",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID (or omit to use active resume)" },
        section: {
          type: "STRING",
          description: "Section name: 'professional_summary', 'skills', 'experience', 'project', 'education', 'certifications', 'achievements', 'personal_info'",
        },
        data: {
          type: "OBJECT",
          description: "New content or array for the specified section",
        },
        mode: {
          type: "STRING",
          description: "'replace' (default) or 'append' for arrays like skills/experience",
        },
        summaryOfChanges: { type: "STRING", description: "Brief description of the change" },
      },
      required: ["section"],
    },
  },
  {
    name: "delete_resume",
    description:
      "Delete a specific resume belonging to the authenticated user. Destructive operation; requires confirmation before actual deletion.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID to delete" },
        resumeTitle: { type: "STRING", description: "Title of resume to delete if ID is unknown" },
        confirmed: {
          type: "BOOLEAN",
          description: "Must be true to execute deletion. If false/omitted, prompts the user for confirmation first.",
        },
      },
    },
  },
  {
    name: "delete_file",
    description: "Alias for delete_resume. Delete a resume file with ownership validation and confirmation.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "File ID to delete" },
        resumeTitle: { type: "STRING", description: "File name/title" },
        confirmed: { type: "BOOLEAN", description: "Confirmation flag" },
      },
    },
  },
  {
    name: "delete_all_resumes",
    description:
      "Delete all resumes owned by the authenticated user. Highly destructive; ALWAYS requires explicit confirmation.",
    parameters: {
      type: "OBJECT",
      properties: {
        confirmed: {
          type: "BOOLEAN",
          description: "Must be explicitly set to true to execute deletion. If false/omitted, prompts for confirmation.",
        },
      },
    },
  },
  {
    name: "analyze_resume",
    description:
      "Perform a comprehensive resume health audit across 4 pillars (Impact verbs, ATS keyword density, metric coverage, red flags).",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID to analyze (defaults to active resume)" },
        targetRole: { type: "STRING", description: "Target job role for tailored scoring" },
      },
    },
  },
  {
    name: "calculate_ats_score",
    description:
      "Calculate 0–100 ATS compatibility score with detailed breakdown, matched skills, missing keywords, and recommendations.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID (defaults to active resume)" },
        jobDescription: { type: "STRING", description: "Optional target job description to match against" },
        targetRole: { type: "STRING", description: "Optional target role" },
      },
    },
  },
  {
    name: "analyze_job_description",
    description:
      "Analyze a job description against the user's resume: extracts required/preferred skills, detects gaps, and computes match %.",
    parameters: {
      type: "OBJECT",
      properties: {
        jobDescription: { type: "STRING", description: "The full pasted job description text" },
        resumeId: { type: "STRING", description: "Resume ID to compare against (defaults to active resume)" },
      },
      required: ["jobDescription"],
    },
  },
  {
    name: "tailor_resume_for_job",
    description:
      "Tailor user's resume for a specific job description. Incorporates relevant keywords naturally while preserving 100% factual accuracy. Can save as a new resume version.",
    parameters: {
      type: "OBJECT",
      properties: {
        jobDescription: { type: "STRING", description: "Job description text" },
        resumeId: { type: "STRING", description: "Resume ID to tailor (defaults to active resume)" },
        saveAsNewVersion: { type: "BOOLEAN", description: "True to create a new resume version (recommended)" },
      },
      required: ["jobDescription"],
    },
  },
  {
    name: "generate_cover_letter",
    description:
      "Generate a personalized, high-converting cover letter based on user's resume experience and target job description/company.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID" },
        jobDescription: { type: "STRING", description: "Job description text or company requirements" },
        companyName: { type: "STRING", description: "Target company name" },
        roleTitle: { type: "STRING", description: "Target job title" },
        tone: { type: "STRING", description: "Tone (e.g. professional, confident, executive, technical)" },
      },
    },
  },
  {
    name: "generate_interview_questions",
    description:
      "Generate interview preparation questions (HR, Technical, Behavioral, STAR-based, Project-specific) customized to the user's resume.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID" },
        category: {
          type: "STRING",
          description: "'HR', 'Technical', 'Behavioral', 'Project', or 'All'",
        },
        targetRole: { type: "STRING", description: "Target job role" },
      },
    },
  },
  {
    name: "generate_linkedin_profile",
    description:
      "Generate an optimized LinkedIn headline, About section, work experience highlights, and recommended skills from the user's resume.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID (defaults to active resume)" },
        targetRole: { type: "STRING", description: "Target role/industry" },
      },
    },
  },
  {
    name: "career_analysis",
    description:
      "Analyze the user's skills and experience to provide career guidance: suitable roles, skill gap analysis, learning roadmap, and project ideas.",
    parameters: {
      type: "OBJECT",
      properties: {
        resumeId: { type: "STRING", description: "Resume ID" },
        targetCareer: { type: "STRING", description: "Desired career path (e.g. 'AI Engineer', 'Engineering Manager')" },
      },
    },
  },
];

export const getGeminiToolsDeclaration = () => [
  {
    functionDeclarations: COPILOT_TOOLS,
  },
];

export default {
  COPILOT_TOOLS,
  getGeminiToolsDeclaration,
};

/**
 * Job Description Keyword Extraction & ATS Gap Analysis Engine
 * Extracts technical and domain competencies from job descriptions and compares
 * them against the candidate's active resume.
 */

// Common high-frequency ATS skills & tech keywords
const TECH_DICTIONARY = [
  "react", "react.js", "next.js", "vue", "angular", "svelte", "typescript", "javascript",
  "node.js", "express", "python", "django", "flask", "fastapi", "java", "spring boot",
  "c++", "c#", ".net", "go", "golang", "rust", "php", "laravel", "ruby", "rails",
  "html5", "css3", "tailwind css", "sass", "bootstrap", "graphql", "rest api", "grpc",
  "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sqlite", "dynamodb",
  "aws", "amazon web services", "azure", "google cloud", "gcp", "docker", "kubernetes",
  "terraform", "ci/cd", "github actions", "jenkins", "git", "linux", "microservices",
  "serverless", "kafka", "rabbitmq", "agile", "scrum", "jira", "unit testing",
  "jest", "cypress", "playwright", "webpack", "vite", "system design", "distributed systems",
  "data structures", "algorithms", "machine learning", "deep learning", "ai", "llm",
  "nlp", "computer vision", "pandas", "numpy", "pytorch", "tensorflow", "scikit-learn"
];

const SOFT_SKILLS = [
  "leadership", "cross-functional", "communication", "problem solving",
  "collaboration", "mentorship", "project management", "critical thinking",
  "stakeholder management", "strategic planning", "agile leadership"
];

/**
 * Clean & tokenize text into lowercased terms
 */
export const tokenizeText = (text = "") => {
  return (text || "")
    .toLowerCase()
    .replace(/[^\w\s.#+-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
};

/**
 * Extract target keywords from a raw job description
 */
export const extractJdKeywords = (jdText = "") => {
  const normalized = (jdText || "").toLowerCase();
  const extracted = new Set();

  // 1. Match dictionary keywords
  [...TECH_DICTIONARY, ...SOFT_SKILLS].forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i");
    if (regex.test(normalized)) {
      extracted.add(term);
    }
  });

  // 2. Extract capitalized industry terms / acronyms (e.g. AWS, CI/CD, ETL, SEO)
  const acronyms = jdText.match(/\b[A-Z]{2,6}\b/g) || [];
  acronyms.forEach((ac) => {
    const lower = ac.toLowerCase();
    if (lower.length >= 2 && !["and", "the", "for", "with", "from"].includes(lower)) {
      extracted.add(lower);
    }
  });

  return Array.from(extracted);
};

/**
 * Perform Gap Analysis between candidate resume and target JD
 */
export const analyzeJdGap = (resumeData = {}, jdText = "", targetRole = "") => {
  const jdKeywords = extractJdKeywords(jdText);
  if (jdKeywords.length === 0) {
    // Fallback basic keywords if JD is very brief
    const roleTokens = tokenizeText(targetRole);
    roleTokens.forEach((t) => {
      if (t.length > 3) jdKeywords.push(t);
    });
  }

  // Compile all resume text into a single searchable corpus
  const resumeSkills = (resumeData.skills || []).map((s) => s.toLowerCase());
  const expText = (resumeData.experience || [])
    .map((e) => `${e.position} ${e.company} ${e.description}`)
    .join(" ")
    .toLowerCase();
  const summaryText = (resumeData.professional_summary || "").toLowerCase();
  const projText = (resumeData.project || [])
    .map((p) => `${p.name} ${p.type} ${p.description}`)
    .join(" ")
    .toLowerCase();

  const fullResumeCorpus = `${resumeSkills.join(" ")} ${expText} ${summaryText} ${projText}`;

  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywords.forEach((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i");
    if (regex.test(fullResumeCorpus) || resumeSkills.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const total = jdKeywords.length || 1;
  const initialMatchRatio = matchedKeywords.length / total;
  const matchScore = Math.min(Math.max(Math.round(initialMatchRatio * 100), 38), 88);
  const potentialScore = Math.min(matchScore + Math.min(missingKeywords.length * 5, 35), 98);

  // Generate Tailored Summary
  const candidateName = resumeData.personal_info?.full_name?.split(" ")[0] || "Results-driven professional";
  const matchedSlice = matchedKeywords.slice(0, 4).join(", ") || "full-stack development";
  const missingSlice = missingKeywords.slice(0, 3).join(", ") || "cloud-native architectures";
  
  const tailoredSummary = `${candidateName} with extensive expertise in ${matchedSlice} and ${missingSlice}. Proven track record of architecting scalable applications, driving cross-functional agile initiatives, and delivering quantifiable business impact for enterprise-grade systems aligned with ${targetRole || "the target position"}.`;

  return {
    matchScore,
    potentialScore,
    matchedKeywords,
    missingKeywords,
    tailoredSummary,
    skillsToAdd: missingKeywords.slice(0, 8),
  };
};

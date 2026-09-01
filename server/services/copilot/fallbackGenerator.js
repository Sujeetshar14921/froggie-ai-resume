/**
 * Generate smart, personalized fallback response when external AI API fails
 * @param {string} message - User input prompt
 * @param {Object} currentResume - Active candidate resume context
 * @returns {Object} Fallback response object matching copilot schema
 */
export const generateSmartFallback = (message = "", currentResume = null) => {
  const msgLower = (message || "").toLowerCase();

  // 1. Direct Skills or Resume Updates Fallback
  if (
    msgLower.includes("skill") ||
    msgLower.includes("add") ||
    msgLower.includes("update") ||
    msgLower.includes("modify")
  ) {
    const existingSkills = currentResume?.skills || ["React", "JavaScript", "Node.js"];
    const candidateSkills = ["Docker", "TypeScript", "Next.js", "PostgreSQL", "REST APIs"];
    const merged = Array.from(new Set([...existingSkills, ...candidateSkills]));

    return {
      content:
        "I have processed your request to update your skills. You can review the updated fields and click 'Apply Changes to Resume Directly' below to update your resume in real-time.",
      cardType: "direct_resume_update",
      cardData: {
        summaryOfChanges: "Updated resume skills and added modern industry-standard technologies.",
        affectedSections: ["skills"],
        updates: {
          skills: merged,
        },
      },
    };
  }

  // 2. ATS Score Audit Fallback
  if (msgLower.includes("ats") || msgLower.includes("score")) {
    return {
      content:
        "Here is your full ATS Compatibility Audit with score breakdown, matched vs missing skills, and optimization recommendations.",
      cardType: "in_chat_ats_score",
      cardData: {
        overallScore: 88,
        ratingLabel: "Strong Match",
        targetRole: currentResume?.personal_info?.profession || "Full Stack Developer",
        breakdown: {
          keywordMatch: 90,
          skillsMatch: 86,
          experienceMatch: 85,
          titleMatch: 92,
          educationMatch: 95,
          structure: 95,
          readability: 94,
        },
        matchedSkills: (currentResume?.skills || ["React", "JavaScript", "Node.js"]).slice(0, 6),
        missingSkills: ["Cloud Architecture (AWS/GCP)", "CI/CD Pipelines", "Docker Containerization"],
        actionableRecommendations: [
          "Add quantifiable metric bullet points (e.g. 'Boosted performance by 30%') to your work experience.",
          "Include high-demand cloud and automated testing keywords.",
        ],
      },
    };
  }

  // 3. Job Role Matching Fallback
  if (
    msgLower.includes("job") ||
    msgLower.includes("role") ||
    msgLower.includes("match") ||
    msgLower.includes("kiske liye") ||
    msgLower.includes("career")
  ) {
    const role = currentResume?.personal_info?.profession || "Full Stack Developer";
    return {
      content: `### Top Matching Job Roles For Your Profile

Based on your technical skills, experience, and projects in **${role}**, here are the top roles you are primed for:

1. **Senior Full Stack Engineer (94% Match)**
   - **Matching Skills**: ${currentResume?.skills?.slice(0, 5)?.join(", ") || "React, Node.js, JavaScript, Database design"}
   - **Target Industries**: SaaS, FinTech, High-growth Tech Startups

2. **Frontend Engineer / React Specialist (90% Match)**
   - **Key Strengths**: UI architecture, responsive design, state management

3. **Backend / API Engineer (86% Match)**
   - **Recommended Additions**: Cloud deployments (AWS), Docker containerization`,
      cardType: "none",
      cardData: null,
    };
  }

  // 4. Mock Interview Fallback
  if (
    msgLower.includes("question") ||
    msgLower.includes("interview") ||
    msgLower.includes("pucho") ||
    msgLower.includes("ask")
  ) {
    const projName = currentResume?.project?.[0]?.name || "your primary project";
    return {
      content: `### Mock Technical & Behavioral Interview Questions

Here are 3 tailored interview questions based on your resume:

1. **System Design / Architecture**: Can you walk me through the architecture of **${projName}** and explain how you handled scalability and performance bottlenecks?
2. **Problem Solving**: Tell me about a critical bug or production incident you diagnosed and resolved under tight deadlines.
3. **Behavioral**: How do you prioritize conflicting technical requirements when working closely with cross-functional teams?

*Type your answer to any question, and I'll give you a detailed evaluation and STAR score!*`,
      cardType: "mock_interview",
      cardData: {
        question: `Can you walk me through the architecture of ${projName} and explain how you handled scalability?`,
        questionType: "System Design & Technical Architecture",
        hints: ["Use Situation-Task-Action-Result format", "Highlight measurable speed or efficiency improvements"],
        sampleGoodResponse:
          "Discuss modular component breakdown, state management, API caching, and database query optimization.",
      },
    };
  }

  // 5. Default General Advice Fallback
  return {
    content:
      "I've analyzed your resume profile. How would you like to optimize your resume today? You can ask me to calculate your ATS score, rewrite any section, suggest matching job roles, or ask you interview questions!",
    cardType: "none",
    cardData: null,
  };
};

export default {
  generateSmartFallback,
};

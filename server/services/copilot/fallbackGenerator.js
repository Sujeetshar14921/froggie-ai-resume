/**
 * Generate smart, personalized fallback response when external AI API fails
 * @param {string} message - User input prompt
 * @param {Object} currentResume - Active candidate resume context
 * @returns {Object} Fallback response object matching copilot schema
 */
export const generateSmartFallback = (message = "", currentResume = null) => {
  const msgLower = (message || "").toLowerCase();

  // 0. Complete Resume Creation Fallback ("Create / Banao Full Stack Resume")
  if (
    msgLower.includes("create") ||
    msgLower.includes("banao") ||
    msgLower.includes("full stack") ||
    msgLower.includes("new resume") ||
    msgLower.includes("generate")
  ) {
    const role = msgLower.includes("frontend")
      ? "Frontend Engineer"
      : msgLower.includes("backend")
      ? "Backend Engineer"
      : "Full Stack Developer";

    return {
      content: `### ✨ 100% ATS-Friendly ${role} Resume Prepared!\n\nI have structured a complete, production-grade resume with STAR metric bullets, high-density keywords, modern tech stack, and optimized summary.\n\nClick **"⚡ Create in My Resumes & Open in Editor"** below to save this directly to your account!`,
      cardType: "direct_resume_update",
      cardData: {
        isNewResume: true,
        resumeTitle: `${role} ATS Resume`,
        targetRole: role,
        summaryOfChanges: `Complete 100% ATS-optimized ${role} resume created.`,
        affectedSections: [
          "personal_info",
          "professional_summary",
          "skills",
          "experience",
          "project",
          "education",
          "certifications",
          "achievements",
        ],
        updates: {
          personal_info: {
            full_name: currentResume?.personal_info?.full_name || "Alex Morgan",
            profession: role,
            email: currentResume?.personal_info?.email || "alex.morgan.dev@example.com",
            phone: currentResume?.personal_info?.phone || "+91 98765 43210",
            location: currentResume?.personal_info?.location || "Bengaluru, India",
            linkedin: currentResume?.personal_info?.linkedin || "linkedin.com/in/alexmorgan",
            github: currentResume?.personal_info?.github || "github.com/alexmorgan",
          },
          professional_summary:
            `High-impact ${role} with 3+ years of experience architecting high-scale web applications, microservices, and modern user interfaces. Proven track record of improving API latency by 42% and scaling architectures to 250k+ active users. Skilled in modern JavaScript/TypeScript ecosystems, cloud containerization, and clean test-driven design.`,
          skills: [
            "React.js",
            "Node.js",
            "Express",
            "TypeScript",
            "Next.js",
            "MongoDB",
            "PostgreSQL",
            "REST APIs",
            "GraphQL",
            "Docker",
            "AWS (S3/EC2)",
            "Tailwind CSS",
            "Redux Toolkit",
            "Jest",
            "Git & GitHub",
            "CI/CD Pipelines",
          ],
          experience: [
            {
              company: "Nexus Cloud Systems",
              position: `Senior ${role}`,
              start_date: "2023-01",
              end_date: "Present",
              is_current: true,
              description:
                "• Architected and deployed microservices handling 250k+ monthly requests, improving API response time by 42%.\n• Spearheaded the migration from legacy monolith to React & Node.js, slashing page load times by 35%.\n• Implemented automated CI/CD deployment pipelines using Docker and GitHub Actions, cutting release cycles from 2 days to 30 minutes.",
            },
            {
              company: "Horizon Tech Labs",
              position: `${role}`,
              start_date: "2021-06",
              end_date: "2022-12",
              is_current: false,
              description:
                "• Built responsive, accessible user interfaces in React.js and Tailwind CSS for 4 enterprise web applications.\n• Engineered secure RESTful backend APIs in Express and MongoDB with JWT authentication and rate limiting.\n• Reduced database query bottlenecks by 28% through indexing and Redis caching strategies.",
            },
          ],
          project: [
            {
              name: "CloudScale Microservices E-Commerce",
              type: "Full Stack Distributed Web App",
              description:
                "Engineered a scalable e-commerce platform using React, Node.js, MongoDB, and Redis featuring real-time inventory management and Stripe integration.",
            },
            {
              name: "AI-Powered Talent Analyzer",
              type: "AI & Full Stack Application",
              description:
                "Developed an automated resume parser and candidate match scoring engine utilizing Next.js, Express, and OpenAI API with 98% parsing accuracy.",
            },
          ],
          education: [
            {
              institution: "National Institute of Technology",
              degree: "B.Tech in Computer Science & Engineering",
              field: "Computer Science",
              graduation_date: "2021",
              gpa: "8.8 / 10",
            },
          ],
          certifications: [
            {
              name: "AWS Certified Developer – Associate",
              issuer: "Amazon Web Services",
              date: "2024",
              url: "https://aws.amazon.com",
            },
          ],
          achievements: [
            {
              title: "1st Place – Smart India Hackathon",
              date: "2023",
              description:
                "Built an automated logistics optimizer serving 10,000 simulated routes in real-time.",
            },
          ],
        },
      },
    };
  }

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

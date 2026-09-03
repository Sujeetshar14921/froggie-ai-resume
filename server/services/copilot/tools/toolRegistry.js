import {
  getUserResumesHandler,
  getActiveResumeHandler,
  getResumeHandler,
  createResumeHandler,
  createResumeFromDataHandler,
  updateResumeHandler,
  updateResumeSectionHandler,
  deleteResumeHandler,
  deleteAllResumesHandler,
} from "./handlers/resumeTools.js";

import {
  getUserProfileHandler,
  updateProfileHandler,
} from "./handlers/profileTools.js";

import {
  calculateAtsScoreHandler,
  analyzeJobDescriptionHandler,
  tailorResumeForJobHandler,
  generateCoverLetterHandler,
  generateInterviewQuestionsHandler,
  generateLinkedinProfileHandler,
  careerAnalysisHandler,
} from "./handlers/careerTools.js";

/**
 * Dispatcher mapping tool name to authorized handler
 */
const HANDLER_MAP = {
  // Profile
  get_user_profile: getUserProfileHandler,
  update_profile: updateProfileHandler,

  // Resume / File retrieval
  get_user_resumes: getUserResumesHandler,
  get_my_files: getUserResumesHandler,
  get_active_resume: getActiveResumeHandler,
  get_resume: getResumeHandler,

  // Resume mutations
  create_resume: createResumeHandler,
  create_file: createResumeHandler,
  create_resume_from_data: createResumeFromDataHandler,
  update_resume: updateResumeHandler,
  update_resume_section: updateResumeSectionHandler,

  // Destructive operations
  delete_resume: deleteResumeHandler,
  delete_file: deleteResumeHandler,
  delete_all_resumes: deleteAllResumesHandler,

  // Career Intelligence & ATS
  analyze_resume: calculateAtsScoreHandler,
  calculate_ats_score: calculateAtsScoreHandler,
  analyze_job_description: analyzeJobDescriptionHandler,
  tailor_resume_for_job: tailorResumeForJobHandler,
  generate_cover_letter: generateCoverLetterHandler,
  generate_interview_questions: generateInterviewQuestionsHandler,
  generate_linkedin_profile: generateLinkedinProfileHandler,
  career_analysis: careerAnalysisHandler,
};

/**
 * Execute tool safely with strict user scoping
 *
 * @param {Object} params
 * @param {string} params.toolName - Name of the tool requested by Gemini
 * @param {Object} params.args - Tool arguments emitted by Gemini
 * @param {string} params.userId - Verified user ID from JWT session (never client body)
 * @param {Object} params.user - User document from DB
 * @param {string} params.activeResumeId - Currently selected resume ID
 * @param {Object} params.aiClient - AI client instance
 * @returns {Promise<Object>} Execution result
 */
export const executeCopilotTool = async ({
  toolName,
  args = {},
  userId,
  user,
  activeResumeId = null,
  currentResume = null,
  aiClient,
}) => {
  if (!userId) {
    throw new Error("Unauthorized tool execution: userId is required");
  }

  const handler = HANDLER_MAP[toolName];
  if (!handler) {
    return {
      success: false,
      message: `Tool "${toolName}" is not recognized by the backend.`,
    };
  }

  try {
    const result = await handler({
      userId,
      user,
      args,
      activeResumeId,
      currentResume,
      aiClient,
    });
    return result;
  } catch (error) {
    console.error(`Tool Execution Error (${toolName}):`, error);
    return {
      success: false,
      message: `Failed to execute ${toolName}: ${error.message}`,
    };
  }
};

export default {
  executeCopilotTool,
};

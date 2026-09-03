/**
 * Career & Intelligence Tools Aggregator
 * Re-exports modular, single-responsibility handlers:
 * - atsTools.js: calculateAtsScoreHandler, analyzeJobDescriptionHandler
 * - contentTools.js: tailorResumeForJobHandler, generateCoverLetterHandler, generateLinkedinProfileHandler
 * - coachingTools.js: generateInterviewQuestionsHandler, careerAnalysisHandler
 */

export * from "./atsTools.js";
export * from "./contentTools.js";
export * from "./coachingTools.js";

import atsTools from "./atsTools.js";
import contentTools from "./contentTools.js";
import coachingTools from "./coachingTools.js";

export default {
  ...atsTools,
  ...contentTools,
  ...coachingTools,
};

export { COPILOT_SYSTEM_PROMPT } from "./prompts.js";
export {
  formatResumeContext,
  formatUserAndResumeContext,
  buildConversationHistory,
} from "./contextFormatter.js";
export { cleanMessageText, normalizeCopilotResponse } from "./responseNormalizer.js";
export { generateSmartFallback } from "./fallbackGenerator.js";
export { COPILOT_TOOLS, getGeminiToolsDeclaration } from "./tools/toolDefinitions.js";
export { executeCopilotTool } from "./tools/toolRegistry.js";


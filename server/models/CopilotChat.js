import mongoose from "mongoose";

const CopilotMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    cardType: {
      type: String,
      enum: [
        "none",
        "direct_resume_update",
        "in_chat_ats_score",
        "resume_suggestion",
        "job_analysis",
        "should_i_apply",
        "mock_interview",
        "interview_evaluation",
        "cover_letter",
        "recruiter_message",
        "credibility_check",
      ],
      default: "none",
    },
    cardData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const CopilotChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "Career Chat",
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
    jobContext: {
      type: String,
      default: "",
    },
    messages: [CopilotMessageSchema],
  },
  { timestamps: true }
);

const CopilotChat = mongoose.model("CopilotChat", CopilotChatSchema);

export default CopilotChat;

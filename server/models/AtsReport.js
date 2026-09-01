import mongoose from "mongoose";

const AtsReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
    resumeTitle: {
      type: String,
      default: "Analyzed Resume",
    },
    jobTitle: {
      type: String,
      default: "Target Role",
    },
    jobDescription: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    summary: {
      label: {
        type: String,
        default: "Match Analysis",
      },
      message: {
        type: String,
        default: "",
      },
    },
    scores: {
      keywordMatch: { type: Number, default: 0 },
      skillsMatch: { type: Number, default: 0 },
      experienceMatch: { type: Number, default: 0 },
      titleMatch: { type: Number, default: 0 },
      educationMatch: { type: Number, default: 0 },
      structure: { type: Number, default: 0 },
      readability: { type: Number, default: 0 },
    },
    skills: {
      matched: [{ type: String }],
      missing: [{ type: String }],
      partial: [{ type: String }],
    },
    keywords: {
      matched: [{ type: String }],
      missing: [{ type: String }],
      important: [{ type: String }],
    },
    experience: {
      requiredYears: { type: Number, default: 0 },
      resumeYears: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      analysis: { type: String, default: "" },
    },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    atsIssues: [
      {
        severity: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "low",
        },
        message: { type: String },
      },
    ],
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

const AtsReport = mongoose.model("AtsReport", AtsReportSchema);

export default AtsReport;

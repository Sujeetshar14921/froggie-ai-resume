import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["signup", "reset_password"],
      required: true,
    },
    // Temporary payload storage for signup (e.g. name, hashed password)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Document expires and automatically deletes in 10 minutes (600 seconds)
    },
  },
  { timestamps: true }
);

// Compound index for fast queries
OtpSchema.index({ email: 1, purpose: 1 });

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;

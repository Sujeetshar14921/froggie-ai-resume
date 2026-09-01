import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import atsRouter from "./routes/atsRoutes.js";
import copilotRouter from "./routes/copilotRoutes.js";
import testimonialRouter from "./routes/testimonialRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Health & Database status endpoint
app.get("/", (req, res) => res.send("ResumeForge Server is live..."));
app.get("/api/health", (req, res) => {
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const dbState = mongoose.connection.readyState;
  res.json({
    status: "ok",
    database: stateMap[dbState] || "unknown",
    dbReadyState: dbState,
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// App API routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/ats", atsRouter);
app.use("/api/copilot", copilotRouter);
app.use("/api/testimonials", testimonialRouter);

// Start server after connecting to database
try {
  await connectDB();
} catch (err) {
  console.error("Warning: Starting server without initial database connection. Auto-reconnect enabled.", err.message);
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
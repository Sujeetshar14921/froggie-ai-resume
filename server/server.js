import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import atsRouter from "./routes/atsRoutes.js";
import copilotRouter from "./routes/copilotRoutes.js";
import testimonialRouter from "./routes/testimonialRoutes.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Production Performance Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cors());

// Health & Database status endpoint
app.get("/", (req, res) => res.send("Froggie AI Resume Server is live & hardened 🚀"));
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

// Apply General Rate Limiter to API routes
app.use("/api", generalLimiter);

// Database connectivity middleware for API routes
app.use("/api", async (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(503).json({
        message: "Database connection unavailable. Please check MongoDB connection.",
        error: err.message,
      });
    }
  }
  next();
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
  console.log(`🚀 Froggie Server is running on port ${PORT}`);
});
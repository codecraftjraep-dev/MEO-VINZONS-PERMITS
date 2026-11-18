import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import env from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";


import permitRoutes from "./routes/permitRoutes.js";


const app = express();
console.log("Frontend CORS Origin:", env.FRONTEND_URL);

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// Request parsing middleware
app.use(express.json({ limit: "1mb" }));
app.use("/api/permits", permitRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MEO Permit Archive API is running.",
    environment: env.NODE_ENV,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found.",
  });
});
// Centralized error handler
app.use(errorHandler);

// Export Express application
export default app;

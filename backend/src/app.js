import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import env from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import permitRoutes from "./routes/permitRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = [env.FRONTEND_URL, "http://localhost:5173"].filter(
  Boolean,
);

console.log("Allowed CORS Origins:", allowedOrigins);

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/permits", permitRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MEO Permit Archive API is running.",
    environment: env.NODE_ENV,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found.",
  });
});

app.use(errorHandler);

export default app;

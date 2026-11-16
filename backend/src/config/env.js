import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  FRONTEND_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  COOKIE_NAME: z.string().default("meo_token"),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  MAX_FILE_SIZE: z.coerce.number().default(10485760),
  UPLOAD_DIR: z.string().default("uploads"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsedEnv.data;

export default env;

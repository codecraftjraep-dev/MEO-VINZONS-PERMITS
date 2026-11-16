import { z } from "zod";

const passwordSchema = z
  .string()
  .min(12, "Password must contain at least 12 characters.")
  .max(128)
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character.");

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email()
      .max(254)
      .transform((v) => v.trim().toLowerCase()),
    password: z.string().min(1).max(128),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z
      .string()
      .email()
      .max(254)
      .transform((v) => v.trim().toLowerCase()),
    password: passwordSchema,
    role: z.enum(["admin", "encoder", "viewer"]),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1).max(128),
    newPassword: passwordSchema,
  }),
});

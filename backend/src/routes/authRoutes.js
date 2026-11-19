import express from "express";
import rateLimit from "express-rate-limit";

import {
  login,
  logout,
  currentUser,
  createNewUser,
  updatePassword,
  listUsers,
  editUser,
  changeUserStatus,
  adminResetPassword,
} from "../controllers/authController.js";


import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  loginSchema,
  createUserSchema,
  changePasswordSchema,
  updateUserSchema,
  updateUserStatusSchema,
  resetUserPasswordSchema,
} from "../validators/authValidator.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

router.post("/login", loginLimiter, validate(loginSchema), asyncHandler(login));

router.post("/logout", authenticate, asyncHandler(logout));

router.get("/me", authenticate, asyncHandler(currentUser));

router.post(
  "/users",
  authenticate,
  authorize("admin"),
  validate(createUserSchema),
  asyncHandler(createNewUser),
);


router.get(
  "/users",
  authenticate,
  authorize("admin"),
  asyncHandler(listUsers),
);

router.patch(
  "/users/:id",
  authenticate,
  authorize("admin"),
  validate(updateUserSchema),
  asyncHandler(editUser),
);

router.patch(
  "/users/:id/status",
  authenticate,
  authorize("admin"),
  validate(updateUserStatusSchema),
  asyncHandler(changeUserStatus),
);

router.patch(
  "/users/:id/reset-password",
  authenticate,
  authorize("admin"),
  validate(resetUserPasswordSchema),
  asyncHandler(adminResetPassword),
);


router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(updatePassword),
);

export default router;

import {
  createUser,
  loginUser,
  getCurrentUser,
  changeUserPassword,
  getAllUsers,
  updateUser,
  updateUserStatus,
  resetUserPassword,
} from "../services/authService.js";

import env from "../config/env.js";

const isProduction = env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: cookieOptions.httpOnly,
  secure: cookieOptions.secure,
  sameSite: cookieOptions.sameSite,
  path: cookieOptions.path,
};

export const login = async (req, res) => {
  const { email, password } = req.validated.body;

  const { user, token } = await loginUser(email, password);

  res.cookie(env.COOKIE_NAME, token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

export const logout = async (req, res) => {
  res.clearCookie(env.COOKIE_NAME, clearCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

export const currentUser = async (req, res) => {
  const user = await getCurrentUser(req.user._id);

  res.status(200).json({
    success: true,
    data: { user },
  });
};

export const createNewUser = async (req, res) => {
  const user = await createUser(req.validated.body);

  res.status(201).json({
    success: true,
    message: "User created successfully.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.validated.body;

  await changeUserPassword(req.user._id, currentPassword, newPassword);

  res.clearCookie(env.COOKIE_NAME, clearCookieOptions);

  res.status(200).json({
    success: true,
    message: "Password changed. Please log in again.",
  });
};

export const listUsers = async (req, res) => {
  const users = await getAllUsers({
    search: req.query.search || "",
    role: req.query.role || "",
    status: req.query.status || "",
  });

  res.status(200).json({
    success: true,
    data: { users },
  });
};

export const editUser = async (req, res) => {
  const user = await updateUser(
    req.params.id,
    req.validated.body,
    req.user._id,
  );

  res.status(200).json({
    success: true,
    message: "User updated successfully.",
    data: { user },
  });
};

export const changeUserStatus = async (req, res) => {
  const user = await updateUserStatus(
    req.params.id,
    req.validated.body.isActive,
    req.user._id,
  );

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? "activated" : "deactivated"} successfully.`,
    data: { user },
  });
};

export const adminResetPassword = async (req, res) => {
  await resetUserPassword(req.params.id, req.validated.body.newPassword);

  res.status(200).json({
    success: true,
    message:
      "User password reset successfully. Their existing sessions have been invalidated.",
  });
};

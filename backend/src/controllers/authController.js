import {
  createUser,
  loginUser,
  getCurrentUser,
  changeUserPassword,
} from "../services/authService.js";

import env from "../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "strict",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
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
  res.clearCookie(env.COOKIE_NAME, {
    ...cookieOptions,
    maxAge: undefined,
  });

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

  res.clearCookie(env.COOKIE_NAME, {
    ...cookieOptions,
    maxAge: undefined,
  });

  res.status(200).json({
    success: true,
    message: "Password changed. Please log in again.",
  });
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import env from "../config/env.js";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export const createUser = async (data) => {
  const existing = await User.findOne({
    email: data.email,
  });

  if (existing) {
    const error = new Error("Email is already registered.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select(
    "+passwordHash +failedLoginAttempts +lockUntil",
  );

  const invalidCredentials = () => {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    return error;
  };

  if (!user) {
    throw invalidCredentials();
  }

  if (!user.isActive) {
    throw invalidCredentials();
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    const error = new Error(
      "Account temporarily locked. Please try again later.",
    );

    error.statusCode = 423;
    throw error;
  }

  if (user.lockUntil && user.lockUntil <= new Date()) {
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
    }

    await user.save();

    throw invalidCredentials();
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;

  await user.save();

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: "meo-permit-archive",
    },
  );

  return {
    user,
    token,
  };
};

export const getCurrentUser = async (userId) => {
  return User.findOne({
    _id: userId,
    isActive: true,
  }).select("_id name email role isActive createdAt");
};

export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword,
) => {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    const error = new Error("User account not found.");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isMatch) {
    const error = new Error("Current password is incorrect.");
    error.statusCode = 400;
    throw error;
  }

  const samePassword = await bcrypt.compare(newPassword, user.passwordHash);

  if (samePassword) {
    const error = new Error(
      "New password must be different from current password.",
    );

    error.statusCode = 400;
    throw error;
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordChangedAt = new Date();

  await user.save();

  return true;
};

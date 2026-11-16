import jwt from "jsonwebtoken";

import User from "../models/User.js";
import env from "../config/env.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies[env.COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: "meo-permit-archive",
    });

    const user = await User.findOne({
      _id: decoded.sub,
      isActive: true,
    }).select("_id name email role isActive passwordChangedAt");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account is unavailable.",
      });
    }

    if (
      user.passwordChangedAt &&
      decoded.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }
};

export default authenticate;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "encoder", "viewer"],
      default: "viewer",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    lockUntil: {
      type: Date,
      default: null,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);


const User = mongoose.model("User", userSchema);

export default User;

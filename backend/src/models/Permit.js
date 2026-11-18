import mongoose from "mongoose";

const PermitSchema = new mongoose.Schema(
  {
    permitType: {
      type: String,
      enum: ["building", "occupancy"],
      required: true,
    },

    permitNo: {
      type: String,
      required: true,
      trim: true,
    },

    dateIssued: {
      type: String,
      default: "",
    },

    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    projectLocation: {
      type: String,
      required: true,
      trim: true,
    },

    owners: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

PermitSchema.index(
  { permitType: 1, permitNo: 1 },
  { unique: true },
);

const Permit = mongoose.model("Permit", PermitSchema);

export default Permit;
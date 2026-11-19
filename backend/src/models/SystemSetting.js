
import mongoose from "mongoose";

const SystemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "permit-signatories",
    },
    signatories: {
      building: {
        name: { type: String, default: "" },
        position: { type: String, default: "" },
      },
      occupancy: {
        name: { type: String, default: "" },
        position: { type: String, default: "" },
      },
    },
  },
  { timestamps: true },
);

const SystemSetting = mongoose.model("SystemSetting", SystemSettingSchema);

export default SystemSetting;

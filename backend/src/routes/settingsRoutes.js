
import express from "express";
import SystemSetting from "../models/SystemSetting.js";

const router = express.Router();

const defaultSignatories = {
  building: { name: "", position: "" },
  occupancy: { name: "", position: "" },
};

router.get("/signatories", async (req, res) => {
  try {
    let settings = await SystemSetting.findOne({
      key: "permit-signatories",
    });

    if (!settings) {
      settings = await SystemSetting.create({
        key: "permit-signatories",
        signatories: defaultSignatories,
      });
    }

    return res.status(200).json({
      success: true,
      data: settings.signatories,
    });
  } catch (error) {
    console.error("Error fetching signatories:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch signatory settings.",
    });
  }
});

router.put("/signatories", async (req, res) => {
  try {
    const { building, occupancy } = req.body;

    const signatories = {
      building: {
        name: String(building?.name || "").trim(),
        position: String(building?.position || "").trim(),
      },
      occupancy: {
        name: String(occupancy?.name || "").trim(),
        position: String(occupancy?.position || "").trim(),
      },
    };

    const settings = await SystemSetting.findOneAndUpdate(
      { key: "permit-signatories" },
      {
        $set: {
          signatories,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Signatory settings saved successfully.",
      data: settings.signatories,
    });
  } catch (error) {
    console.error("Error saving signatories:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save signatory settings.",
    });
  }
});

export default router;

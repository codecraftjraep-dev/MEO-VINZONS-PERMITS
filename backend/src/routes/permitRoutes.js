import express from "express";
import Permit from "../models/Permit.js";

const router = express.Router();

// CREATE PERMIT
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (!["building", "occupancy"].includes(data.permitType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permit type.",
      });
    }

    const permitNo =
      data.permitType === "building"
        ? data.permitNo
        : data.occupancyNo;

    const dateIssued =
      data.permitType === "building"
        ? data.dateIssued
        : data.occupancyDateIssued;

    if (!permitNo || !data.projectName || !data.projectLocation) {
      return res.status(400).json({
        success: false,
        message: "Permit number, project name, and project location are required.",
      });
    }

    const permit = await Permit.create({
      permitType: data.permitType,
      permitNo,
      dateIssued: dateIssued || "",
      projectName: data.projectName,
      projectLocation: data.projectLocation,
      owners: data.owners || [],
      data,
    });

    return res.status(201).json({
      success: true,
      message: "Permit successfully saved.",
      permit,
    });
  } catch (error) {
    console.error("Save permit error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A permit with this number already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to save permit.",
      error: error.message,
    });
  }
});

// GET ALL PERMITS
router.get("/", async (req, res) => {
  try {
    const permits = await Permit.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: permits.length,
      permits,
    });
  } catch (error) {
    console.error("Fetch permits error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve permits.",
    });
  }
});

// GET PERMIT BY ID
router.get("/:id", async (req, res) => {
  try {
    const permit = await Permit.findById(req.params.id);

    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Permit not found.",
      });
    }

    res.status(200).json({
      success: true,
      permit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve permit.",
    });
  }
});

export default router;
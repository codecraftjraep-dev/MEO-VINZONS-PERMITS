
import express from "express";
import Permit from "../models/Permit.js";
import mongoose from "mongoose";
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
        message:
          "Permit number, project name, and project location are required.",
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
const collectSearchableValues = (value, values = []) => {
  if (value === null || value === undefined) {
    return values;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectSearchableValues(item, values));
    return values;
  }

  if (value instanceof Date) {
    values.push(value.toISOString());
    return values;
  }

  if (typeof value === "object") {
    Object.values(value).forEach((item) =>
      collectSearchableValues(item, values),
    );

    return values;
  }

  values.push(String(value));

  return values;
};
// GET ALL / SEARCH PERMITS
router.get("/", async (req, res) => {
  try {
    const { search, limit } = req.query;

    const permits = await Permit.find().sort({ createdAt: -1 }).lean();

    let filteredPermits = permits;

    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();

      filteredPermits = permits.filter((permit) => {
        const searchableValues = [
          permit.permitNo,
          permit.permitType,
          permit.dateIssued,
          permit.projectName,
          permit.projectLocation,
          ...collectSearchableValues(permit.owners),
          ...collectSearchableValues(permit.data),
        ];

        return searchableValues.some((value) =>
          String(value).toLowerCase().includes(searchTerm),
        );
      });
    }

    const totalCount = filteredPermits.length;

    if (limit) {
      const parsedLimit = Number.parseInt(limit, 10);

      if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
        filteredPermits = filteredPermits.slice(0, Math.min(parsedLimit, 100));
      }
    }

    return res.status(200).json({
      success: true,
      count: filteredPermits.length,
      totalCount,
      permits: filteredPermits,
    });
  } catch (error) {
    console.error("Fetch permits error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve permits.",
    });
  }
});

// GENERATE BUILDING PERMIT NUMBER
router.get("/next-number", async (req, res) => {
  try {
    const now = new Date();

    const dateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
    }).formatToParts(now);

    const year = dateParts.find((part) => part.type === "year").value;
    const month = dateParts.find((part) => part.type === "month").value;

    const prefix = `${year}-${month}-`;

    const permits = await Permit.find({
      permitType: "building",
      permitNo: { $regex: `^${prefix}` },
    }).select("permitNo");

    const highestNumber = permits.reduce((highest, permit) => {
      const sequence = Number(permit.permitNo.split("-").pop());
      return Number.isFinite(sequence)
        ? Math.max(highest, sequence)
        : highest;
    }, 0);

    const nextNumber = String(highestNumber + 1).padStart(2, "0");

    res.json({
      permitNo: `${prefix}${nextNumber}`,
    });
  } catch (error) {
    console.error("Building permit number error:", error);

    res.status(500).json({
      message: "Failed to generate the next building permit number.",
    });
  }
});

// GENERATE OCCUPANCY PERMIT NUMBER
router.get("/next-occupancy-number", async (req, res) => {
  try {
    const now = new Date();

    const dateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
    }).formatToParts(now);

    const year = dateParts.find((part) => part.type === "year").value;
    const month = dateParts.find((part) => part.type === "month").value;

    const prefix = `${year}-${month}-`;

    const permits = await Permit.find({
      permitType: "occupancy",
      permitNo: { $regex: `^${prefix}` },
    }).select("permitNo");

    const highestNumber = permits.reduce((highest, permit) => {
      const sequence = Number(permit.permitNo.split("-").pop());
      return Number.isFinite(sequence)
        ? Math.max(highest, sequence)
        : highest;
    }, 0);

    const nextNumber = String(highestNumber + 1).padStart(2, "0");

    res.json({
      occupancyNo: `${prefix}${nextNumber}`,
    });
  } catch (error) {
    console.error("Occupancy permit number error:", error);

    res.status(500).json({
      message: "Failed to generate the next occupancy permit number.",
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
// DELETE PERMIT
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permit ID.",
      });
    }

    const permit = await Permit.findById(id);

    if (!permit) {
      return res.status(404).json({
        success: false,
        message: "Permit record not found.",
      });
    }

    await permit.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Permit deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PERMIT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete permit.",
    });
  }
});
export default router;

import connectDB from "../config/db.js";
import mongoose from "mongoose";
import Permit from "../models/Permit.js";
const MONTH_PREFIX = "2026-11";

const projects = [
  "Proposed Two-Storey Residential Building",
  "Proposed Single-Storey Residential Building",
  "Proposed Commercial Building",
  "Proposed Apartment Building",
  "Proposed Office Building",
  "Proposed Mixed-Use Building",
  "Proposed Warehouse Building",
  "Proposed Retail Store",
  "Proposed Restaurant Building",
  "Proposed Boarding House",
  "Proposed Dormitory Building",
  "Proposed Concrete Residential House",
  "Proposed School Building",
  "Proposed Health Center",
  "Proposed Agricultural Building",
  "Proposed Storage Building",
  "Proposed Extension of Residential Building",
  "Proposed Renovation of Commercial Building",
  "Proposed Three-Storey Residential Building",
  "Proposed Service Center",
  "Proposed Multi-Purpose Building",
  "Proposed Tourism Facility",
  "Proposed Hardware Store",
  "Proposed Business Establishment",
  "Proposed Community Center",
];

const locations = [
  "Barangay Aguit-it, Vinzons, Camarines Norte",
  "Barangay Calangcawan, Vinzons, Camarines Norte",
  "Barangay Cagbalogo, Vinzons, Camarines Norte",
  "Barangay Mangcayo, Vinzons, Camarines Norte",
  "Barangay Singi, Vinzons, Camarines Norte",
  "Barangay Sabang, Vinzons, Camarines Norte",
  "Barangay Sula, Vinzons, Camarines Norte",
  "Barangay Guinacutan, Vinzons, Camarines Norte",
  "Barangay Pinagtigasan, Vinzons, Camarines Norte",
  "Barangay Mangcawayan, Vinzons, Camarines Norte",
];

const firstNames = [
  "Juan", "Pedro", "Jose", "Carlos", "Miguel",
  "Antonio", "Ramon", "Andres", "Roberto", "Daniel",
  "Maria", "Ana", "Rosa", "Carmen", "Sofia",
  "Elena", "Teresa", "Angela", "Patricia", "Gloria",
];

const lastNames = [
  "Dela Cruz", "Santos", "Reyes", "Garcia", "Mendoza",
  "Bautista", "Ramos", "Villanueva", "Aquino", "Castillo",
  "Navarro", "Fernandez", "Gonzales", "Torres", "Rivera",
];

const middleNames = [
  "Reyes", "Garcia", "Santos", "Cruz", "Mendoza",
  "Ramos", "Bautista", "Aquino", "Flores", "Castillo",
];

const getDate = (day) => `2026-11-${String(day).padStart(2, "0")}`;

const getNextSequence = async (permitType) => {
  const existingPermits = await Permit.find({
    permitType,
    permitNo: { $regex: `^${MONTH_PREFIX}-\\d{2}$` },
  }).select("permitNo");

  const highestNumber = existingPermits.reduce((highest, permit) => {
    const sequence = Number(permit.permitNo.split("-").at(-1));
    return Math.max(highest, sequence);
  }, 0);

  return highestNumber + 1;
};

const createOwner = (index) => ({
  ownerType: "individual",
  firstName: firstNames[index % firstNames.length],
  middleName: middleNames[index % middleNames.length],
  lastName: lastNames[index % lastNames.length],
  suffix: "",
});

const createBuildingPermit = (index, sequence) => {
  const projectName = projects[index];
  const projectLocation = locations[index % locations.length];
  const dateIssued = getDate((index % 19) + 1);
  const owner = createOwner(index);

  return {
    permitType: "building",
    permitNo: `${MONTH_PREFIX}-${String(sequence).padStart(2, "0")}`,
    dateIssued,
    projectName,
    projectLocation,
    owners: [owner],
    data: {
      permitType: "building",
      permitNo: `${MONTH_PREFIX}-${String(sequence).padStart(2, "0")}`,
      dateIssued,
      projectName,
      projectLocation,
      owners: [owner],
      applicantName: `${owner.firstName} ${owner.middleName} ${owner.lastName}`,
      fsecNo: `A-1-${String(12345 + index).padStart(5, "0")}-${String(1234567 + index).padStart(7, "0")}`,
      fsecDateIssued: getDate((index % 15) + 1),
      buildingOfficialReceiptNo: `A-${String(123456789 + index).padStart(9, "0")}`,
      buildingDatePaid: getDate((index % 19) + 1),
      totalProjectCost: 850000 + index * 125000,
      projectArea: 80 + index * 12,
      landArea: 100 + index * 15,
      buildingUse: "Residential",
      remarks: "Sample building permit record",
    },
  };
};

const createOccupancyPermit = (index, sequence) => {
  const projectName = projects[(index + 5) % projects.length];
  const projectLocation = locations[(index + 3) % locations.length];
  const dateIssued = getDate((index % 19) + 1);
  const owner = createOwner(index + 5);

  return {
    permitType: "occupancy",
    permitNo: `${MONTH_PREFIX}-${String(sequence).padStart(2, "0")}`,
    dateIssued,
    projectName,
    projectLocation,
    owners: [owner],
    data: {
      permitType: "occupancy",
      occupancyNo: `${MONTH_PREFIX}-${String(sequence).padStart(2, "0")}`,
      occupancyDateIssued: dateIssued,
      projectName,
      projectLocation,
      owners: [owner],
      applicantName: `${owner.firstName} ${owner.middleName} ${owner.lastName}`,
      fsicNo: `B-1-${String(54321 + index).padStart(5, "0")}-${String(7654321 + index).padStart(7, "0")}`,
      fsicDateIssued: getDate((index % 15) + 1),
      occupancyFeesPaid: 2500 + index * 350,
      occupancyOfficialReceiptNo: `B-${String(987654321 - index).padStart(9, "0")}`,
      occupancyDatePaid: getDate((index % 19) + 1),
      issuedBuildingPermitNo: `2026-10-${String(index + 1).padStart(3, "0")}`,
      buildingPermitDateIssued: getDate((index % 15) + 1),
      buildingUse: "Residential",
      remarks: "Sample occupancy permit record",
    },
  };
};
const seedPermits = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB Atlas.");

    const buildingStart = await getNextSequence("building");
    const occupancyStart = await getNextSequence("occupancy");

    const buildingPermits = Array.from({ length: 25 }, (_, index) =>
      createBuildingPermit(index, buildingStart + index),
    );

    const occupancyPermits = Array.from({ length: 25 }, (_, index) =>
      createOccupancyPermit(index, occupancyStart + index),
    );

    await Permit.insertMany([
      ...buildingPermits,
      ...occupancyPermits,
    ]);

    console.log("Successfully created 50 sample permit records.");
    console.log(`Building Permits: ${buildingPermits.length}`);
    console.log(`Occupancy Permits: ${occupancyPermits.length}`);
  } catch (error) {
    console.error("Error creating sample permits:", error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log("MongoDB connection closed.");
  }
};

seedPermits();
seedPermits();

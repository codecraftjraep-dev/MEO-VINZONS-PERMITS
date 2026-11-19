export const getNextOccupancyNumber = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const prefix = `${year}-${month}-`;

    const lastPermit = await Permit.findOne({
      permitType: "occupancy",
      occupancyNo: { $regex: `^${prefix}` },
    }).sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastPermit?.occupancyNo) {
      const lastNumber = Number(lastPermit.occupancyNo.split("-").pop());
      nextNumber = lastNumber + 1;
    }

    const occupancyNo = `${prefix}${String(nextNumber).padStart(2, "0")}`;

    res.status(200).json({ occupancyNo });
  } catch (error) {
    console.error("Error generating occupancy permit number:", error);
    res.status(500).json({
      message: "Failed to generate occupancy permit number",
    });
  }
};
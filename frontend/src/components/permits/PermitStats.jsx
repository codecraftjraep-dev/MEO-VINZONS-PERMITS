
import StatCard from "../ui/StatCard";

export default function PermitStats({ permits, loading }) {
  const buildingCount = permits.filter(
    (permit) => permit.permitType === "building",
  ).length;

  const occupancyCount = permits.filter(
    (permit) => permit.permitType === "occupancy",
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Permits"
        value={loading ? "..." : permits.length.toLocaleString()}
        subtitle="All archived permit records"
        type="total"
      />

      <StatCard
        title="Building Permits"
        value={loading ? "..." : buildingCount.toLocaleString()}
        subtitle="Building permit records"
        type="issued"
      />

      <StatCard
        title="Certificates of Occupancy"
        value={loading ? "..." : occupancyCount.toLocaleString()}
        subtitle="Occupancy certificate records"
        type="expiring"
      />
    </div>
  );
}

import { Building2, FileText } from "lucide-react";

export default function PermitTypeBadge({ type }) {
  const isBuilding = type === "building";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
        isBuilding
          ? "bg-blue-50 text-blue-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {isBuilding ? <Building2 size={12} /> : <FileText size={12} />}
      {isBuilding ? "Building Permit" : "Certificate of Occupancy"}
    </span>
  );
}

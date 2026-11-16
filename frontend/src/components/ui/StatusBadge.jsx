const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  expired: "bg-amber-50 text-amber-700 ring-amber-600/20",
  revoked: "bg-red-50 text-red-700 ring-red-600/20",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export default function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
        statusStyles[normalized] || statusStyles.cancelled
      }`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {normalized || "Unknown"}
    </span>
  );
}

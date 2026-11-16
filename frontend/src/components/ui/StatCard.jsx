import { FileText, FileCheck, Clock, FileX } from "lucide-react";

const icons = {
  total: FileText,
  issued: FileCheck,
  expiring: Clock,
  revoked: FileX,
};

const styles = {
  total: "bg-blue-50 text-blue-600",
  issued: "bg-emerald-50 text-emerald-600",
  expiring: "bg-amber-50 text-amber-600",
  revoked: "bg-red-50 text-red-600",
};

export default function StatCard({ title, value, subtitle, type = "total" }) {
  const Icon = icons[type] || FileText;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${styles[type] || styles.total}`}>
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>

      {subtitle && <p className="mt-4 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

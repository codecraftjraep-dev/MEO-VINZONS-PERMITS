import { Construction } from "lucide-react";

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mb-4 rounded-2xl bg-brand-50 p-4 text-brand-600">
        <Construction size={28} />
      </div>

      <h2 className="text-lg font-bold text-slate-800">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        {description || "This section is currently under development."}
      </p>
    </div>
  );
}

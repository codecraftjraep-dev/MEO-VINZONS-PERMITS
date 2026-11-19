import { Plus, Trash2 } from "lucide-react";

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export const sectionClass =
  "rounded-xl border border-slate-200 bg-white shadow-sm";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700";

export function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
      <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="text-sm font-bold text-brand-900">{title}</h2>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput({
  className = "",
  type = "text",
  onChange,
  ...props
}) {
  const shouldUppercase = type === "text" || type === "search";

  return (
    <input
      {...props}
      type={type}
      onChange={(e) => {
        if (shouldUppercase) {
          e.target.value = e.target.value.toUpperCase();
        }

        onChange?.(e);
      }}
      className={`${inputClass} ${className}`}
    />
  );
}
export function AddButton({ children, onClick, variant = "primary" }) {
  const styles =
    variant === "outline"
      ? "border border-brand-100 bg-white text-brand-700 hover:bg-brand-50"
      : primaryButtonClass;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${styles}`}
    >
      <Plus size={14} />
      {children}
    </button>
  );
}

export function RemoveButton({ onClick, children = "Remove" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
    >
      <Trash2 size={14} />
      {children}
    </button>
  );
}

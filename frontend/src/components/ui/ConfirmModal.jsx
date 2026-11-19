
import { AlertTriangle, X, Trash2 } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
  variant = "danger",
}) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                isDanger
                  ? "bg-red-50 text-red-600"
                  : "bg-brand-50 text-brand-700"
              }`}
            >
              {isDanger ? (
                <AlertTriangle size={21} />
              ) : (
                <AlertTriangle size={21} />
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {title}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Please confirm your action
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-slate-600">
            {message}
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-brand-900 hover:bg-brand-700"
            }`}
          >
            {isDanger && <Trash2 size={14} />}
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

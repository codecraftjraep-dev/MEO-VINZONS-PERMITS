export default function PageHeader({ title, description, action, eyebrow }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

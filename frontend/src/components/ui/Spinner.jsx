export default function Spinner({ size = "md" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-slate-200 border-t-brand-600`}
      />
    </div>
  );
}

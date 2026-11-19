import { Building2, ClipboardCheck, FilePlus2, FileText } from "lucide-react";
import { SectionHeader, sectionClass } from "../forms/FormElements";

const permitTypes = [
  {
    value: "building",
    title: "Building Permit",
    description:
      "Encode building permit details, FSEC information, construction details, and project cost.",
    icon: Building2,
  },
  {
    value: "occupancy",
    title: "Certificate of Occupancy",
    description:
      "Encode occupancy certificate details, FSIC information, fees, and the issued Building Permit reference.",
    icon: FileText,
  },
];

export default function PermitTypeSelector({ value, onChange }) {
  return (
    <section className={sectionClass}>
      <SectionHeader
        icon={ClipboardCheck}
        title="Select Permit Type"
        description="Choose which document you want to issue."
      />

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        {permitTypes.map(({ value: type, title, description, icon: Icon }) => {
          const selected = value === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`rounded-xl border p-5 text-left transition ${
                selected
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-brand-100 p-3 text-brand-700">
                  <Icon size={23} />
                </div>
                <input
                  type="radio"
                  name="permitType"
                  value={type}
                  checked={selected}
                  onChange={() => onChange(type)}
                  className="h-4 w-4 accent-brand-600"
                />
              </div>

              <h3 className="mt-4 text-sm font-bold text-brand-900">
                {title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function EmptyPermitSelection() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
      <FilePlus2 className="mx-auto text-slate-300" size={35} />
      <h3 className="mt-3 text-sm font-bold text-slate-700">
        No Permit Type Selected
      </h3>
      <p className="mt-1 text-xs text-slate-400">
        Select Building Permit or Certificate of Occupancy above to display the
        corresponding form.
      </p>
    </div>
  );
}

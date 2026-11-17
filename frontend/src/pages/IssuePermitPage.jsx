import { useState } from "react";
import PermitPreview from "../components/permits/PermitPreview";
import {
  Plus,
  Trash2,
  FilePlus2,
  UserRound,
  FileText,
  Layers,
  Building2,
  Printer,
  ClipboardCheck,
} from "lucide-react";

const initialOwner = {
  ownerType: "individual",
  name: "",
  careOf: [],
};

const initialForm = {
  permitType: "",
  coverage: "full",

  // Building Permit fields
  permitNo: "",
  dateIssued: "",
  fsecNo: "",
  fsecDateIssued: "",
  buildingFeesPaid: "",
  buildingOfficialReceiptNo: "",
  buildingDatePaid: "",

  // Certificate of Occupancy fields
  occupancyNo: "",
  occupancyDateIssued: "",
  fsicNo: "",
  fsicDateIssued: "",
  occupancyFeesPaid: "",
  occupancyOfficialReceiptNo: "",
  occupancyDatePaid: "",
  issuedBuildingPermitNo: "",
  buildingPermitDateIssued: "",

  // Shared project information
  owners: [{ ...initialOwner }],
  projectName: "",
  projectLocation: "",
  dateOfCompletion: "",
  occupancy: "",
  classifications: [{ group: "", division: "" }],

  // Building Permit additional fields
  scopeOfWork: "",
  totalProjectCost: "",
  professionalInCharge: "",
};

const ownerTypes = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
  { value: "corporation", label: "Corporation" },
  { value: "organization", label: "Organization" },
  { value: "group", label: "Group" },
];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

const sectionClass = "rounded-xl border border-slate-200 bg-white shadow-sm";

const sectionHeaderClass =
  "flex items-center gap-3 border-b border-slate-100 px-5 py-4";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700";

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className={sectionHeaderClass}>
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

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  ...props
}) {
  return (
    <input
      type={type}
      className={inputClass}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      {...props}
    />
  );
}

export default function IssuePermitPage() {
  const [form, setForm] = useState(initialForm);

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Owner functions
  const updateOwner = (ownerIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, index) =>
        index === ownerIndex ? { ...owner, [field]: value } : owner,
      ),
    }));
  };

  const addOwner = () => {
    setForm((prev) => ({
      ...prev,
      owners: [...prev.owners, { ...initialOwner, careOf: [] }],
    }));
  };

  const removeOwner = (ownerIndex) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.filter((_, index) => index !== ownerIndex),
    }));
  };

  // Care of functions
  const addCareOf = (ownerIndex) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, index) =>
        index === ownerIndex
          ? { ...owner, careOf: [...owner.careOf, ""] }
          : owner,
      ),
    }));
  };

  const updateCareOf = (ownerIndex, careIndex, value) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, index) =>
        index === ownerIndex
          ? {
              ...owner,
              careOf: owner.careOf.map((name, i) =>
                i === careIndex ? value : name,
              ),
            }
          : owner,
      ),
    }));
  };

  const removeCareOf = (ownerIndex, careIndex) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, index) =>
        index === ownerIndex
          ? {
              ...owner,
              careOf: owner.careOf.filter((_, i) => i !== careIndex),
            }
          : owner,
      ),
    }));
  };

  // Group and Division functions
  const updateClassification = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      classifications: prev.classifications.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addClassification = () => {
    setForm((prev) => ({
      ...prev,
      classifications: [...prev.classifications, { group: "", division: "" }],
    }));
  };

  const removeClassification = (index) => {
    setForm((prev) => ({
      ...prev,
      classifications: prev.classifications.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      owners: [{ ...initialOwner, careOf: [] }],
      classifications: [{ group: "", division: "" }],
    });
  };

  // Preview PDF

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.permitType) {
      alert("Please select a permit type first.");
      return;
    }

    if (
      form.owners.length === 0 ||
      form.owners.some((owner) => !owner.name.trim())
    ) {
      alert("Please provide at least one owner and complete each owner name.");
      return;
    }

    const isOccupancy = form.permitType === "occupancy";

    const cleanedForm = {
      ...form,

      // Normalize permit number and date for preview
      permitNo: isOccupancy ? form.issuedBuildingPermitNo : form.permitNo,

      dateIssued: isOccupancy ? form.buildingPermitDateIssued : form.dateIssued,

      // Preserve the actual occupancy certificate number and date
      occupancyNo: form.occupancyNo,
      occupancyDateIssued: form.occupancyDateIssued,

      // Owners
      owners: form.owners.map((owner) => ({
        ...owner,
        name: owner.name.trim(),
        careOf: owner.careOf.map((name) => name.trim()).filter(Boolean),
      })),

      // Classifications
      classifications: form.classifications
        .map((item) => ({
          group: item.group.trim(),
          division: item.division.trim(),
        }))
        .filter((item) => item.group || item.division),

      // Numeric values
      totalProjectCost:
        form.totalProjectCost === "" ? null : Number(form.totalProjectCost),

      buildingFeesPaid:
        form.buildingFeesPaid === "" ? null : Number(form.buildingFeesPaid),

      occupancyFeesPaid:
        form.occupancyFeesPaid === "" ? null : Number(form.occupancyFeesPaid),
    };

    setPreviewData(cleanedForm);
    setShowPreview(true);
  };

  const isBuildingPermit = form.permitType === "building";
  const isOccupancy = form.permitType === "occupancy";

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <div className="flex items-center gap-2 text-brand-600">
          <FilePlus2 size={19} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Permit Management
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-bold text-brand-900">
          Issue New Permit
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Select a permit type to begin encoding the permit information.
        </p>
      </div>

      {/* Permit Type Selection */}
      <section className={sectionClass}>
        <SectionHeader
          icon={ClipboardCheck}
          title="Select Permit Type"
          description="Choose which document you want to issue."
        />

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => updateField("permitType", "building")}
            className={`rounded-xl border p-5 text-left transition ${
              isBuildingPermit
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-brand-100 p-3 text-brand-700">
                <Building2 size={23} />
              </div>

              <input
                type="radio"
                name="permitType"
                value="building"
                checked={isBuildingPermit}
                onChange={() => updateField("permitType", "building")}
                className="h-4 w-4 accent-brand-600"
              />
            </div>

            <h3 className="mt-4 text-sm font-bold text-brand-900">
              Building Permit
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Encode building permit details, FSEC information, construction
              details, and project cost.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateField("permitType", "occupancy")}
            className={`rounded-xl border p-5 text-left transition ${
              isOccupancy
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-brand-100 p-3 text-brand-700">
                <FileText size={23} />
              </div>

              <input
                type="radio"
                name="permitType"
                value="occupancy"
                checked={isOccupancy}
                onChange={() => updateField("permitType", "occupancy")}
                className="h-4 w-4 accent-brand-600"
              />
            </div>

            <h3 className="mt-4 text-sm font-bold text-brand-900">
              Certificate of Occupancy
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Encode occupancy certificate details, FSIC information, fees, and
              the issued Building Permit reference.
            </p>
          </button>
        </div>
      </section>

      {/* Show form only after selecting a permit type */}
      {!form.permitType ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <FilePlus2 className="mx-auto text-slate-300" size={35} />
          <h3 className="mt-3 text-sm font-bold text-slate-700">
            No Permit Type Selected
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Select Building Permit or Certificate of Occupancy above to display
            the corresponding form.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selected Permit Heading */}
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-brand-900">
                {isBuildingPermit
                  ? "Building Permit Form"
                  : "Certificate of Occupancy Form"}
              </h2>
              <p className="text-xs text-slate-500">
                Complete the required information below.
              </p>
            </div>

            <button
              type="button"
              onClick={() => updateField("permitType", "")}
              className="self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:self-auto"
            >
              Change Permit Type
            </button>
          </div>

          {/* Full or Partial Selection */}
          <section className={sectionClass}>
            <div className={sectionHeaderClass}>
              <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
                <ClipboardCheck size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-brand-900">
                  Type of Issuance
                </h2>
                <p className="text-xs text-slate-400">
                  Select whether this issuance is full or partial.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              {[
                { value: "full", label: "Full" },
                { value: "partial", label: "Partial" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    form.coverage === option.value
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="coverage"
                    value={option.value}
                    checked={form.coverage === option.value}
                    onChange={(e) => updateField("coverage", e.target.value)}
                    className="h-4 w-4 accent-brand-600"
                  />

                  <span className="text-sm font-semibold text-slate-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Building Permit Information */}
          {isBuildingPermit && (
            <section className={sectionClass}>
              <SectionHeader
                icon={FileText}
                title="Building Permit Information"
                description="Permit number, FSEC, and payment details."
              />

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Permit No. *">
                  <TextInput
                    placeholder="YYYY-MM-#"
                    value={form.permitNo}
                    onChange={(e) => updateField("permitNo", e.target.value)}
                    required
                  />
                </Field>

                <Field label="Date Issued *">
                  <TextInput
                    type="date"
                    value={form.dateIssued}
                    onChange={(e) => updateField("dateIssued", e.target.value)}
                    required
                  />
                </Field>

                <Field label="FSEC No.">
                  <TextInput
                    placeholder="Enter FSEC number"
                    value={form.fsecNo}
                    onChange={(e) => updateField("fsecNo", e.target.value)}
                  />
                </Field>

                <Field label="FSEC Date Issued">
                  <TextInput
                    type="date"
                    value={form.fsecDateIssued}
                    onChange={(e) =>
                      updateField("fsecDateIssued", e.target.value)
                    }
                  />
                </Field>

                <Field label="Fees Paid (₱)">
                  <TextInput
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.buildingFeesPaid}
                    onChange={(e) =>
                      updateField("buildingFeesPaid", e.target.value)
                    }
                  />
                </Field>

                <Field label="Official Receipt No.">
                  <TextInput
                    placeholder="8-digit receipt number"
                    inputMode="numeric"
                    maxLength={8}
                    value={form.buildingOfficialReceiptNo}
                    onChange={(e) =>
                      updateField(
                        "buildingOfficialReceiptNo",
                        e.target.value.replace(/\D/g, "").slice(0, 8),
                      )
                    }
                  />
                </Field>

                <Field label="Date Paid">
                  <TextInput
                    type="date"
                    value={form.buildingDatePaid}
                    onChange={(e) =>
                      updateField("buildingDatePaid", e.target.value)
                    }
                  />
                </Field>
              </div>
            </section>
          )}

          {/* Certificate of Occupancy Information */}
          {isOccupancy && (
            <section className={sectionClass}>
              <SectionHeader
                icon={FileText}
                title="Certificate of Occupancy Information"
                description="Certificate number, FSIC, fees, and Building Permit reference."
              />

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="No. *">
                  <TextInput
                    placeholder="YYYY-MM-#"
                    value={form.occupancyNo}
                    onChange={(e) => updateField("occupancyNo", e.target.value)}
                    required
                  />
                </Field>

                <Field label="Date Issued *">
                  <TextInput
                    type="date"
                    value={form.occupancyDateIssued}
                    onChange={(e) =>
                      updateField("occupancyDateIssued", e.target.value)
                    }
                    required
                  />
                </Field>

                <Field label="FSIC No.">
                  <TextInput
                    placeholder="Enter FSIC number"
                    value={form.fsicNo}
                    onChange={(e) => updateField("fsicNo", e.target.value)}
                  />
                </Field>

                <Field label="FSIC Date Issued">
                  <TextInput
                    type="date"
                    value={form.fsicDateIssued}
                    onChange={(e) =>
                      updateField("fsicDateIssued", e.target.value)
                    }
                  />
                </Field>

                <Field label="Fees Paid (₱)">
                  <TextInput
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.occupancyFeesPaid}
                    onChange={(e) =>
                      updateField("occupancyFeesPaid", e.target.value)
                    }
                  />
                </Field>

                <Field label="Official Receipt No.">
                  <TextInput
                    placeholder="8-digit receipt number"
                    inputMode="numeric"
                    maxLength={8}
                    value={form.occupancyOfficialReceiptNo}
                    onChange={(e) =>
                      updateField(
                        "occupancyOfficialReceiptNo",
                        e.target.value.replace(/\D/g, "").slice(0, 8),
                      )
                    }
                  />
                </Field>

                <Field label="Date Paid">
                  <TextInput
                    type="date"
                    value={form.occupancyDatePaid}
                    onChange={(e) =>
                      updateField("occupancyDatePaid", e.target.value)
                    }
                  />
                </Field>

                <Field label="Issued Building Permit No. *">
                  <TextInput
                    placeholder="Enter Building Permit No."
                    value={form.issuedBuildingPermitNo}
                    onChange={(e) =>
                      updateField("issuedBuildingPermitNo", e.target.value)
                    }
                    required
                  />
                </Field>

                <Field label="Building Permit Date Issued *">
                  <TextInput
                    type="date"
                    value={form.buildingPermitDateIssued}
                    onChange={(e) =>
                      updateField("buildingPermitDateIssued", e.target.value)
                    }
                    required
                  />
                </Field>
              </div>
            </section>
          )}

          {/* Owner Information */}
          <section className={sectionClass}>
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-brand-900">
                    Name of Owner
                  </h2>
                  <p className="text-xs text-slate-400">
                    Add multiple owners and their Care of names.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addOwner}
                className={primaryButtonClass}
              >
                <Plus size={15} />
                Add Another Owner
              </button>
            </div>

            <div className="space-y-4 p-5">
              {form.owners.map((owner, ownerIndex) => (
                <div
                  key={ownerIndex}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-brand-900">
                      Owner {ownerIndex + 1}
                    </h3>

                    {form.owners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOwner(ownerIndex)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Owner Type *">
                      <select
                        className={inputClass}
                        value={owner.ownerType}
                        onChange={(e) =>
                          updateOwner(ownerIndex, "ownerType", e.target.value)
                        }
                      >
                        {ownerTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      label={
                        owner.ownerType === "individual"
                          ? "Full Name *"
                          : "Company / Organization / Group Name *"
                      }
                      className="sm:col-span-2"
                    >
                      <TextInput
                        placeholder={
                          owner.ownerType === "individual"
                            ? "Enter owner's full name"
                            : "Enter registered or organization name"
                        }
                        value={owner.name}
                        onChange={(e) =>
                          updateOwner(ownerIndex, "name", e.target.value)
                        }
                        required
                      />
                    </Field>
                  </div>

                  {/* Care of Names */}
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-brand-900">
                          Care of Names
                        </h4>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Optional. Add one or multiple names.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addCareOf(ownerIndex)}
                        className="inline-flex items-center gap-1 rounded-lg border border-brand-100 bg-white px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                      >
                        <Plus size={14} />
                        Add Care of
                      </button>
                    </div>

                    {owner.careOf.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-xs text-slate-400">
                        No Care of names added.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {owner.careOf.map((name, careIndex) => (
                          <div
                            key={careIndex}
                            className="flex items-center gap-2"
                          >
                            <span className="w-7 shrink-0 text-center text-xs text-slate-400">
                              {careIndex + 1}.
                            </span>

                            <input
                              className={inputClass}
                              placeholder="Enter Care of name"
                              value={name}
                              onChange={(e) =>
                                updateCareOf(
                                  ownerIndex,
                                  careIndex,
                                  e.target.value,
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeCareOf(ownerIndex, careIndex)
                              }
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                              aria-label="Remove Care of name"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Information */}
          <section className={sectionClass}>
            <SectionHeader
              icon={Layers}
              title="Project Information"
              description="Project name, location, and occupancy classification."
            />

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <Field label="Name of Project *" className="sm:col-span-2">
                <TextInput
                  placeholder="Enter project name"
                  value={form.projectName}
                  onChange={(e) => updateField("projectName", e.target.value)}
                  required
                />
              </Field>

              <Field label="Project Location *" className="sm:col-span-2">
                <TextInput
                  placeholder="Enter complete project location"
                  value={form.projectLocation}
                  onChange={(e) =>
                    updateField("projectLocation", e.target.value)
                  }
                  required
                />
              </Field>
              {isOccupancy && (
                <Field label="Date of Completion *">
                  <TextInput
                    type="date"
                    value={form.dateOfCompletion}
                    onChange={(e) =>
                      updateField("dateOfCompletion", e.target.value)
                    }
                    required
                  />
                </Field>
              )}
              <Field
                label="Use or Character of Occupancy *"
                className="sm:col-span-2"
              >
                <TextInput
                  placeholder="Enter occupancy classification"
                  value={form.occupancy}
                  onChange={(e) => updateField("occupancy", e.target.value)}
                  required
                />
              </Field>

              {/* Group and Division */}
              <div className="sm:col-span-2">
                <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-bold text-brand-900">
                      Group and Division
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Each group has its own corresponding division.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addClassification}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
                  >
                    <Plus size={15} />
                    Add Another Group
                  </button>
                </div>

                <div className="space-y-3">
                  {form.classifications.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                    >
                      <Field label={`Group ${index + 1}`}>
                        <TextInput
                          placeholder="Enter group"
                          value={item.group}
                          onChange={(e) =>
                            updateClassification(index, "group", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="Division">
                        <TextInput
                          placeholder="Enter division"
                          value={item.division}
                          onChange={(e) =>
                            updateClassification(
                              index,
                              "division",
                              e.target.value,
                            )
                          }
                        />
                      </Field>

                      {form.classifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeClassification(index)}
                          className="flex h-[42px] items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          <span className="sm:hidden">Remove Group</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Building Permit only */}
              {isBuildingPermit && (
                <>
                  <Field label="Total Project Cost (₱) *">
                    <TextInput
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.totalProjectCost}
                      onChange={(e) =>
                        updateField("totalProjectCost", e.target.value)
                      }
                      required
                    />
                  </Field>

                  <Field
                    label="Professional in Charge of Construction"
                    className="sm:col-span-2"
                  >
                    <TextInput
                      placeholder="Enter professional's full name"
                      value={form.professionalInCharge}
                      onChange={(e) =>
                        updateField("professionalInCharge", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Scope of Work *" className="sm:col-span-2">
                    <textarea
                      rows={4}
                      className={inputClass}
                      placeholder="Describe the scope of construction work..."
                      value={form.scopeOfWork}
                      onChange={(e) =>
                        updateField("scopeOfWork", e.target.value)
                      }
                      required
                    />
                  </Field>
                </>
              )}
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear all entered permit information?")) {
                  resetForm();
                }
              }}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              <Printer size={17} />
              Preview Certificate
            </button>
          </div>
        </form>
      )}
      {showPreview && previewData && (
        <PermitPreview
          data={previewData}
          onClose={() => setShowPreview(false)}
          onConfirmSave={() => {
            console.log("Confirmed Permit Data:", previewData);

            alert(
              "Certificate reviewed. Database saving will be connected next.",
            );

            setShowPreview(false);
          }}
        />
      )}
    </div>
  );
}

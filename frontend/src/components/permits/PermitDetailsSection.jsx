import { FileText } from "lucide-react";
import {
  Field,
  SectionHeader,
  TextInput,
  inputClass,
  sectionClass,
} from "../forms/FormElements";
import { useEffect } from "react";

import permitApi from "../../api/permitApi";
import {
  formatFsecNumber,
  isValidFsecNumber,
  formatFsicNumber,
  isValidFsicNumber,
  formatMoney,
  isValidReceiptNumber,
  formatReceiptNumber,
  formatBuildingPermitNumber,
} from "../../utils/permitFormatters";

function ReceiptNumberField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <TextInput
        placeholder="8-digit receipt number"
        inputMode="numeric"
        maxLength={8}
        value={value}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 8))
        }
      />
    </Field>
  );
}

function BuildingPermitFields({ form, updateField }) {
  useEffect(() => {
    if (form.permitNo) return;

    const generatePermitNumber = async () => {
      try {
        const response = await permitApi.getNextNumber();

        if (response.permitNo) {
          updateField("permitNo", response.permitNo);
        }
      } catch (error) {
        console.error("Failed to generate permit number:", error);
      }
    };

    generatePermitNumber();
  }, [form.permitNo, updateField]);

  return (
    <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="Permit No. *">
        <TextInput
          placeholder="Generating permit number..."
          value={form.permitNo}
          readOnly
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
      <div className="space-y-2">
        <div className="flex min-h-[18px] items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-600">
            FSEC No.
          </label>

          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={form.fsecNo === "N/A"}
              onChange={(e) => {
                updateField("fsecNo", e.target.checked ? "N/A" : "");
                updateField("fsecDateIssued", "");
              }}
              className="size-3.5 cursor-pointer rounded border-slate-300 accent-brand-600"
            />
            <span>N/A</span>
          </label>
        </div>

        <TextInput
          placeholder="A-1-12345-1234567"
          value={form.fsecNo === "N/A" ? "N/A" : form.fsecNo}
          onChange={(e) =>
            updateField("fsecNo", formatFsecNumber(e.target.value))
          }
          maxLength={17}
          disabled={form.fsecNo === "N/A"}
          required={form.fsecNo !== "N/A"}
          pattern="[A-Z]-[0-9]-[0-9]{5}-[0-9]{7}"
          title="Use the format A-1-12345-1234567"
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
            form.fsecNo === "N/A"
              ? "!cursor-not-allowed !border-slate-300 !bg-slate-100 !text-slate-500 !opacity-100"
              : "border-slate-300 bg-white text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          }`}
        />
        {form.fsecNo &&
          form.fsecNo !== "N/A" &&
          !isValidFsecNumber(form.fsecNo) && (
            <p className="text-xs font-medium text-red-500">
              Invalid format. Use A-1-12345-1234567.
            </p>
          )}
      </div>
      <Field label="FSEC Date Issued">
        <TextInput
          type="date"
          value={form.fsecDateIssued}
          onChange={(e) => updateField("fsecDateIssued", e.target.value)}
          disabled={form.fsecNo === "N/A"}
          required={form.fsecNo !== "N/A"}
        />
      </Field>

      <div className="space-y-2">
        <Field label="Official Receipt No.">
          <TextInput
            type="text"
            placeholder="A-123456789"
            maxLength={11}
            value={form.buildingOfficialReceiptNo || ""}
            onChange={(e) =>
              updateField(
                "buildingOfficialReceiptNo",
                formatReceiptNumber(e.target.value),
              )
            }
            pattern="[A-Z]-[0-9]{9}"
            title="Use the format A-123456789"
          />
        </Field>

        {form.buildingOfficialReceiptNo &&
          !isValidReceiptNumber(form.buildingOfficialReceiptNo) && (
            <p className="text-xs font-medium text-red-500">
              Invalid format. Use A-123456789.
            </p>
          )}
      </div>

      <Field label="Date Paid">
        <TextInput
          type="date"
          value={form.buildingDatePaid}
          onChange={(e) => updateField("buildingDatePaid", e.target.value)}
        />
      </Field>

      {form.fsecNo === "N/A" && (
        <p className="text-xs font-medium text-amber-600 lg:col-span-3">
          FSEC Number and Date Issued are marked as Not Applicable.
        </p>
      )}
    </div>
  );
}

function OccupancyPermitFields({ form, updateField }) {
  useEffect(() => {
    if (form.occupancyNo) return;

    const generateOccupancyNumber = async () => {
      try {
        const response = await permitApi.getNextOccupancyNumber();

        if (response.occupancyNo) {
          updateField("occupancyNo", response.occupancyNo);
        }
      } catch (error) {
        console.error("Failed to generate occupancy permit number:", error);
      }
    };

    generateOccupancyNumber();
  }, [form.occupancyNo, updateField]);

  return (
    <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="Occupancy Permit No. *">
        <TextInput
          placeholder="Generating permit number..."
          value={form.occupancyNo}
          readOnly
          required
        />
      </Field>

      <Field label="Date Issued *">
        <TextInput
          type="date"
          value={form.occupancyDateIssued}
          onChange={(e) => updateField("occupancyDateIssued", e.target.value)}
          required
        />
      </Field>

      <div className="space-y-2">
        <div className="flex min-h-[18px] items-center justify-between">
          <label className="text-xs font-semibold text-slate-600">
            FSIC No.
          </label>

          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={form.fsicNo === "N/A"}
              onChange={(e) => {
                updateField("fsicNo", e.target.checked ? "N/A" : "");
                updateField("fsicDateIssued", "");
              }}
              className="size-3.5 cursor-pointer rounded border-slate-300 accent-brand-600"
            />
            <span>N/A</span>
          </label>
        </div>

        <TextInput
          placeholder="A-1-12345-1234567"
          value={form.fsicNo || ""}
          onChange={(e) =>
            updateField("fsicNo", formatFsicNumber(e.target.value))
          }
          maxLength={17}
          disabled={form.fsicNo === "N/A"}
          required={form.fsicNo !== "N/A"}
          pattern="[A-Z]-[0-9]-[0-9]{5}-[0-9]{7}"
          title="Use the format A-1-12345-1234567"
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
            form.fsicNo === "N/A"
              ? "!cursor-not-allowed !border-slate-300 !bg-slate-100 !text-slate-500 !opacity-100"
              : "border-slate-300 bg-white text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          }`}
        />

        {form.fsicNo &&
          form.fsicNo !== "N/A" &&
          !isValidFsicNumber(form.fsicNo) && (
            <p className="text-xs font-medium text-red-500">
              Invalid format. Use A-1-12345-1234567.
            </p>
          )}
      </div>

      <Field label="FSIC Date Issued">
        <TextInput
          type="date"
          value={form.fsicDateIssued || ""}
          onChange={(e) => updateField("fsicDateIssued", e.target.value)}
          disabled={form.fsicNo === "N/A"}
          required={form.fsicNo !== "N/A"}
          className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition-colors ${
            form.fsicNo === "N/A"
              ? "!cursor-not-allowed !border-slate-300 !bg-slate-100 !text-slate-500 !opacity-100"
              : "border-slate-300 bg-white text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          }`}
        />
      </Field>

      <Field label="Fees Paid (₱)">
        <TextInput
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={form.occupancyFeesPaid || ""}
          onChange={(e) =>
            updateField("occupancyFeesPaid", formatMoney(e.target.value))
          }
        />
      </Field>

      <div className="space-y-2">
        <Field label="Official Receipt No.">
          <TextInput
            type="text"
            placeholder="A-123456789"
            maxLength={11}
            value={form.occupancyOfficialReceiptNo || ""}
            onChange={(e) =>
              updateField(
                "occupancyOfficialReceiptNo",
                formatReceiptNumber(e.target.value),
              )
            }
            pattern="[A-Z]-[0-9]{9}"
            title="Use the format A-123456789"
          />
        </Field>

        {form.occupancyOfficialReceiptNo &&
          !isValidReceiptNumber(form.occupancyOfficialReceiptNo) && (
            <p className="text-xs font-medium text-red-500">
              Invalid format. Use A-123456789.
            </p>
          )}
      </div>
      <Field label="Date Paid">
        <TextInput
          type="date"
          value={form.occupancyDatePaid}
          onChange={(e) => updateField("occupancyDatePaid", e.target.value)}
        />
      </Field>

      <Field label="Issued Building Permit No. *">
        <TextInput
          placeholder="YYYY-MM-###"
          value={form.issuedBuildingPermitNo || ""}
          maxLength={11}
          onChange={(e) =>
            updateField(
              "issuedBuildingPermitNo",
              formatBuildingPermitNumber(e.target.value),
            )
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

      {form.fsicNo === "N/A" && (
        <p className="text-xs font-medium text-amber-600 sm:col-span-2 lg:col-span-3">
          FSIC Number and Date Issued are marked as Not Applicable.
        </p>
      )}
    </div>
  );
}

export default function PermitDetailsSection({
  permitType,
  form,
  updateField,
}) {
  const isBuilding = permitType === "building";

  return (
    <section className={sectionClass}>
      <SectionHeader
        icon={FileText}
        title={
          isBuilding
            ? "Building Permit Information"
            : "Certificate of Occupancy Information"
        }
        description={
          isBuilding
            ? "Permit number, FSEC, and payment details."
            : "Certificate number, FSIC, fees, and Building Permit reference."
        }
      />

      {isBuilding ? (
        <BuildingPermitFields form={form} updateField={updateField} />
      ) : (
        <OccupancyPermitFields form={form} updateField={updateField} />
      )}
    </section>
  );
}

export function CoverageSection({ value, onChange }) {
  const options = [
    { value: "full", label: "Full" },
    { value: "partial", label: "Partial" },
  ];

  return (
    <section className={sectionClass}>
      <SectionHeader
        icon={FileText}
        title="Type of Issuance"
        description="Select whether this issuance is full or partial."
      />

      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
              value === option.value
                ? "border-brand-500 bg-brand-50"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="coverage"
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange(event.target.value)}
              className="h-4 w-4 accent-brand-600"
            />
            <span className="text-sm font-semibold text-slate-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

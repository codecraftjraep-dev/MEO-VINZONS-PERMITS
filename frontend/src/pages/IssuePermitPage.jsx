import { useState } from "react";
import { Building2, FilePlus2, Printer } from "lucide-react";

import PermitPreview from "../components/permits/PermitPreview";
import PermitTypeSelector, {
  EmptyPermitSelection,
} from "../components/permits/PermitTypeSelector";
import PermitDetailsSection, {
  CoverageSection,
} from "../components/permits/PermitDetailsSection";
import OwnerSection from "../components/permits/OwnerSection";
import ProjectInformationSection from "../components/permits/ProjectInformationSection";
import permitApi from "../api/permitApi";
import { usePermitForm } from "../hooks/usePermitForm";
import { isValidFsecNumber } from "../utils/permitFormatters";
export default function IssuePermitPage() {
  const {
    form,
    updateField,
    updateOwner,
    addOwner,
    removeOwner,
    addCareOf,
    updateCareOf,
    removeCareOf,
    addClassification,
    updateClassification,
    removeClassification,
    resetForm,
  } = usePermitForm();

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isBuildingPermit = form.permitType === "building";
  const isOccupancy = form.permitType === "occupancy";

  const ownerHandlers = {
    addOwner,
    removeOwner,
    updateOwner,
    addCareOf,
    updateCareOf,
    removeCareOf,
  };

  const classificationHandlers = {
    addClassification,
    updateClassification,
    removeClassification,
  };

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

    const cleanedForm = {
      ...form,
      permitNo: isOccupancy ? form.issuedBuildingPermitNo : form.permitNo,
      dateIssued: isOccupancy ? form.buildingPermitDateIssued : form.dateIssued,
      occupancyNo: form.occupancyNo,
      occupancyDateIssued: form.occupancyDateIssued,
      owners: form.owners.map((owner) => ({
        ...owner,
        name: owner.name.trim(),
        careOf: owner.careOf.map((name) => name.trim()).filter(Boolean),
      })),
      classifications: form.classifications
        .map((item) => ({
          group: item.group.trim(),
          division: item.division.trim(),
        }))
        .filter((item) => item.group || item.division),
      totalProjectCost:
        form.totalProjectCost === ""
          ? null
          : Number(String(form.totalProjectCost).replace(/,/g, "")),
      occupancyFeesPaid:
        form.occupancyFeesPaid === ""
          ? null
          : Number(String(form.occupancyFeesPaid).replace(/,/g, "")),
    };

    setPreviewData(cleanedForm);
    setShowPreview(true);
  };

  const handleConfirmSave = async () => {
    if (!previewData || isSaving) return;

    setIsSaving(true);

    try {
      const result = await permitApi.create(previewData);
      alert(result.message || "Permit successfully saved.");
      setShowPreview(false);
      setPreviewData(null);
      resetForm();
    } catch (error) {
      console.error("Permit saving error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to save permit. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearForm = () => {
    if (window.confirm("Clear all entered permit information?")) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <header>
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
      </header>

      <PermitTypeSelector
        value={form.permitType}
        onChange={(value) => updateField("permitType", value)}
      />

      {!form.permitType ? (
        <EmptyPermitSelection />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <CoverageSection
            value={form.coverage}
            onChange={(value) => updateField("coverage", value)}
          />

          <PermitDetailsSection
            permitType={form.permitType}
            form={form}
            updateField={updateField}
          />

          <OwnerSection owners={form.owners} handlers={ownerHandlers} />

          <ProjectInformationSection
            form={form}
            updateField={updateField}
            classificationHandlers={classificationHandlers}
            isOccupancy={isOccupancy}
            isBuildingPermit={isBuildingPermit}
          />

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleClearForm}
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
          onConfirmSave={handleConfirmSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

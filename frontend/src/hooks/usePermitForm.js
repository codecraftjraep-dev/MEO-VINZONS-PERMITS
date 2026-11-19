import { useState } from "react";

const initialOwner = {
  ownerType: "individual",
  name: "",
  careOf: [],
};

export const initialForm = {
  permitType: "",
  coverage: "full",
  permitNo: "",
  dateIssued: "",
  fsecNo: "",
  fsecDateIssued: "",
  buildingFeesPaid: "",
  buildingOfficialReceiptNo: "",
  buildingDatePaid: "",
  occupancyNo: "",
  occupancyDateIssued: "",
  fsicNo: "",
  fsicDateIssued: "",
  occupancyFeesPaid: "",
  occupancyOfficialReceiptNo: "",
  occupancyDatePaid: "",
  issuedBuildingPermitNo: "",
  buildingPermitDateIssued: "",
  owners: [{ ...initialOwner }],
  projectName: "",
  projectLocation: "",
  dateOfCompletion: "",
  occupancy: "",
  classifications: [{ group: "", division: "" }],
  scopeOfWork: "",
  totalProjectCost: "",
  professionalInCharge: "",
};

export function usePermitForm() {
  const [form, setForm] = useState(initialForm);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateListItem = (listName, index, field, value) => {
    setForm((current) => ({
      ...current,
      [listName]: current[listName].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addOwner = () => {
    setForm((current) => ({
      ...current,
      owners: [...current.owners, { ...initialOwner, careOf: [] }],
    }));
  };

  const removeOwner = (ownerIndex) => {
    setForm((current) => ({
      ...current,
      owners: current.owners.filter((_, index) => index !== ownerIndex),
    }));
  };

  const updateOwner = (ownerIndex, field, value) => {
    updateListItem("owners", ownerIndex, field, value);
  };

  const addCareOf = (ownerIndex) => {
    setForm((current) => ({
      ...current,
      owners: current.owners.map((owner, index) =>
        index === ownerIndex
          ? { ...owner, careOf: [...owner.careOf, ""] }
          : owner
      ),
    }));
  };

  const updateCareOf = (ownerIndex, careIndex, value) => {
    setForm((current) => ({
      ...current,
      owners: current.owners.map((owner, index) =>
        index === ownerIndex
          ? {
              ...owner,
              careOf: owner.careOf.map((name, itemIndex) =>
                itemIndex === careIndex ? value : name
              ),
            }
          : owner
      ),
    }));
  };

  const removeCareOf = (ownerIndex, careIndex) => {
    setForm((current) => ({
      ...current,
      owners: current.owners.map((owner, index) =>
        index === ownerIndex
          ? {
              ...owner,
              careOf: owner.careOf.filter(
                (_, itemIndex) => itemIndex !== careIndex
              ),
            }
          : owner
      ),
    }));
  };

  const addClassification = () => {
    setForm((current) => ({
      ...current,
      classifications: [
        ...current.classifications,
        { group: "", division: "" },
      ],
    }));
  };

  const updateClassification = (index, field, value) => {
    updateListItem("classifications", index, field, value);
  };

  const removeClassification = (index) => {
    setForm((current) => ({
      ...current,
      classifications: current.classifications.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      owners: [{ ...initialOwner, careOf: [] }],
      classifications: [{ group: "", division: "" }],
    });
  };

  return {
    form,
    setForm,
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
  };
}

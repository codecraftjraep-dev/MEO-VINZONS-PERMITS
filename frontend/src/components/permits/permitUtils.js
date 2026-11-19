
export const getPermitNumber = (permit) =>
  permit.permitNo ||
  permit.data?.permitNo ||
  permit.data?.occupancyNo ||
  "N/A";

export const getPermitDate = (permit) =>
  permit.permitType === "occupancy"
    ? permit.data?.occupancyDateIssued || permit.dateIssued || ""
    : permit.data?.dateIssued || permit.dateIssued || "";

export const getOwners = (permit) =>
  permit.owners || permit.data?.owners || [];

export const getOwnerName = (owner) => {
  if (typeof owner === "string") return owner;
  if (!owner) return "N/A";

  if (owner.name) return owner.name;
  if (owner.fullName) return owner.fullName;

  const name = [
    owner.fName,
    owner.mName,
    owner.lName,
    owner.extName,
  ]
    .filter(Boolean)
    .join(" ");

  return name || owner.organizationName || "N/A";
};

export const getApplicant = (permit) => {
  const owners = getOwners(permit);

  return owners.length
    ? owners.map(getOwnerName).join(", ")
    : permit.data?.issuedUponRequestOf || "N/A";
};

export const getProjectName = (permit) =>
  permit.projectName || permit.data?.projectName || "N/A";

export const getProjectLocation = (permit) =>
  permit.projectLocation ||
  permit.data?.projectLocation ||
  permit.data?.locationSite ||
  "N/A";

export const getPermitType = (type) =>
  type === "building" ? "Building Permit" : "Certificate of Occupancy";

export const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

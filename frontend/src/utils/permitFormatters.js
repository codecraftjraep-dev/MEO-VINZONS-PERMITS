
export function formatFsecNumber(value) {
  const upperValue = value.toUpperCase();

  if (upperValue === "N/A" || upperValue === "NA") return "N/A";

  const cleaned = upperValue.replace(/[^A-Z0-9]/g, "");

  if (!cleaned) return "";

  const letter = cleaned.slice(0, 1).replace(/[^A-Z]/g, "");
  const digits = cleaned.slice(1).replace(/\D/g, "").slice(0, 13);

  if (!letter) return "";

  const parts = [
    digits.slice(0, 1),
    digits.slice(1, 6),
    digits.slice(6, 13),
  ];

  let result = letter;

  if (parts[0]) result += `-${parts[0]}`;
  if (parts[1]) result += `-${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;

  return result;
}

export function isValidFsecNumber(value) {
  return value === "N/A" || /^[A-Z]-\d-\d{5}-\d{7}$/.test(value);
}

export function formatFsicNumber(value) {
  const upperValue = value.toUpperCase();

  if (upperValue === "N/A" || upperValue === "NA") return "N/A";

  const cleaned = upperValue.replace(/[^A-Z0-9]/g, "");

  if (!cleaned) return "";

  const letter = cleaned.slice(0, 1).replace(/[^A-Z]/g, "");
  const digits = cleaned.slice(1).replace(/\D/g, "").slice(0, 13);

  if (!letter) return "";

  const parts = [
    digits.slice(0, 1),
    digits.slice(1, 6),
    digits.slice(6, 13),
  ];

  let result = letter;

  if (parts[0]) result += `-${parts[0]}`;
  if (parts[1]) result += `-${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;

  return result;
}

export function isValidFsicNumber(value) {
  return value === "N/A" || /^[A-Z]-\d-\d{5}-\d{7}$/.test(value);
}


export function formatReceiptNumber(value) {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  const letter = cleaned.slice(0, 1).replace(/[^A-Z]/g, "");
  const digits = cleaned.slice(1).replace(/\D/g, "").slice(0, 9);

  if (!letter) return "";

  return digits ? `${letter}-${digits}` : letter;
}

export function isValidReceiptNumber(value) {
  return /^[A-Z]-\d{9}$/.test(value);
}

export function formatMoney(value) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  const integer = parts[0] || "";
  const decimal = parts.slice(1).join("").slice(0, 2);

  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.length > 1
    ? `${formattedInteger}.${decimal}`
    : formattedInteger;
}

export function formatBuildingPermitNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 9);

  const year = digits.slice(0, 4);
  const month = digits.slice(4, 6);
  const sequence = digits.slice(6, 9);

  let result = year;

  if (month) result += `-${month}`;
  if (sequence) result += `-${sequence}`;

  return result;
}

export function isValidBuildingPermitNumber(value) {
  return /^\d{4}-(0[1-9]|1[0-2])-\d{3}$/.test(value);
}
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  FileText,
  Building2,
  X,
  MapPin,
  CalendarDays,
  UserRound,
  Hash,
} from "lucide-react";

import permitApi from "../api/permitApi";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";

const getPermitNumber = (permit) =>
  permit.permitNo || permit.data?.permitNo || permit.data?.occupancyNo || "N/A";

const getPermitDate = (permit) =>
  permit.dateIssued ||
  permit.data?.dateIssued ||
  permit.data?.occupancyDateIssued ||
  "";

const getOwners = (permit) => permit.owners || permit.data?.owners || [];

const getOwnerName = (owner) => {
  if (typeof owner === "string") return owner;

  if (owner.name) return owner.name;
  if (owner.fullName) return owner.fullName;

  const name = [owner.fName, owner.mName, owner.lName, owner.extName]
    .filter(Boolean)
    .join(" ");

  return name || owner.organizationName || "N/A";
};

const getApplicant = (permit) => {
  const owners = getOwners(permit);

  return owners.length
    ? owners.map(getOwnerName).join(", ")
    : permit.data?.issuedUponRequestOf || "N/A";
};

const getProjectName = (permit) =>
  permit.projectName || permit.data?.projectName || "N/A";

const getProjectLocation = (permit) =>
  permit.projectLocation || permit.data?.projectLocation || "N/A";

const getPermitType = (type) =>
  type === "building" ? "Building Permit" : "Certificate of Occupancy";

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

function PermitTypeBadge({ type }) {
  const isBuilding = type === "building";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        isBuilding
          ? "bg-blue-50 text-blue-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {isBuilding ? <Building2 size={12} /> : <FileText size={12} />}
      {getPermitType(type)}
    </span>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
      <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {Icon && <Icon size={13} />}
        {label}
      </div>
      <p className="break-words text-sm font-medium text-slate-800">
        {value || "N/A"}
      </p>
    </div>
  );
}

function PermitDetailsModal({ permit, onClose }) {
  if (!permit) return null;

  const data = permit.data || {};
  const owners = getOwners(permit);
  const isBuilding = permit.permitType === "building";

  const details = [
    {
      label: "Permit Number",
      value: getPermitNumber(permit),
      icon: Hash,
    },
    {
      label: "Date Issued",
      value: formatDate(getPermitDate(permit)),
      icon: CalendarDays,
    },
    {
      label: "Project Name",
      value: getProjectName(permit),
      icon: Building2,
    },
    {
      label: "Project Location",
      value: getProjectLocation(permit),
      icon: MapPin,
    },
    {
      label: "Applicant / Owner",
      value: getApplicant(permit),
      icon: UserRound,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <div>
            <div className="mb-2">
              <PermitTypeBadge type={permit.permitType} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Permit Details</h2>
            <p className="mt-1 text-xs text-slate-400">
              Complete information from the permit archive
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              General Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {details.map((item) => (
                <DetailItem
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>

          {owners.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Owner Information
              </h3>

              <div className="space-y-2">
                {owners.map((owner, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-100 p-3"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {getOwnerName(owner)}
                    </p>

                    {owner.careOf && (
                      <p className="mt-1 text-xs text-slate-500">
                        C/O: {owner.careOf}
                      </p>
                    )}

                    {owner.organizationType && (
                      <p className="mt-1 text-xs text-slate-500">
                        {owner.organizationType}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Additional Permit Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {isBuilding ? (
                <>
                  <DetailItem label="FSEC Number" value={data.fsecNo} />
                  <DetailItem
                    label="FSEC Date Issued"
                    value={formatDate(data.fsecDateIssued)}
                  />
                  <DetailItem
                    label="Official Receipt Number"
                    value={data.buildingOfficialReceiptNo}
                  />
                  <DetailItem
                    label="Date Paid"
                    value={formatDate(data.buildingDatePaid)}
                  />
                </>
              ) : (
                <>
                  <DetailItem
                    label="Issued Building Permit No."
                    value={data.issuedBuildingPermitNo || data.permitNo}
                  />
                  <DetailItem
                    label="Building Permit Date"
                    value={formatDate(data.buildingPermitDateIssued)}
                  />
                  <DetailItem label="FSIC Number" value={data.fsicNo} />
                  <DetailItem
                    label="FSIC Date Issued"
                    value={formatDate(data.fsicDateIssued)}
                  />
                  <DetailItem
                    label="Date of Completion"
                    value={formatDate(data.dateOfCompletion)}
                  />
                  <DetailItem
                    label="Official Receipt Number"
                    value={data.occupancyOfficialReceiptNo}
                  />
                </>
              )}
            </div>
          </div>

          {data.remarks && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Remarks
              </h3>
              <p className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                {data.remarks}
              </p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400">
            Record created:{" "}
            {permit.createdAt ? formatDate(permit.createdAt) : "N/A"}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PermitsPage() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedPermit, setSelectedPermit] = useState(null);

  const fetchPermits = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await permitApi.getAll();

      const records = Array.isArray(result)
        ? result
        : result.permits || result.data || [];

      setPermits(records);
    } catch (err) {
      console.error("Error retrieving permits:", err);
      setError(err.response?.data?.message || "Failed to retrieve permits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const buildingCount = permits.filter(
    (permit) => permit.permitType === "building",
  ).length;

  const occupancyCount = permits.filter(
    (permit) => permit.permitType === "occupancy",
  ).length;

  const filteredPermits = useMemo(() => {
    return permits.filter((permit) => {
      const searchableValues = [
        getPermitNumber(permit),
        getPermitType(permit.permitType),
        getProjectName(permit),
        getProjectLocation(permit),
        getApplicant(permit),
      ];

      const matchesSearch = searchableValues
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        filterType === "all" || permit.permitType === filterType;

      return matchesSearch && matchesType;
    });
  }, [permits, search, filterType]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MEO PERMIT MANAGEMENT"
        title="Permits Archive"
        description="View and manage issued building permits and certificates of occupancy."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchPermits}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <Link
              to="/permits/new"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              <Plus size={17} />
              New Permit
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Permits"
          value={loading ? "..." : permits.length.toLocaleString()}
          subtitle="All archived permit records"
          type="total"
        />

        <StatCard
          title="Building Permits"
          value={loading ? "..." : buildingCount.toLocaleString()}
          subtitle="Building permit records"
          type="issued"
        />

        <StatCard
          title="Certificates of Occupancy"
          value={loading ? "..." : occupancyCount.toLocaleString()}
          subtitle="Occupancy certificate records"
          type="expiring"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">All Permit Records</h2>
            <p className="mt-1 text-xs text-slate-400">
              Search, filter, and view archived permit information.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search permit number, owner, project, location..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-600 outline-none focus:border-brand-500"
            >
              <option value="all">All Permit Categories</option>
              <option value="building">Building Permit</option>
              <option value="occupancy">Certificate of Occupancy</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: "all", label: "All Records", count: permits.length },
              {
                value: "building",
                label: "Building Permits",
                count: buildingCount,
              },
              {
                value: "occupancy",
                label: "Certificates of Occupancy",
                count: occupancyCount,
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilterType(item.value)}
                className={`rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
                  filterType === item.value
                    ? "bg-brand-900 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {item.label}
                <span className="ml-2 opacity-70">{item.count}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-16 text-sm text-slate-400">
            <RefreshCw size={17} className="animate-spin" />
            Retrieving permit records...
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <FileText size={35} className="mx-auto mb-3 text-red-300" />
            <p className="text-sm font-semibold text-slate-700">
              Unable to load permits
            </p>
            <p className="mt-1 text-xs text-red-500">{error}</p>
            <button
              type="button"
              onClick={fetchPermits}
              className="mt-4 rounded-lg bg-brand-900 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredPermits.length === 0 ? (
          <div className="p-16 text-center">
            <FileText size={38} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              No permit records found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or permit category filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Permit Number",
                    "Category",
                    "Applicant / Owner",
                    "Project Name",
                    "Project Location",
                    "Date Issued",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPermits.map((permit) => (
                  <tr
                    key={permit._id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="text-xs font-bold text-slate-800">
                        {getPermitNumber(permit)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <PermitTypeBadge type={permit.permitType} />
                    </td>

                    <td className="max-w-[190px] px-5 py-4">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {getApplicant(permit)}
                      </p>
                    </td>

                    <td className="max-w-[200px] px-5 py-4">
                      <p className="truncate text-xs text-slate-700">
                        {getProjectName(permit)}
                      </p>
                    </td>

                    <td className="max-w-[190px] px-5 py-4">
                      <p className="truncate text-xs text-slate-500">
                        {getProjectLocation(permit)}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                      {formatDate(getPermitDate(permit))}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedPermit(permit)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-semibold text-brand-700 transition hover:border-brand-200 hover:bg-brand-50"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            Showing {filteredPermits.length} of {permits.length} permit records
          </p>

          <p className="text-[10px] text-slate-400">
            {buildingCount} Building Permits · {occupancyCount} Certificates of
            Occupancy
          </p>
        </div>
      </section>

      <PermitDetailsModal
        permit={selectedPermit}
        onClose={() => setSelectedPermit(null)}
      />
    </div>
  );
}

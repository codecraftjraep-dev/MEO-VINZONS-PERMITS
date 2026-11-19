import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ArrowUpRight,
  Building2,
  FileText,
  Search,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import permitApi from "../api/permitApi";

const getPermitNumber = (permit) =>
  permit.permitNo || permit.data?.permitNo || permit.data?.occupancyNo || "N/A";

const getPermitDate = (permit) =>
  permit.dateIssued ||
  permit.data?.dateIssued ||
  permit.data?.occupancyDateIssued ||
  "";

const getApplicant = (permit) => {
  const owners = permit.owners || permit.data?.owners || [];

  if (!owners.length) return "N/A";

  return owners
    .map((owner) => {
      if (typeof owner === "string") return owner;
      return owner.name || owner.fullName || "N/A";
    })
    .filter(Boolean)
    .join(", ");
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getPermitTypeLabel = (type) =>
  type === "building" ? "Building Permit" : "Certificate of Occupancy";

export default function DashboardPage() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPermits = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await permitApi.getAll();

      const records = Array.isArray(response)
        ? response
        : response.permits || response.data || [];

      setPermits(records);
    } catch (err) {
      console.error("Failed to retrieve permits:", err);
      setError(
        err.response?.data?.message || "Unable to retrieve permit records.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const buildingPermits = useMemo(
    () => permits.filter((permit) => permit.permitType === "building"),
    [permits],
  );

  const occupancyPermits = useMemo(
    () => permits.filter((permit) => permit.permitType === "occupancy"),
    [permits],
  );

  const issuedThisMonth = useMemo(() => {
    const now = new Date();

    return permits.filter((permit) => {
      const date = getPermitDate(permit);
      if (!date) return false;

      const issuedDate = new Date(date);

      return (
        !Number.isNaN(issuedDate.getTime()) &&
        issuedDate.getMonth() === now.getMonth() &&
        issuedDate.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [permits]);

  const recentPermits = useMemo(
    () =>
      [...permits]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || getPermitDate(a) || 0);
          const dateB = new Date(b.createdAt || getPermitDate(b) || 0);
          return dateB - dateA;
        })
        .slice(0, 5),
    [permits],
  );

  const total = permits.length;

  const buildingPercentage =
    total > 0 ? (buildingPermits.length / total) * 100 : 0;

  const occupancyPercentage =
    total > 0 ? (occupancyPermits.length / total) * 100 : 0;

  const permitTypes = [
    {
      name: "Building Permit",
      count: buildingPermits.length,
      icon: Building2,
      color: "text-brand-600 bg-brand-50",
      percentage: buildingPercentage,
    },
    {
      name: "Certificate of Occupancy",
      count: occupancyPermits.length,
      icon: FileText,
      color: "text-emerald-600 bg-emerald-50",
      percentage: occupancyPercentage,
    },
  ];

  const chartBackground =
    total === 0
      ? "#e2e8f0"
      : `conic-gradient(
          #294f85 0% ${buildingPercentage}%,
          #16a36b ${buildingPercentage}% 100%
        )`;

  return (
    <div>
      <PageHeader
        eyebrow="MEO PERMIT MANAGEMENT"
        title="Dashboard"
        description="Monitor building permit and certificate of occupancy records."
        action={
          <Link
            to="/permits/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus size={17} />
            New Permit
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Permits"
          value={loading ? "..." : total.toLocaleString()}
          subtitle="All archived permit records"
          type="total"
        />

        <StatCard
          title="Building Permits"
          value={loading ? "..." : buildingPermits.length.toLocaleString()}
          subtitle="Recorded building permits"
          type="issued"
        />

        <StatCard
          title="Certificates of Occupancy"
          value={loading ? "..." : occupancyPermits.length.toLocaleString()}
          subtitle="Recorded occupancy certificates"
          type="expiring"
        />

        <StatCard
          title="Issued This Month"
          value={loading ? "..." : issuedThisMonth.toLocaleString()}
          subtitle="Based on recorded issue dates"
          type="revoked"
        />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white xl:col-span-2">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Permit Records
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Latest saved permit records
              </p>
            </div>

            <Link
              to="/permits"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
            >
              View all records
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-400">
              <RefreshCw size={16} className="animate-spin" />
              Loading permit records...
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={fetchPermits}
                className="mt-3 text-xs font-semibold text-brand-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : recentPermits.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={34} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">
                No permit records found
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Saved permits will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "Permit Information",
                      "Applicant",
                      "Project Location",
                      "Date Issued",
                      "Category",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentPermits.map((permit) => (
                    <tr
                      key={permit._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap text-xs font-semibold text-slate-800">
                          {getPermitNumber(permit)}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {getPermitTypeLabel(permit.permitType)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[180px] truncate text-xs font-medium text-slate-700">
                          {getApplicant(permit)}
                        </p>
                        <p className="mt-1 max-w-[180px] truncate text-[11px] text-slate-400">
                          {permit.projectName || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {permit.projectLocation || "N/A"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        {formatDate(getPermitDate(permit))}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            permit.permitType === "building"
                              ? "active"
                              : "issued"
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Showing {loading ? 0 : recentPermits.length} recent records
            </p>

            <Link
              to="/permits"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Open archive
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Permits by Category
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Distribution of archived records
            </p>
          </div>

          <div className="my-7 flex items-center justify-center">
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{ background: chartBackground }}
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : total.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">
                  Total Records
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {permitTypes.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-md p-1.5 ${item.color}`}>
                        <Icon size={14} />
                      </div>

                      <span className="text-xs text-slate-600">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-800">
                      {loading ? "..." : item.count.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-700 transition-all"
                      style={{
                        width: `${loading ? 0 : item.percentage}%`,
                        backgroundColor:
                          item.name === "Building Permit"
                            ? "#294f85"
                            : "#16a36b",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          to="/permits"
          className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-50 p-3 text-brand-700">
              <Search size={21} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Search Permit Archive
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Find permits by number, applicant, owner, or location.
              </p>
            </div>
          </div>

          <ArrowUpRight
            size={18}
            className="text-slate-400 transition group-hover:text-brand-600"
          />
        </Link>

        <Link
          to="/permits/new"
          className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <CalendarDays size={21} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Encode New Permit
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Add and archive a newly issued permit.
              </p>
            </div>
          </div>

          <ArrowUpRight
            size={18}
            className="text-slate-400 transition group-hover:text-brand-600"
          />
        </Link>
      </div>
    </div>
  );
}

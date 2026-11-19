import {
  CalendarDays,
  Eye,
  FileText,
  MapPin,
  RefreshCw,
  UserRound,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import PermitTypeBadge from "./PermitTypeBadge";

import {
  getPermitNumber,
  getPermitDate,
  getApplicant,
  getProjectName,
  getProjectLocation,
  formatDate,
} from "./permitUtils";

function getComplianceDetails(permit) {
  const data = permit.data || {};

  if (permit.permitType === "occupancy") {
    return [
      {
        label: "Building Permit",
        value: data.issuedBuildingPermitNo || data.permitNo,
      },
      {
        label: "FSIC No.",
        value: data.fsicNo,
      },
      {
        label: "Official Receipt",
        value: data.occupancyOfficialReceiptNo,
      },
    ];
  }

  return [
    {
      label: "FSEC No.",
      value: data.fsecNo,
    },
    {
      label: "Official Receipt",
      value: data.buildingOfficialReceiptNo,
    },
  ];
}

function Detail({ label, value, mono = false }) {
  if (!value) return null;

  return (
    <div className="min-w-0">
      <span className="text-[10px] text-slate-400">{label}</span>
      <p
        className={`truncate text-xs font-medium text-slate-600 ${
          mono ? "font-mono tabular-nums" : ""
        }`}
        title={String(value)}
      >
        {value}
      </p>
    </div>
  );
}

export default function PermitTable({
  permits,
  loading,
  error,
  onRetry,
  onView,
  onDelete,
  total,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-400">
        <RefreshCw size={17} className="animate-spin" />
        Loading permit records...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <FileText size={36} className="mx-auto mb-3 text-red-300" />
        <p className="text-sm font-semibold text-slate-700">
          Unable to load permits
        </p>
        <p className="mt-1 text-xs text-red-500">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-brand-900 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!permits.length) {
    return (
      <div className="py-16 text-center">
        <FileText size={38} className="mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">
          No permit records found
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Try changing your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-collapse text-left">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50">
            <th className="w-[23%] px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Permit Number
            </th>
            <th className="w-[27%] px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Applicant / Owner
            </th>
            <th className="w-[40%] px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Project & Location
            </th>
            <th className="w-[10%] px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {permits.map((permit) => {
            const complianceDetails = getComplianceDetails(permit);

            return (
              <tr
                key={permit._id}
                className="transition-colors hover:bg-slate-50/70"
              >
                {/* PERMIT NUMBER */}
                <td className="px-6 py-5 align-middle">
                  <div className="space-y-2">
                    <PermitTypeBadge type={permit.permitType} />

                    <p className="font-mono text-sm font-bold tracking-tight text-slate-900">
                      {getPermitNumber(permit)}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <CalendarDays size={12} />
                      <span>Issued</span>
                      <span className="font-mono tabular-nums text-slate-600">
                        {formatDate(getPermitDate(permit))}
                      </span>
                    </div>
                  </div>
                </td>

                {/* APPLICANT / OWNER */}
                <td className="px-5 py-5 align-middle">
                  <div className="flex items-start gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <UserRound size={15} />
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <p
                        className="break-words text-xs font-semibold leading-relaxed text-slate-800"
                        title={getApplicant(permit)}
                      >
                        {getApplicant(permit) || "—"}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Applicant / Owner
                      </p>

                      <div className="border-t border-slate-100 pt-1.5">
                        <p
                          className="break-words text-[11px] leading-relaxed text-slate-600"
                          title={getProjectName(permit)}
                        >
                          {getProjectName(permit) || "No project name"}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>

                {/* PROJECT & LOCATION */}
                <td className="px-5 py-5 align-middle">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />
                      <p
                        className="text-xs leading-relaxed text-slate-700"
                        title={getProjectLocation(permit)}
                      >
                        {getProjectLocation(permit) || "No location specified"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-2">
                      {complianceDetails.map((detail) => (
                        <Detail
                          key={detail.label}
                          label={detail.label}
                          value={detail.value}
                          mono
                        />
                      ))}

                      <Detail
                        label="Record Date"
                        value={
                          permit.createdAt ? formatDate(permit.createdAt) : null
                        }
                        mono
                      />
                    </div>
                  </div>
                </td>

                {/* ACTION */}
                <td className="px-5 py-5 text-right align-middle">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(permit)}
                      title="View permit record"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Eye size={14} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(permit)}
                      title="Delete permit record"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3">
        <p className="text-[11px] text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-600">{permits.length}</span>{" "}
          of <span className="font-semibold text-slate-600">{total}</span>{" "}
          records
        </p>

        <p className="text-[10px] text-slate-400">Sorted by most recent</p>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import {
  Plus,
  ArrowUpRight,
  FileText,
  Building2,
  Zap,
  Droplets,
  Wrench,
  Construction,
  Fence,
  Search,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";

const recentPermits = [
  {
    id: "MEO-BP-2026-00124",
    type: "Building Permit",
    applicant: "Juan Dela Cruz",
    project: "Two-Storey Residential Building",
    barangay: "Aguit-it",
    date: "Nov 15, 2026",
    status: "active",
  },
  {
    id: "MEO-EP-2026-00085",
    type: "Electrical Permit",
    applicant: "Maria Santos",
    project: "Electrical Installation",
    barangay: "Calangcawan",
    date: "Nov 14, 2026",
    status: "active",
  },
  {
    id: "MEO-PP-2026-00062",
    type: "Plumbing Permit",
    applicant: "Pedro Reyes",
    project: "Water Supply Installation",
    barangay: "Vinzons",
    date: "Nov 12, 2026",
    status: "expired",
  },
  {
    id: "MEO-MP-2026-00031",
    type: "Mechanical Permit",
    applicant: "ABC Construction",
    project: "Mechanical Equipment Installation",
    barangay: "Singi",
    date: "Nov 10, 2026",
    status: "active",
  },
  {
    id: "MEO-OP-2026-00018",
    type: "Occupancy Permit",
    applicant: "Carlos Mendoza",
    project: "Commercial Building",
    barangay: "Mangcayo",
    date: "Nov 08, 2026",
    status: "active",
  },
];

const permitTypes = [
  { name: "Building", count: 425, icon: Building2 },
  { name: "Electrical", count: 218, icon: Zap },
  { name: "Plumbing", count: 184, icon: Droplets },
  { name: "Mechanical", count: 96, icon: Wrench },
  { name: "Excavation", count: 87, icon: Construction },
  { name: "Fencing", count: 73, icon: Fence },
  { name: "Demolition", count: 42, icon: FileText },
  { name: "Occupancy", count: 123, icon: Building2 },
];

export default function DashboardPage() {
  const total = permitTypes.reduce((sum, item) => sum + item.count, 0);

  return (
    <div>
      <PageHeader
        eyebrow="MEO PERMIT MANAGEMENT"
        title="Dashboard"
        description="Monitor permit records, issuance activity, and expiration status."
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
          value="1,248"
          subtitle="All archived permit records"
          type="total"
        />

        <StatCard
          title="Issued This Month"
          value="86"
          subtitle="Newly issued permits"
          type="issued"
        />

        <StatCard
          title="Expiring in 30 Days"
          value="12"
          subtitle="Requires attention"
          type="expiring"
        />

        <StatCard
          title="Revoked Permits"
          value="04"
          subtitle="Records marked as revoked"
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
                Latest recorded permit issuances
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

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Permit Information",
                    "Applicant",
                    "Barangay",
                    "Date Issued",
                    "Status",
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
                    key={permit.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-xs font-semibold text-slate-800">
                        {permit.id}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {permit.type}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-xs font-medium text-slate-700">
                        {permit.applicant}
                      </p>
                      <p className="mt-1 max-w-[180px] truncate text-[11px] text-slate-400">
                        {permit.project}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500">
                      {permit.barangay}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                      {permit.date}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={permit.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">Showing 5 recent records</p>
            <Link
              to="/permits"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Open archive
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Permits by Type</h2>
              <p className="mt-1 text-xs text-slate-400">
                Distribution of archived records
              </p>
            </div>

            <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="my-7 flex items-center justify-center">
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  #294f85 0% 34%,
                  #3b82a6 34% 51.5%,
                  #16a36b 51.5% 66.2%,
                  #d69e36 66.2% 73.9%,
                  #8b77bd 73.9% 80.9%,
                  #d97777 80.9% 86.8%,
                  #94a3b8 86.8% 90.2%,
                  #cbd5e1 90.2% 100%
                )`,
              }}
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-bold text-slate-900">
                  {total.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">
                  Total Records
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {permitTypes.map((item, index) => {
              const Icon = item.icon;

              const colors = [
                "text-brand-600 bg-brand-50",
                "text-sky-600 bg-sky-50",
                "text-emerald-600 bg-emerald-50",
                "text-amber-600 bg-amber-50",
                "text-violet-600 bg-violet-50",
                "text-rose-600 bg-rose-50",
                "text-slate-600 bg-slate-100",
                "text-cyan-600 bg-cyan-50",
              ];

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`rounded-md p-1.5 ${colors[index]}`}>
                      <Icon size={14} />
                    </div>

                    <span className="text-xs text-slate-600">{item.name}</span>
                  </div>

                  <span className="text-xs font-semibold text-slate-800">
                    {item.count.toLocaleString()}
                  </span>
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
                Add and archive a newly issued engineering permit.
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

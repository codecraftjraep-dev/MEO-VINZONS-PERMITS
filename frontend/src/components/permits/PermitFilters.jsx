
import { Search } from "lucide-react";

export default function PermitFilters({
  search,
  setSearch,
  filterType,
  setFilterType,
  counts,
}) {
  const filters = [
    {
      value: "all",
      label: "All Records",
      count: counts.total,
    },
    {
      value: "building",
      label: "Building Permits",
      count: counts.building,
    },
    {
      value: "occupancy",
      label: "Certificates of Occupancy",
      count: counts.occupancy,
    },
  ];

  return (
    <div className="space-y-4">
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
            placeholder="Search permit number, owner, project, or location..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
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

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setFilterType(filter.value)}
            className={`rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
              filterType === filter.value
                ? "bg-brand-900 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {filter.label}
            <span className="ml-2 opacity-70">{filter.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

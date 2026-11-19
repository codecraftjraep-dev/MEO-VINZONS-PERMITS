import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";

import permitApi from "../api/permitApi";

import PageHeader from "../components/ui/PageHeader";
import PermitStats from "../components/permits/PermitStats";
import PermitFilters from "../components/permits/PermitFilters";
import PermitTable from "../components/permits/PermitTable";
import PermitDetailsModal from "../components/permits/PermitDetailsModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import {
  getPermitNumber,
  getPermitType,
  getProjectName,
  getProjectLocation,
  getApplicant,
} from "../components/permits/permitUtils";

export default function PermitsPage() {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.selectedPermit) {
      setSelectedPermit(location.state.selectedPermit);
    }
  }, [location.state]);
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [permitToDelete, setPermitToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
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

  const counts = useMemo(
    () => ({
      total: permits.length,
      building: permits.filter((p) => p.permitType === "building").length,
      occupancy: permits.filter((p) => p.permitType === "occupancy").length,
    }),
    [permits],
  );

  const filteredPermits = useMemo(() => {
    const filtered = permits.filter((permit) => {
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
        .includes(search.toLowerCase().trim());

      const matchesType =
        filterType === "all" || permit.permitType === filterType;

      return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "year") {
        const yearA = new Date(a.dateIssued || a.createdAt || 0).getFullYear();
        const yearB = new Date(b.dateIssued || b.createdAt || 0).getFullYear();

        comparison = yearA - yearB;
      } else if (sortBy === "createdAt") {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        comparison = dateA - dateB;
      } else if (sortBy === "name") {
        const nameA = getProjectName(a) || "";
        const nameB = getProjectName(b) || "";

        comparison = nameA.localeCompare(nameB);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [permits, search, filterType, sortBy, sortOrder]);
  const totalPages = Math.ceil(filteredPermits.length / itemsPerPage);

  const paginatedPermits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredPermits.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPermits, currentPage, itemsPerPage]);

  const startRecord =
    filteredPermits.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endRecord = Math.min(
    currentPage * itemsPerPage,
    filteredPermits.length,
  );

  const pageNumbers = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => {
      let startPage = Math.max(1, currentPage - 1);

      if (startPage + 2 > totalPages) {
        startPage = Math.max(1, totalPages - 2);
      }

      return startPage + index;
    },
  );
  const handleDeletePermit = async () => {
    if (!permitToDelete) return;

    try {
      setDeleting(true);

      await permitApi.delete(permitToDelete._id);

      setPermits((prev) =>
        prev.filter((item) => item._id !== permitToDelete._id),
      );

      if (selectedPermit?._id === permitToDelete._id) {
        setSelectedPermit(null);
      }

      setPermitToDelete(null);
    } catch (err) {
      console.error("Error deleting permit:", err);
      alert(err.response?.data?.message || "Failed to delete permit.");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MEO PERMIT MANAGEMENT"
        title="Permits Archive"
        description="Manage and review issued building permits and certificates of occupancy."
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

      <PermitStats permits={permits} loading={loading} />

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="space-y-4 p-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              All Permit Records
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Search and view archived permit information.
            </p>
          </div>

          <PermitFilters
            search={search}
            setSearch={setSearch}
            filterType={filterType}
            setFilterType={setFilterType}
            counts={counts}
          />
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredPermits.length}
              </span>{" "}
              permit records
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-medium text-slate-500">
                Sort by:
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="year">Year</option>
                <option value="createdAt">Date Created</option>
                <option value="name">Project Name</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="desc">Newest / Z–A</option>
                <option value="asc">Oldest / A–Z</option>
              </select>
            </div>
          </div>
        </div>

        <PermitTable
          permits={paginatedPermits}
          total={filteredPermits.length}
          loading={loading}
          error={error}
          onRetry={fetchPermits}
          onView={setSelectedPermit}
          onDelete={setPermitToDelete}
        />
      </section>
      {!loading && !error && filteredPermits.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startRecord}-{endRecord}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredPermits.length}
              </span>{" "}
              records
            </p>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-brand-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <nav aria-label="Page navigation">
            <ul className="flex items-center gap-1">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
              </li>

              {pageNumbers.map((page) => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`min-w-9 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      currentPage === page
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      <PermitDetailsModal
        permit={selectedPermit}
        onClose={() => setSelectedPermit(null)}
      />
      <ConfirmModal
        isOpen={!!permitToDelete}
        title="Delete Permit Record"
        message={
          permitToDelete
            ? `Are you sure you want to permanently delete permit ${getPermitNumber(permitToDelete)}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Permit"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={handleDeletePermit}
        onClose={() => setPermitToDelete(null)}
      />
    </div>
  );
}

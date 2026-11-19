import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  ChevronDown,
  LogOut,
  UserRound,
  LoaderCircle,
  FileText,
  MapPin,
  User,
  X,
} from "lucide-react";
import api from "../../api/axios";
import permitApi from "../../api/permitApi";

const pageNames = {
  "/": "Dashboard",
  "/permits": "Permit Records",
  "/permits/new": "Issue New Permit",
  "/users": "User Management",
  "/settings": "System Settings",
};
const getPermitsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.permits)) return response.permits;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.permits)) {
    return response.data.permits;
  }

  return [];
};
const getOwnerName = (permit) => {
  const owners = permit?.owners || permit?.data?.owners || [];

  if (!Array.isArray(owners)) return "";

  return owners
    .map((owner) => {
      if (typeof owner === "string") return owner;

      return (
        owner?.name ||
        owner?.fullName ||
        [
          owner?.firstName || owner?.fName,
          owner?.middleName || owner?.mName,
          owner?.lastName || owner?.lName,
          owner?.suffix || owner?.extName,
        ]
          .filter(Boolean)
          .join(" ")
      );
    })
    .filter(Boolean)
    .join(", ");
};

const getPermitLocation = (permit) =>
  permit?.projectLocation ||
  permit?.data?.projectLocation ||
  permit?.data?.location ||
  permit?.data?.projectAddress ||
  "";

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const title = pageNames[location.pathname] || "Permit Archive";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data?.data?.user || null);
      } catch (error) {
        console.error("Failed to load current user:", error);

        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");

    if (query !== null) {
      setSearch(query);
    }
  }, [location.search]);

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setSearching(true);

      try {
        const response = await permitApi.getAll({
          search: query,
          limit: 6,
        });

        if (!cancelled) {
          const results = getPermitsFromResponse(response);
          setSuggestions(results.slice(0, 6));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Permit search failed:", error);
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    setSearchOpen(false);

    if (!query) {
      navigate("/permits");
      return;
    }

    navigate(`/permits?search=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (permit) => {
    setSearchOpen(false);
    setSearch(permit.permitNo || permit.projectName || "");

    navigate("/permits", {
      state: {
        selectedPermit: permit,
      },
    });
  };
  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "U";

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="hidden text-xs text-slate-400 sm:block">
            Municipal Engineering Office / {title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-5">
        <div ref={searchRef} className="relative hidden lg:block">
          <form
            onSubmit={handleSearch}
            className={`flex w-[440px] items-center gap-2 rounded-xl border bg-white px-4 py-3 transition-all ${
              searchOpen
                ? "border-brand-500 shadow-md shadow-brand-100 ring-2 ring-brand-100"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Search
              size={17}
              className={`shrink-0 ${
                searchOpen ? "text-brand-600" : "text-slate-400"
              }`}
            />

            <input
              type="search"
              value={search}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search permits, owners, numbers..."
              className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />

            {searching ? (
              <LoaderCircle
                size={15}
                className="shrink-0 animate-spin text-brand-600"
              />
            ) : search ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSuggestions([]);
                  setSearchOpen(true);
                }}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="shrink-0 rounded-md bg-slate-100 px-1.5 py-1 text-[10px] text-slate-400">
                Enter
              </kbd>
            )}
          </form>
          {searchOpen && search.trim().length >= 2 && (
            <div className="absolute left-0 top-full z-50 mt-2 w-[520px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
              {" "}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Search Suggestions
                </span>

                <span className="text-[10px] text-slate-400">
                  {suggestions.length > 0
                    ? `${suggestions.length} results`
                    : ""}
                </span>
              </div>
              {searching ? (
                <div className="flex items-center justify-center gap-2 px-4 py-6 text-xs text-slate-400">
                  <LoaderCircle
                    size={15}
                    className="animate-spin text-brand-600"
                  />
                  Searching permit records...
                </div>
              ) : suggestions.length > 0 ? (
                <div className="max-h-[340px] overflow-y-auto p-1.5">
                  {suggestions.map((permit) => {
                    const ownerName = getOwnerName(permit);
                    const permitNo =
                      permit.permitNo ||
                      permit.data?.permitNo ||
                      "No permit number";
                    const location = getPermitLocation(permit);

                    return (
                      <button
                        key={permit._id}
                        type="button"
                        onClick={() => handleSuggestionClick(permit)}
                        className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-brand-50"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <FileText size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-xs font-bold text-slate-800">
                              {permit.projectName || "Untitled Project"}
                            </p>

                            <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-brand-700">
                              {permit.permitType || "Permit"}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] font-medium text-slate-500">
                            {permitNo}
                          </p>

                          {ownerName && (
                            <p className="mt-1 flex items-center gap-1.5 truncate text-[10px] text-slate-400">
                              <User size={11} />
                              <span className="truncate">{ownerName}</span>
                            </p>
                          )}

                          {location && (
                            <p className="mt-1 flex items-center gap-1.5 truncate text-[10px] text-slate-400">
                              <MapPin size={11} />
                              <span className="truncate">{location}</span>
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <Search size={20} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">
                    No matching permits found
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Press Enter to search all records.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={handleSearch}
                className="flex w-full items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 text-[11px] font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                <Search size={13} />
                Search all records for "{search.trim()}"
              </button>
            </div>
          )}
        </div>

        <div className="hidden h-8 border-l border-slate-200 sm:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setAccountOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {user ? (
                initials
              ) : (
                <LoaderCircle size={16} className="animate-spin" />
              )}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-36 truncate text-xs font-semibold text-slate-800">
                {user?.name || "Loading account..."}
              </p>
              <p className="text-[10px] text-slate-400">{roleLabel}</p>
            </div>

            <ChevronDown
              size={15}
              className={`hidden text-slate-400 transition sm:block ${
                accountOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user?.name || "Unknown User"}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
                  <UserRound size={12} />
                  {roleLabel}
                </div>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {loggingOut ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  {loggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

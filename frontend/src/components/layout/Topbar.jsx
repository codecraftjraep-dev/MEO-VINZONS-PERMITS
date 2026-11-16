import { useLocation } from "react-router-dom";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";

const pageNames = {
  "/": "Dashboard",
  "/permits": "Permit Records",
  "/permits/new": "Issue New Permit",
  "/users": "User Management",
  "/audit-logs": "Audit Logs",
};

export default function Topbar({ onMenuClick }) {
  const location = useLocation();

  const title = pageNames[location.pathname] || "Permit Archive";

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
      <div className="flex items-center gap-3">
        <button
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
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 md:flex">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search permits..."
            className="w-40 bg-transparent text-xs outline-none placeholder:text-slate-400"
          />
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
            /
          </kbd>
        </div>

        <button className="relative rounded-lg p-2.5 text-slate-500 hover:bg-slate-100">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </button>

        <div className="hidden h-8 border-l border-slate-200 sm:block" />

        <button className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            AD
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-800">
              Administrator
            </p>
            <p className="text-[10px] text-slate-400">System Admin</p>
          </div>

          <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}

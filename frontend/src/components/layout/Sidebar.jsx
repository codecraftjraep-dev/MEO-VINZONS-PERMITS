import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Files,
  FilePlus2,
  Users,
  ClipboardList,
  Settings,
  X,
  HardHat,
} from "lucide-react";

const navigation = [
  {
    label: "MAIN MENU",
    items: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
      { name: "Permit Records", path: "/permits", icon: Files },
      { name: "Issue New Permit", path: "/permits/new", icon: FilePlus2 },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { name: "User Management", path: "/users", icon: Users },
      { name: "Audit Logs", path: "/audit-logs", icon: ClipboardList },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-white">
              <HardHat size={23} />
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-wide text-slate-900">
                MEO ARCHIVE
              </h1>
              <p className="text-[10px] font-medium tracking-wider text-slate-400">
                PERMIT MANAGEMENT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((group) => (
            <div key={group.label} className="mb-8">
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-400">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${
                          isActive
                            ? "bg-brand-50 text-brand-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <Icon size={18} strokeWidth={1.8} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
              <Settings size={18} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700">
                System Administration
              </p>
              <p className="text-[10px] text-slate-400">
                Permit Archive System
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

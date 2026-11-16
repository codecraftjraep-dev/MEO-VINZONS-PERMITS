import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-[260px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-[11px] text-slate-400">
          Municipal Engineering Office · Permit Archive System
        </footer>
      </div>
    </div>
  );
}

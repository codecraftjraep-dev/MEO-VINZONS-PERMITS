import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import IssuePermitPage from "./pages/IssuePermitPage";
import PermitsPage from "./pages/PermitsPage";
import SettingsPage from "./pages/SettingsPage";

import UsersPage from "./pages/UsersPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/permits" element={<PermitsPage />} />

            <Route path="/permits/new" element={<IssuePermitPage />} />

            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Placeholder({ title }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        This module is under development.
      </p>
    </div>
  );
}

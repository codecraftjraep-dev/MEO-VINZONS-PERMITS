import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Add your other protected pages here */}
          </Route>
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

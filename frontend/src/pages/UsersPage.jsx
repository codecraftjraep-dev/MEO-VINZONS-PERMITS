
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Plus,
  Pencil,
  KeyRound,
  UserRound,
  Mail,
  Shield,
  CalendarDays,
  LoaderCircle,
  X,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import permitApi from "../api/permitApi";

const initialForm = {
  name: "",
  email: "",
  role: "viewer",
  password: "",
};

const roles = [
  { value: "admin", label: "Administrator" },
  { value: "encoder", label: "Encoder" },
  { value: "viewer", label: "Viewer" },
];

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

function RoleBadge({ role }) {
  const styles = {
    admin: "bg-purple-50 text-purple-700 border-purple-100",
    encoder: "bg-blue-50 text-blue-700 border-blue-100",
    viewer: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const labels = {
    admin: "Administrator",
    encoder: "Encoder",
    viewer: "Viewer",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[role] || styles.viewer
      }`}
    >
      {labels[role] || role}
    </span>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function StatCard({ title, value, description, icon: Icon, color }) {
  const colors = {
    blue: "bg-brand-50 text-brand-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            colors[color]
          }`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, description, icon: Icon, onClose, children, size = "max-w-lg" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className={`my-auto w-full ${size} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl`}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
              <p className="mt-1 text-xs text-slate-500">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function UserFormModal({ mode, user, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    mode === "edit"
      ? {
          name: user.name || "",
          email: user.email || "",
          role: user.role || "viewer",
          password: "",
        }
      : initialForm,
  );

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "create") {
      if (form.password.length < 12) {
        setError("Password must contain at least 12 characters.");
        return;
      }

      if (
        !/[a-z]/.test(form.password) ||
        !/[A-Z]/.test(form.password) ||
        !/[0-9]/.test(form.password) ||
        !/[^A-Za-z0-9]/.test(form.password)
      ) {
        setError(
          "Password must include uppercase, lowercase, number, and special character.",
        );
        return;
      }
    }

    try {
      await onSave({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        ...(mode === "create" ? { password: form.password } : {}),
      });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Modal
      title={mode === "create" ? "Add New User" : "Edit User"}
      description={
        mode === "create"
          ? "Create a new account for the MEO Permit Archive."
          : "Update the user's account information and permissions."
      }
      icon={mode === "create" ? UserRound : Pencil}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <UserRound
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              required
              type="text"
              maxLength={120}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Enter full name"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              required
              type="email"
              maxLength={254}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="user@example.com"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            Account Role <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Shield
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {mode === "create" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Initial Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                required
                type="password"
                minLength={12}
                maxLength={128}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Enter initial password"
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
              At least 12 characters with uppercase, lowercase, number, and
              special character.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <LoaderCircle size={15} className="animate-spin" />}
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create User"
                : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ResetPasswordModal({ user, onClose, onSave, saving }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      password.length < 12 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError(
        "Password must be at least 12 characters and include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    try {
      await onSave(password);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Modal
      title="Reset User Password"
      description={`Set a new password for ${user.name}.`}
      icon={KeyRound}
      onClose={onClose}
      size="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="rounded-lg border border-brand-100 bg-brand-50/70 p-3">
          <p className="text-xs font-semibold text-brand-900">{user.name}</p>
          <p className="mt-1 text-xs text-brand-600">{user.email}</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            New Password
          </label>
          <input
            required
            type="password"
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            Minimum 12 characters, including uppercase, lowercase, number,
            and special character.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          Resetting the password will invalidate the user's existing sessions.
          They will need to log in again.
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {saving && <LoaderCircle size={15} className="animate-spin" />}
            {saving ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ConfirmModal({ title, description, confirmLabel, onConfirm, onClose, saving, danger = false }) {
  return (
    <Modal
      title={title}
      description={description}
      icon={AlertCircle}
      onClose={onClose}
      size="max-w-md"
    >
      <div className="p-6">
        <p className="text-sm leading-relaxed text-slate-600">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-60 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-brand-900 hover:bg-brand-700"
            }`}
          >
            {saving && <LoaderCircle size={15} className="animate-spin" />}
            {saving ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const fetchUsers = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await permitApi.getUsers();
      setUsers(response.data?.users || []);
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error, "Unable to load user records."),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name?.toLowerCase().includes(normalizedSearch) ||
        user.email?.toLowerCase().includes(normalizedSearch);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const statistics = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.isActive).length,
      inactive: users.filter((user) => !user.isActive).length,
      admins: users.filter((user) => user.role === "admin").length,
    }),
    [users],
  );

  const openModal = (type, user = null) => {
    setSelectedUser(user);
    setModal(type);
    setNotice(null);
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setSelectedUser(null);
  };

  const handleCreate = async (data) => {
    setSaving(true);

    try {
      await permitApi.createUser(data);
      setModal(null);
      setNotice({
        type: "success",
        text: "User account created successfully.",
      });
      await fetchUsers(true);
    } catch (error) {
      throw getErrorMessage(error, "Failed to create user account.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    setSaving(true);

    try {
      await permitApi.updateUser(selectedUser._id, data);
      setModal(null);
      setNotice({
        type: "success",
        text: "User information updated successfully.",
      });
      await fetchUsers(true);
    } catch (error) {
      throw getErrorMessage(error, "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async () => {
    setSaving(true);

    try {
      await permitApi.updateUserStatus(
        selectedUser._id,
        !selectedUser.isActive,
      );

      setModal(null);
      setNotice({
        type: "success",
        text: `User account ${selectedUser.isActive ? "deactivated" : "activated"} successfully.`,
      });

      await fetchUsers(true);
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error, "Failed to update account status."),
      });
      setModal(null);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async (password) => {
    setSaving(true);

    try {
      await permitApi.resetUserPassword(selectedUser._id, password);
      setModal(null);
      setNotice({
        type: "success",
        text: "User password reset successfully. Existing sessions have been invalidated.",
      });
    } catch (error) {
      throw getErrorMessage(error, "Failed to reset user password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-5 md:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
            <ShieldCheck size={15} />
            System Administration
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage system accounts, access roles, and user permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => openModal("create")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      {notice && (
        <div
          className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? (
              <CheckCircle2 size={17} />
            ) : (
              <AlertCircle size={17} />
            )}
            {notice.text}
          </div>

          <button
            type="button"
            onClick={() => setNotice(null)}
            className="shrink-0 opacity-60 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={statistics.total}
          description="All registered accounts"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Active Users"
          value={statistics.active}
          description="Accounts with access"
          icon={UserCheck}
          color="green"
        />

        <StatCard
          title="Inactive Users"
          value={statistics.inactive}
          description="Deactivated accounts"
          icon={UserX}
          color="red"
        />

        <StatCard
          title="Administrators"
          value={statistics.admins}
          description="Accounts with full access"
          icon={ShieldCheck}
          color="purple"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              System Users
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {filteredUsers.length} of {users.length} accounts displayed
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="relative sm:col-span-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <LoaderCircle
                size={20}
                className="animate-spin text-brand-600"
              />
              Loading user accounts...
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    User
                  </th>
                  <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Date Created
                  </th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold uppercase text-brand-700">
                          {user.name?.charAt(0) || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-800">
                            {user.name}
                          </p>
                          <p className="mt-1 truncate text-[11px] text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge isActive={user.isActive} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays
                          size={14}
                          className="text-slate-400"
                        />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openModal("edit", user)}
                          title="Edit user"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openModal("reset", user)}
                          title="Reset password"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                        >
                          <KeyRound size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openModal("status", user)}
                          title={user.isActive ? "Deactivate user" : "Activate user"}
                          className={`rounded-lg p-2 transition ${
                            user.isActive
                              ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
                              : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                          }`}
                        >
                          {user.isActive ? (
                            <UserX size={15} />
                          ) : (
                            <UserCheck size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Users size={22} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        No users found
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Try changing your search or filter criteria.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-400">
            Showing {filteredUsers.length} user
            {filteredUsers.length !== 1 ? "s" : ""}
          </p>
          <p className="text-[11px] text-slate-400">
            MEO Permit Archive · User Administration
          </p>
        </div>
      </div>

      {modal === "create" && (
        <UserFormModal
          mode="create"
          onClose={closeModal}
          onSave={handleCreate}
          saving={saving}
        />
      )}

      {modal === "edit" && selectedUser && (
        <UserFormModal
          mode="edit"
          user={selectedUser}
          onClose={closeModal}
          onSave={handleUpdate}
          saving={saving}
        />
      )}

      {modal === "reset" && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onClose={closeModal}
          onSave={handlePasswordReset}
          saving={saving}
        />
      )}

      {modal === "status" && selectedUser && (
        <ConfirmModal
          title={
            selectedUser.isActive
              ? "Deactivate User Account"
              : "Activate User Account"
          }
          description={
            selectedUser.isActive
              ? `Are you sure you want to deactivate ${selectedUser.name}? They will no longer be able to access the MEO Permit Archive.`
              : `Are you sure you want to activate ${selectedUser.name}'s account? They will be able to log in again.`
          }
          confirmLabel={selectedUser.isActive ? "Deactivate Account" : "Activate Account"}
          danger={selectedUser.isActive}
          onClose={closeModal}
          onConfirm={handleStatusChange}
          saving={saving}
        />
      )}
    </div>
  );
}

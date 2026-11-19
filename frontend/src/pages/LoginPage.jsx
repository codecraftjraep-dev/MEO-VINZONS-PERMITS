
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  FileText,
  ShieldCheck,
  Landmark,
  ArrowRight,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, user, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(form);

      const destination = location.state?.from?.pathname || "/dashboard";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[70%_30%]">
      <section className="relative isolate flex min-h-[440px] flex-col justify-between overflow-hidden bg-brand-900 px-6 py-8 text-white sm:px-10 sm:py-10 lg:min-h-screen lg:px-14 lg:py-12 xl:px-20">
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[600px] w-[600px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-[440px] w-[440px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-64 -left-32 -z-10 h-[600px] w-[600px] rounded-full bg-brand-700/50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] bg-blue-400/5 blur-[120px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10">
            <Landmark size={25} />
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide">
              MUNICIPAL ENGINEERING OFFICE
            </p>
            <p className="mt-0.5 text-[10px] tracking-[0.2em] text-blue-200">
              MUNICIPALITY OF VINZONS
            </p>
          </div>
        </div>

        <div className="relative z-10 my-14 max-w-4xl lg:my-auto lg:py-20">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/5 px-3 py-2 text-[10px] font-semibold tracking-[0.18em] text-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
            MEO PERMIT ARCHIVE SYSTEM
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Building a more
            <span className="block text-blue-300">organized future.</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100/70 sm:text-base">
            A centralized platform for managing building permits, occupancy
            permits, and official municipal records.
          </p>

          <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <FileText size={21} className="mb-4 text-blue-300" />
              <p className="text-xs font-semibold">Permit Records</p>
              <p className="mt-1 text-[10px] text-blue-100/50">
                Organized documentation
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <ShieldCheck size={21} className="mb-4 text-blue-300" />
              <p className="text-xs font-semibold">Secure Access</p>
              <p className="mt-1 text-[10px] text-blue-100/50">
                Protected information
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <Building2 size={21} className="mb-4 text-blue-300" />
              <p className="text-xs font-semibold">Office Management</p>
              <p className="mt-1 text-[10px] text-blue-100/50">
                Centralized operations
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5">
          <p className="text-[10px] text-blue-100/50">
            © {new Date().getFullYear()} Municipality of Vinzons
          </p>
          <p className="text-[10px] text-blue-100/50">
            Municipal Engineering Office
          </p>
        </div>
      </section>

      <section className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-slate-50 px-6 py-12 sm:px-10 lg:min-h-screen lg:px-7 xl:px-10">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative w-full max-w-[390px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-white">
              <Landmark size={21} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                MUNICIPAL ENGINEERING OFFICE
              </p>
              <p className="text-[9px] tracking-wider text-slate-500">
                MUNICIPALITY OF VINZONS
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.06]">
            <div className="bg-brand-900 px-7 py-7 text-white sm:px-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <LockKeyhole size={21} />
              </div>

              <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-200">
                ACCOUNT ACCESS
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Welcome back.
              </h2>
              <p className="mt-1 text-xs text-blue-100/60">
                Sign in to access the permit archive.
              </p>
            </div>

            <div className="px-7 py-8 sm:px-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="username"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-brand-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/10 transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Signing in..." : "Sign In"}
                  {!submitting && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5">
                <ShieldCheck size={14} className="text-slate-400" />
                <p className="text-[10px] text-slate-400">
                  Authorized personnel only
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] text-slate-400">
            MEO Permit Archive · Municipality of Vinzons
          </p>
        </div>
      </section>
    </div>
  );
}

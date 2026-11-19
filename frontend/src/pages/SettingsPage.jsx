
import { useEffect, useState } from "react";
import {
  Settings,
  FileText,
  Building2,
  UserRound,
  BriefcaseBusiness,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import permitApi  from "../api/permitApi";

const initialSignatories = {
  building: {
    name: "",
    position: "",
  },
  occupancy: {
    name: "",
    position: "",
  },
};

function SignatoryCard({
  title,
  description,
  icon: Icon,
  value,
  onChange,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-600">
            Signatory Name
          </label>
          <div className="relative">
            <UserRound
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={value.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Enter full name"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-600">
            Position / Designation
          </label>
          <div className="relative">
            <BriefcaseBusiness
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={value.position}
              onChange={(e) => onChange("position", e.target.value)}
              placeholder="e.g. Municipal Engineer"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [signatories, setSignatories] = useState(initialSignatories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSignatories = async () => {
      try {
        const response = await permitApi.getSignatories();
        if (response?.data) {
          setSignatories({
            building: {
              ...initialSignatories.building,
              ...response.data.building,
            },
            occupancy: {
              ...initialSignatories.occupancy,
              ...response.data.occupancy,
            },
          });
        }
      } catch (error) {
        console.error("Failed to load signatories:", error);
        setMessage({
          type: "error",
          text: "Unable to load signatory settings.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSignatories();
  }, []);

  const updateSignatory = (permitType, field, value) => {
    setSignatories((prev) => ({
      ...prev,
      [permitType]: {
        ...prev[permitType],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await permitApi.updateSignatories(signatories);
      setMessage({
        type: "success",
        text: "Signatory settings saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save signatories:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save signatory settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-5 md:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
            <Settings size={15} />
            Administration
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the authorized signatories for issued permits.
          </p>
        </div>

        <button
          type="submit"
          form="signatory-settings-form"
          disabled={loading || saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 text-brand-700">
            <AlertCircle size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-900">
              Permit signatory configuration
            </p>
            <p className="mt-1 text-xs leading-relaxed text-brand-700">
              Building and Occupancy Permits have independent signatory
              details. Changes saved here will be used when generating
              the corresponding permit certificates.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={17} />
          ) : (
            <AlertCircle size={17} />
          )}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <LoaderCircle size={20} className="animate-spin text-brand-600" />
            Loading settings...
          </div>
        </div>
      ) : (
        <form
          id="signatory-settings-form"
          onSubmit={handleSave}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <SignatoryCard
              title="Building Permit"
              description="Authorized signatory for Building Permits"
              icon={FileText}
              value={signatories.building}
              onChange={(field, value) =>
                updateSignatory("building", field, value)
              }
            />

            <SignatoryCard
              title="Occupancy Permit"
              description="Authorized signatory for Occupancy Permits"
              icon={Building2}
              value={signatories.occupancy}
              onChange={(field, value) =>
                updateSignatory("occupancy", field, value)
              }
            />
          </div>
        </form>
      )}
    </div>
  );
}

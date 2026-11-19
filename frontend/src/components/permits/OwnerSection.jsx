import { UserRound } from "lucide-react";
import {
  AddButton,
  Field,
  RemoveButton,
  SectionHeader,
  TextInput,
  inputClass,
  sectionClass,
} from "../forms/FormElements";

const ownerTypes = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
  { value: "corporation", label: "Corporation" },
  { value: "organization", label: "Organization" },
  { value: "group", label: "Group" },
];

function CareOfList({ owner, ownerIndex, handlers }) {
  const { addCareOf, updateCareOf, removeCareOf } = handlers;

  return (
    <div className="mt-5 border-t border-slate-200 pt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-brand-900">Care of Names</h4>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Optional. Add one or multiple names.
          </p>
        </div>

        <AddButton variant="outline" onClick={() => addCareOf(ownerIndex)}>
          Add Care of
        </AddButton>
      </div>

      {owner.careOf.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-xs text-slate-400">
          No Care of names added.
        </p>
      ) : (
        <div className="space-y-2">
          {owner.careOf.map((name, careIndex) => (
            <div key={careIndex} className="flex items-center gap-2">
              <span className="w-7 shrink-0 text-center text-xs text-slate-400">
                {careIndex + 1}.
              </span>
              <input
                className={inputClass}
                placeholder="Enter Care of name"
                value={name}
                onChange={(event) =>
                  updateCareOf(ownerIndex, careIndex, event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeCareOf(ownerIndex, careIndex)}
                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                aria-label="Remove Care of name"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OwnerSection({ owners, handlers }) {
  const { addOwner, removeOwner, updateOwner } = handlers;

  return (
    <section className={sectionClass}>
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
            <UserRound size={19} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-brand-900">Name of Owner</h2>
            <p className="text-xs text-slate-400">
              Add multiple owners and their Care of names.
            </p>
          </div>
        </div>

        <AddButton onClick={addOwner}>Add Another Owner</AddButton>
      </div>

      <div className="space-y-4 p-5">
        {owners.map((owner, ownerIndex) => (
          <div
            key={ownerIndex}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-brand-900">
                Owner {ownerIndex + 1}
              </h3>

              {owners.length > 1 && (
                <RemoveButton onClick={() => removeOwner(ownerIndex)} />
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Owner Type *">
                <select
                  className={inputClass}
                  value={owner.ownerType}
                  onChange={(event) =>
                    updateOwner(ownerIndex, "ownerType", event.target.value)
                  }
                >
                  {ownerTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label={
                  owner.ownerType === "individual"
                    ? "Full Name *"
                    : "Company / Organization / Group Name *"
                }
                className="sm:col-span-2"
              >
                <TextInput
                  placeholder={
                    owner.ownerType === "individual"
                      ? "Enter owner's full name"
                      : "Enter registered or organization name"
                  }
                  value={owner.name}
                  onChange={(event) =>
                    updateOwner(ownerIndex, "name", event.target.value)
                  }
                  required
                />
              </Field>
            </div>

            <CareOfList
              owner={owner}
              ownerIndex={ownerIndex}
              handlers={handlers}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

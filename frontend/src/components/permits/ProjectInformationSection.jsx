import { Layers } from "lucide-react";
import {
  AddButton,
  Field,
  RemoveButton,
  SectionHeader,
  TextInput,
  inputClass,
  sectionClass,
} from "../forms/FormElements";

function ClassificationList({ items, handlers }) {
  const { addClassification, updateClassification, removeClassification } =
    handlers;

  return (
    <div className="sm:col-span-2">
      <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-bold text-brand-900">
            Group and Division
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Each group has its own corresponding division.
          </p>
        </div>
        <AddButton variant="outline" onClick={addClassification}>
          Add Another Group
        </AddButton>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          >
            <Field label={`Group ${index + 1}`}>
              <TextInput
                placeholder="Enter group"
                value={item.group}
                onChange={(event) =>
                  updateClassification(index, "group", event.target.value)
                }
              />
            </Field>

            <Field label="Division">
              <TextInput
                placeholder="Enter division"
                value={item.division}
                onChange={(event) =>
                  updateClassification(index, "division", event.target.value)
                }
              />
            </Field>

            {items.length > 1 && (
              <RemoveButton
                onClick={() => removeClassification(index)}
                children="Remove Group"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectInformationSection({
  form,
  updateField,
  classificationHandlers,
  isOccupancy,
  isBuildingPermit,
}) {
  return (
    <section className={sectionClass}>
      <SectionHeader
        icon={Layers}
        title="Project Information"
        description="Project name, location, and occupancy classification."
      />

      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
        <Field label="Name of Project *" className="sm:col-span-2">
          <TextInput
            placeholder="Enter project name"
            value={form.projectName}
            onChange={(event) =>
              updateField("projectName", event.target.value)
            }
            required
          />
        </Field>

        <Field label="Project Location *" className="sm:col-span-2">
          <TextInput
            placeholder="Enter complete project location"
            value={form.projectLocation}
            onChange={(event) =>
              updateField("projectLocation", event.target.value)
            }
            required
          />
        </Field>

        {isOccupancy && (
          <Field label="Date of Completion *">
            <TextInput
              type="date"
              value={form.dateOfCompletion}
              onChange={(event) =>
                updateField("dateOfCompletion", event.target.value)
              }
              required
            />
          </Field>
        )}

        <Field
          label="Use or Character of Occupancy *"
          className="sm:col-span-2"
        >
          <TextInput
            placeholder="Enter occupancy classification"
            value={form.occupancy}
            onChange={(event) => updateField("occupancy", event.target.value)}
            required
          />
        </Field>

        <ClassificationList
          items={form.classifications}
          handlers={classificationHandlers}
        />

        {isBuildingPermit && (
          <>
            <Field label="Total Project Cost (₱) *">
              <TextInput
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.totalProjectCost}
                onChange={(event) =>
                  updateField("totalProjectCost", event.target.value)
                }
                required
              />
            </Field>

            <Field
              label="Professional in Charge of Construction"
              className="sm:col-span-2"
            >
              <TextInput
                placeholder="Enter professional's full name"
                value={form.professionalInCharge}
                onChange={(event) =>
                  updateField("professionalInCharge", event.target.value)
                }
              />
            </Field>

            <Field label="Scope of Work *" className="sm:col-span-2">
              <textarea
                rows={4}
                className={inputClass}
                placeholder="Describe the scope of construction work..."
                value={form.scopeOfWork}
                onChange={(event) =>
                  updateField("scopeOfWork", event.target.value)
                }
                required
              />
            </Field>
          </>
        )}
      </div>
    </section>
  );
}

import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ApiMaterial, MaterialInput } from '../types/material'
import { MATERIAL_CATEGORIES, MATERIAL_UNITS } from '../types/material'

// Props are the things the parent page (Materials.tsx) gives to this form.
// material: if it has a material we are EDITING, if null we are ADDING.
// saving:   true while the backend is busy.
type Props = {
  material: ApiMaterial | null
  saving: boolean
  onSave: (data: MaterialInput) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  name?: string
  category?: string
  description?: string
  unit?: string
  quantityInStock?: string
  reorderLevel?: string
  unitCost?: string
}

// True if the text is a real number that is 0 or more (stock can be 0).
// Number.isFinite rejects NaN and Infinity.
function isZeroOrMore(text: string) {
  const n = Number(text)
  return text.trim() !== '' && Number.isFinite(n) && n >= 0
}

function MaterialForm({ material, saving, onSave, onCancel }: Props) {
  // One state for each input. Numbers are kept as text while typing.
  const [name, setName] = useState(material?.name ?? '')
  const [category, setCategory] = useState(material?.category ?? '')
  const [description, setDescription] = useState(material?.description ?? '')
  const [unit, setUnit] = useState(material?.unit ?? '')
  const [quantityInStock, setQuantityInStock] = useState(
    material ? String(material.quantityInStock) : ''
  )
  const [reorderLevel, setReorderLevel] = useState(
    material ? String(material.reorderLevel) : ''
  )
  const [unitCost, setUnitCost] = useState(material ? String(material.unitCost) : '')

  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters'
    if (category === '') newErrors.category = 'Please choose a category'
    if (description.trim().length < 3)
      newErrors.description = 'Description must be at least 3 characters'
    if (unit === '') newErrors.unit = 'Please choose a unit'
    if (!isZeroOrMore(quantityInStock))
      newErrors.quantityInStock = 'Stock must be a number, 0 or more'
    if (!isZeroOrMore(reorderLevel))
      newErrors.reorderLevel = 'Reorder level must be a number, 0 or more'
    if (!isZeroOrMore(unitCost)) newErrors.unitCost = 'Unit cost must be a number, 0 or more'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return

    onSave({
      name: name.trim(),
      category,
      description: description.trim(),
      unit,
      quantityInStock: Number(quantityInStock),
      reorderLevel: Number(reorderLevel),
      unitCost: Number(unitCost),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">
        {material ? 'Edit Material' : 'Add Material'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Name *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Category *</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Choose category --</option>
            {MATERIAL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm mb-1">Description *</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="e.g. Seasoned mahogany planks"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Unit *</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">-- Choose unit --</option>
            {MATERIAL_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.unit && <p className="text-red-600 text-sm">{errors.unit}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Quantity in Stock *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={quantityInStock}
            onChange={(e) => setQuantityInStock(e.target.value)}
          />
          {errors.quantityInStock && (
            <p className="text-red-600 text-sm">{errors.quantityInStock}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Reorder Level *</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Warn me when stock reaches this"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(e.target.value)}
          />
          {errors.reorderLevel && (
            <p className="text-red-600 text-sm">{errors.reorderLevel}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Unit Cost (KES) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
          />
          {errors.unitCost && <p className="text-red-600 text-sm">{errors.unitCost}</p>}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-1 rounded disabled:bg-gray-300"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default MaterialForm
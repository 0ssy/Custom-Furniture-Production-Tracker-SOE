import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Material } from '../types/material'
import { MATERIAL_UNITS } from '../types/material'

// Props are the things the parent page gives to this form.
// material: if it has a material we are EDITING, if null we are ADDING.
type Props = {
  material: Material | null
  onSave: (data: Omit<Material, '_id'>) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  name?: string
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

function MaterialForm({ material, onSave, onCancel }: Props) {
  // One state for each input. Numbers are kept as text while typing
  // and changed to numbers when saving.
  const [name, setName] = useState(material?.name ?? '')
  const [unit, setUnit] = useState(material?.unit ?? '')
  const [quantityInStock, setQuantityInStock] = useState(
    material ? String(material.quantityInStock) : ''
  )
  const [reorderLevel, setReorderLevel] = useState(
    material ? String(material.reorderLevel) : ''
  )
  const [unitCost, setUnitCost] = useState(material ? String(material.unitCost) : '')
  const [supplier, setSupplier] = useState(material?.supplier ?? '')

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    if (name.trim() === '') newErrors.name = 'Name is required'
    if (unit === '') newErrors.unit = 'Please choose a unit'
    if (!isZeroOrMore(quantityInStock))
      newErrors.quantityInStock = 'Stock must be a number, 0 or more'
    if (!isZeroOrMore(reorderLevel))
      newErrors.reorderLevel = 'Reorder level must be a number, 0 or more'
    // Unit cost must be bigger than 0
    if (!isZeroOrMore(unitCost) || Number(unitCost) === 0)
      newErrors.unitCost = 'Unit cost must be a number above 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

    onSave({
      name: name.trim(),
      unit,
      quantityInStock: Number(quantityInStock),
      reorderLevel: Number(reorderLevel),
      unitCost: Number(unitCost),
      supplier: supplier.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">
        {material ? 'Edit Material' : 'Add Material'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Name */}
        <div>
          <label className="block text-sm mb-1">Name *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        {/* Unit dropdown */}
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

        {/* Quantity in stock */}
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

        {/* Reorder level */}
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

        {/* Unit cost */}
        <div>
          <label className="block text-sm mb-1">Unit Cost (KES) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
          />
          {errors.unitCost && <p className="text-red-600 text-sm">{errors.unitCost}</p>}
        </div>

        {/* Supplier (optional) */}
        <div>
          <label className="block text-sm mb-1">Supplier</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-amber-600 text-white px-4 py-1 rounded">
          Save
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
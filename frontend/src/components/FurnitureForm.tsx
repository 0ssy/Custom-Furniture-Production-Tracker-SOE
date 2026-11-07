import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ApiFurniture, FurnitureInput } from '../types/furniture'
import { FURNITURE_CATEGORIES } from '../types/furniture'

// Props are the things the parent page (Furniture.tsx) gives to this form.
// furniture: if it has an item we are EDITING, if null we are ADDING.
// saving:    true while the backend is busy, so Save cannot be clicked twice.
// onSave:    runs when the form is valid.
// onCancel:  runs when Cancel is clicked.
type Props = {
  furniture: ApiFurniture | null
  saving: boolean
  onSave: (data: FurnitureInput) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  name?: string
  category?: string
  description?: string
  basePrice?: string
  length?: string
  width?: string
  height?: string
}

// True if the text is a real number above 0.
// Number.isFinite rejects NaN and Infinity (like typing 1e999).
function isPositive(text: string) {
  const n = Number(text)
  return text.trim() !== '' && Number.isFinite(n) && n > 0
}

function FurnitureForm({ furniture, saving, onSave, onCancel }: Props) {
  // One state for each input. Numbers are kept as text while typing
  // and changed to numbers when saving.
  const [name, setName] = useState(furniture?.name ?? '')
  const [category, setCategory] = useState(furniture?.category ?? '')
  const [description, setDescription] = useState(furniture?.description ?? '')
  const [basePrice, setBasePrice] = useState(furniture ? String(furniture.basePrice) : '')
  const [length, setLength] = useState(furniture ? String(furniture.dimensions.length) : '')
  const [width, setWidth] = useState(furniture ? String(furniture.dimensions.width) : '')
  const [height, setHeight] = useState(furniture ? String(furniture.dimensions.height) : '')
  // New items start as available
  const [isAvailable, setIsAvailable] = useState(furniture?.isAvailable ?? true)

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    // The backend needs at least 2 characters for the name
    if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters'
    if (category === '') newErrors.category = 'Please choose a category'
    // The backend needs at least 3 characters for the description
    if (description.trim().length < 3)
      newErrors.description = 'Description must be at least 3 characters'
    if (!isPositive(basePrice)) newErrors.basePrice = 'Price must be a number above 0'
    if (!isPositive(length)) newErrors.length = 'Length must be a number above 0'
    if (!isPositive(width)) newErrors.width = 'Width must be a number above 0'
    if (!isPositive(height)) newErrors.height = 'Height must be a number above 0'

    setErrors(newErrors)
    // If newErrors has no keys, nothing is wrong
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

    onSave({
      name: name.trim(),
      category,
      description: description.trim(),
      basePrice: Number(basePrice),
      dimensions: {
        length: Number(length),
        width: Number(width),
        height: Number(height),
      },
      isAvailable,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">
        {furniture ? 'Edit Furniture' : 'Add Furniture'}
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

        {/* Category dropdown */}
        <div>
          <label className="block text-sm mb-1">Category *</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Choose category --</option>
            {FURNITURE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
        </div>

        {/* Description (takes the full width) */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Description *</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="e.g. Pine bed with carved headboard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm mb-1">Base Price (KES) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
          />
          {errors.basePrice && <p className="text-red-600 text-sm">{errors.basePrice}</p>}
        </div>

        {/* Availability checkbox */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            Available for orders
          </label>
        </div>

        {/* The three size inputs */}
        <div>
          <label className="block text-sm mb-1">Length (cm) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
          {errors.length && <p className="text-red-600 text-sm">{errors.length}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Width (cm) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          {errors.width && <p className="text-red-600 text-sm">{errors.width}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Height (cm) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          {errors.height && <p className="text-red-600 text-sm">{errors.height}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-1 rounded disabled:bg-gray-300"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {/* type="button" so Cancel does NOT submit the form */}
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

export default FurnitureForm
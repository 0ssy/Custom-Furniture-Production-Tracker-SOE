import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Furniture } from '../types/furniture'
import { FURNITURE_CATEGORIES } from '../types/furniture'

// Props are the things the parent page gives to this form.
// furniture: if it has an item we are EDITING, if null we are ADDING.
// onSave:    runs when the form is valid. It gets the data without _id.
// onCancel:  runs when Cancel is clicked.
type Props = {
  furniture: Furniture | null
  onSave: (data: Omit<Furniture, '_id'>) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  name?: string
  category?: string
  heightCm?: string
  widthCm?: string
  depthCm?: string
  material?: string
  colour?: string
  price?: string
}

// Returns true if the text is a real number bigger than 0.
// Number.isFinite rejects NaN and Infinity (like typing 1e999).
function isPositiveNumber(text: string) {
  const n = Number(text)
  return text.trim() !== '' && Number.isFinite(n) && n > 0
}

function FurnitureForm({ furniture, onSave, onCancel }: Props) {
  // One state for each input. When editing we start with the item's
  // current values, when adding we start empty.
  // Numbers are kept as text while typing and changed to numbers on save.
  const [name, setName] = useState(furniture?.name ?? '')
  const [category, setCategory] = useState(furniture?.category ?? '')
  const [heightCm, setHeightCm] = useState(furniture ? String(furniture.heightCm) : '')
  const [widthCm, setWidthCm] = useState(furniture ? String(furniture.widthCm) : '')
  const [depthCm, setDepthCm] = useState(furniture ? String(furniture.depthCm) : '')
  const [material, setMaterial] = useState(furniture?.material ?? '')
  const [colour, setColour] = useState(furniture?.colour ?? '')
  const [design, setDesign] = useState(furniture?.design ?? '')
  const [price, setPrice] = useState(furniture ? String(furniture.price) : '')

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    if (name.trim() === '') newErrors.name = 'Name is required'
    if (category === '') newErrors.category = 'Please choose a category'
    if (!isPositiveNumber(heightCm)) newErrors.heightCm = 'Height must be a number above 0'
    if (!isPositiveNumber(widthCm)) newErrors.widthCm = 'Width must be a number above 0'
    if (!isPositiveNumber(depthCm)) newErrors.depthCm = 'Depth must be a number above 0'
    if (material.trim() === '') newErrors.material = 'Material is required'
    if (colour.trim() === '') newErrors.colour = 'Colour is required'
    if (!isPositiveNumber(price)) newErrors.price = 'Price must be a number above 0'

    setErrors(newErrors)
    // If newErrors has no keys, nothing is wrong
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

    // Everything is fine. Change the text into numbers and send it up.
    onSave({
      name: name.trim(),
      category,
      heightCm: Number(heightCm),
      widthCm: Number(widthCm),
      depthCm: Number(depthCm),
      material: material.trim(),
      colour: colour.trim(),
      design: design.trim(),
      price: Number(price),
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

        {/* The three size inputs */}
        <div>
          <label className="block text-sm mb-1">Height (cm) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
          {errors.heightCm && <p className="text-red-600 text-sm">{errors.heightCm}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Width (cm) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={widthCm}
            onChange={(e) => setWidthCm(e.target.value)}
          />
          {errors.widthCm && <p className="text-red-600 text-sm">{errors.widthCm}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Depth (cm) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={depthCm}
            onChange={(e) => setDepthCm(e.target.value)}
          />
          {errors.depthCm && <p className="text-red-600 text-sm">{errors.depthCm}</p>}
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm mb-1">Material *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />
          {errors.material && <p className="text-red-600 text-sm">{errors.material}</p>}
        </div>

        {/* Colour */}
        <div>
          <label className="block text-sm mb-1">Colour *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
          />
          {errors.colour && <p className="text-red-600 text-sm">{errors.colour}</p>}
        </div>

        {/* Design (optional) */}
        <div>
          <label className="block text-sm mb-1">Design</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="e.g. Carved headboard"
            value={design}
            onChange={(e) => setDesign(e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm mb-1">Price (KES) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && <p className="text-red-600 text-sm">{errors.price}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        {/* type="submit" makes this button trigger handleSubmit */}
        <button type="submit" className="bg-amber-600 text-white px-4 py-1 rounded">
          Save
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
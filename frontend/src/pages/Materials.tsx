import { useState } from 'react'
import type { Material } from '../types/material'
import { mockMaterials } from '../data/mockMaterials'
import MaterialForm from '../components/MaterialForm'

function Materials() {
  // The materials shown in the table. Starts with the fake data.
  const [materials, setMaterials] = useState<Material[]>(mockMaterials)

  // Text typed in the search box
  const [search, setSearch] = useState('')

  // true = show only the materials that are low on stock
  const [lowOnly, setLowOnly] = useState(false)

  // true = form visible, false = form hidden
  const [showForm, setShowForm] = useState(false)

  // Which material are we editing? null means we are adding a new one.
  const [editing, setEditing] = useState<Material | null>(null)

  // A material is LOW when the stock is at or below its reorder level
  function isLow(m: Material) {
    return m.quantityInStock <= m.reorderLevel
  }

  // Count of low-stock materials, shown in the warning banner
  const lowCount = materials.filter(isLow).length

  // Keep only materials that match the search text AND the low-stock checkbox
  const filtered = materials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchesLow = !lowOnly || isLow(m)
    return matchesSearch && matchesLow
  })

  // Open an empty form
  function handleAddClick() {
    setEditing(null)
    setShowForm(true)
  }

  // Open the form filled with the chosen material's details
  function handleEditClick(material: Material) {
    setEditing(material)
    setShowForm(true)
  }

  // Called by the form when the data is valid and Save was clicked
  function handleSave(data: Omit<Material, '_id'>) {
    if (editing) {
      // EDIT: replace only the material we edited, keep the others
      setMaterials(
        materials.map((m) => (m._id === editing._id ? { ...m, ...data } : m))
      )
    } else {
      // ADD: new material with a unique fake id (backend makes it later)
      setMaterials([...materials, { _id: crypto.randomUUID(), ...data }])
    }
    // Close the form after saving
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      {/* Page title and the Add button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Materials Inventory</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Add Material
        </button>
      </div>

      {/* Warning banner, only shown if at least one material is low */}
      {lowCount > 0 && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">
          Warning: {lowCount} material(s) are low on stock.
        </p>
      )}

      {/* The key resets the form when we switch between materials */}
      {showForm && (
        <MaterialForm
          key={editing?._id ?? 'new'}
          material={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
        />
      )}

      {/* Search box and low-stock checkbox side by side */}
      <div className="flex gap-4 items-center mb-4">
        <input
          className="border rounded px-3 py-2 w-full max-w-sm bg-white"
          placeholder="Search by material name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lowOnly}
            onChange={(e) => setLowOnly(e.target.checked)}
          />
          Low stock only
        </label>
      </div>

      {/* Materials table */}
      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">In Stock</th>
            <th className="p-2">Reorder Level</th>
            <th className="p-2">Unit Cost (KES)</th>
            <th className="p-2">Supplier</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m._id} className="border-t">
              <td className="p-2">{m.name}</td>
              {/* Stock with its unit, like "120 planks" */}
              <td className="p-2">
                {m.quantityInStock} {m.unit}
              </td>
              <td className="p-2">{m.reorderLevel}</td>
              <td className="p-2">{m.unitCost.toLocaleString()}</td>
              <td className="p-2">{m.supplier || '-'}</td>
              {/* Red label if low, green label if fine */}
              <td className="p-2">
                {isLow(m) ? (
                  <span className="text-red-600 font-bold">Low stock</span>
                ) : (
                  <span className="text-green-700">In stock</span>
                )}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleEditClick(m)}
                  className="text-amber-700 underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Message when nothing matches */}
      {filtered.length === 0 && (
        <p className="text-gray-500 mt-3">No materials found.</p>
      )}
    </div>
  )
}

export default Materials
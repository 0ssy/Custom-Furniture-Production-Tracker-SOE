import { useState } from 'react'
import type { Furniture as FurnitureItem } from '../types/furniture'
import { mockFurniture } from '../data/mockFurniture'
import FurnitureForm from '../components/FurnitureForm'

// The page is called Furniture and so is the type, so we rename the
// type to FurnitureItem here to avoid a name clash.
function Furniture() {
  // The catalogue shown in the table. Starts with the fake data.
  const [items, setItems] = useState<FurnitureItem[]>(mockFurniture)

  // Text typed in the search box
  const [search, setSearch] = useState('')

  // true = form visible, false = form hidden
  const [showForm, setShowForm] = useState(false)

  // Which item are we editing? null means we are adding a new one.
  const [editing, setEditing] = useState<FurnitureItem | null>(null)

  // Keep only the items whose name or category matches the search.
  const filtered = items.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  )

  // Open an empty form
  function handleAddClick() {
    setEditing(null)
    setShowForm(true)
  }

  // Open the form filled with the chosen item's details
  function handleEditClick(item: FurnitureItem) {
    setEditing(item)
    setShowForm(true)
  }

  // Called by the form when the data is valid and Save was clicked
  function handleSave(data: Omit<FurnitureItem, '_id'>) {
    if (editing) {
      // EDIT: replace only the item we edited, keep the others
      setItems(items.map((f) => (f._id === editing._id ? { ...f, ...data } : f)))
    } else {
      // ADD: make a new item with a unique fake id.
      // The real backend will make the _id later.
      setItems([...items, { _id: crypto.randomUUID(), ...data }])
    }
    // Close the form after saving
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      {/* Page title and the Add button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Furniture Catalogue</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Add Furniture
        </button>
      </div>

      {/* The key resets the form when we switch between items */}
      {showForm && (
        <FurnitureForm
          key={editing?._id ?? 'new'}
          furniture={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
        />
      )}

      {/* Search box */}
      <input
        className="border rounded px-3 py-2 mb-4 w-full max-w-sm bg-white"
        placeholder="Search by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Furniture table */}
      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Size (H x W x D cm)</th>
            <th className="p-2">Material</th>
            <th className="p-2">Colour</th>
            <th className="p-2">Design</th>
            <th className="p-2">Price (KES)</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((f) => (
            <tr key={f._id} className="border-t">
              <td className="p-2">{f.name}</td>
              <td className="p-2">{f.category}</td>
              {/* The three sizes joined into one cell, like 200 x 150 x 60 */}
              <td className="p-2">
                {f.heightCm} x {f.widthCm} x {f.depthCm}
              </td>
              <td className="p-2">{f.material}</td>
              <td className="p-2">{f.colour}</td>
              <td className="p-2">{f.design || '-'}</td>
              {/* toLocaleString adds commas, so 45000 shows as 45,000 */}
              <td className="p-2">{f.price.toLocaleString()}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEditClick(f)}
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
        <p className="text-gray-500 mt-3">No furniture found.</p>
      )}
    </div>
  )
}

export default Furniture
import { useCallback, useEffect, useState } from 'react'
import type { ApiFurniture, FurnitureInput } from '../types/furniture'
import { FURNITURE_CATEGORIES } from '../types/furniture'
import { apiFetch } from '../services/api'
import { extractList } from '../services/list'
import { useAuth } from '../context/AuthContext'
import { canEdit, canDelete } from '../utils/permissions'
import FurnitureForm from '../components/FurnitureForm'

function Furniture() {
  // Who is logged in. Only some roles may edit; only the Administrator deletes.
  const { user } = useAuth()
  const isAdmin = canDelete(user?.role)
  const editable = canEdit(user?.role, 'furniture')

  const [items, setItems] = useState<ApiFurniture[]>([])

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ApiFurniture | null>(null)

  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  // Gets all furniture from the backend ({ count, furniture })
  const loadItems = useCallback(async () => {
    try {
      const data = await apiFetch<unknown>('/furniture')
      setItems(extractList<ApiFurniture>(data, 'furniture'))
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load furniture')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  // Keep only items that match the search (name) AND the category filter
  const filtered = items.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === '' || f.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  function handleAddClick() {
    setEditing(null)
    setActionError('')
    setShowForm(true)
  }

  function handleEditClick(item: ApiFurniture) {
    setEditing(item)
    setActionError('')
    setShowForm(true)
  }

  // POST creates a new item, PUT updates an existing one.
  async function handleSave(data: FurnitureInput) {
    setSaving(true)
    setActionError('')
    try {
      if (editing) {
        await apiFetch(`/furniture/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } else {
        await apiFetch('/furniture', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      }
      await loadItems()
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save the furniture')
    } finally {
      setSaving(false)
    }
  }

  // Administrator only: delete an item after the user confirms
  async function handleDelete(item: ApiFurniture) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    setActionError('')
    try {
      await apiFetch(`/furniture/${item._id}`, { method: 'DELETE' })
      await loadItems()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the furniture')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Furniture Catalogue</h2>
        {editable && (
          <button
            onClick={handleAddClick}
            className="bg-amber-600 text-white px-4 py-2 rounded"
          >
            + Add Furniture
          </button>
        )}
      </div>

      {actionError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{actionError}</p>
      )}

      {showForm && (
        <FurnitureForm
          key={editing?._id ?? 'new'}
          furniture={editing}
          saving={saving}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
            setActionError('')
          }}
        />
      )}

      <div className="flex gap-3 mb-4">
        <input
          className="border rounded px-3 py-2 w-full max-w-sm bg-white"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 bg-white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {FURNITURE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading furniture...</p>}
      {loadError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{loadError}</p>
      )}

      {!loading && !loadError && (
        <>
          <table className="w-full bg-white rounded shadow text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Description</th>
                <th className="p-2">Size (L x W x H cm)</th>
                <th className="p-2">Base Price (KES)</th>
                <th className="p-2">Available</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f._id} className="border-t">
                  <td className="p-2">{f.name}</td>
                  <td className="p-2">{f.category}</td>
                  <td className="p-2">{f.description}</td>
                  <td className="p-2">
                    {f.dimensions.length} x {f.dimensions.width} x {f.dimensions.height}
                  </td>
                  <td className="p-2">{f.basePrice.toLocaleString()}</td>
                  <td className="p-2">
                    {f.isAvailable ? (
                      <span className="text-green-700 font-bold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-bold">No</span>
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {editable && (
                      <button
                        onClick={() => handleEditClick(f)}
                        className="text-amber-700 underline mr-3"
                      >
                        Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(f)}
                        className="text-red-600 underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-gray-500 mt-3">No furniture found.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Furniture
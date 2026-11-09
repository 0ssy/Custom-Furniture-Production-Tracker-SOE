import { useCallback, useEffect, useState } from 'react'
import type { ApiMaterial, MaterialInput } from '../types/material'
import { MATERIAL_CATEGORIES } from '../types/material'
import { apiFetch } from '../services/api'
import { extractList } from '../services/list'
import { useAuth } from '../context/AuthContext'
import { showMoney } from '../utils/money'
import MaterialForm from '../components/MaterialForm'

// A material is LOW when the stock is at or below its reorder level
function isLow(m: ApiMaterial) {
  return m.quantityInStock <= m.reorderLevel
}

function Materials() {
  // Only an Admin sees Delete, because the backend only lets Admins delete
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [materials, setMaterials] = useState<ApiMaterial[]>([])

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Search text, category filter, and the "low stock only" checkbox
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [lowOnly, setLowOnly] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ApiMaterial | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  // Gets all materials from the backend
  const loadMaterials = useCallback(async () => {
    try {
      const data = await apiFetch<unknown>('/materials')
      setMaterials(extractList<ApiMaterial>(data, 'materials'))
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load materials')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMaterials()
  }, [loadMaterials])

  // Number of low-stock materials, shown in the warning banner
  const lowCount = materials.filter(isLow).length

  // Keep only materials that match the search, the category AND the checkbox
  const filtered = materials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === '' || m.category === categoryFilter
    const matchesLow = !lowOnly || isLow(m)
    return matchesSearch && matchesCategory && matchesLow
  })

  function handleAddClick() {
    setEditing(null)
    setActionError('')
    setShowForm(true)
  }

  function handleEditClick(material: ApiMaterial) {
    setEditing(material)
    setActionError('')
    setShowForm(true)
  }

  // Called by the form when the data is valid.
  // POST creates a new material, PUT updates an existing one.
  async function handleSave(data: MaterialInput) {
    setSaving(true)
    setActionError('')
    try {
      if (editing) {
        await apiFetch(`/materials/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } else {
        await apiFetch('/materials', { method: 'POST', body: JSON.stringify(data) })
      }
      await loadMaterials()
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save the material')
    } finally {
      setSaving(false)
    }
  }

  // Admin only: delete a material after the user confirms
  async function handleDelete(material: ApiMaterial) {
    if (!window.confirm(`Delete "${material.name}"? This cannot be undone.`)) return
    setActionError('')
    try {
      await apiFetch(`/materials/${material._id}`, { method: 'DELETE' })
      await loadMaterials()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the material')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Materials Inventory</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Add Material
        </button>
      </div>

      {actionError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{actionError}</p>
      )}

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
          saving={saving}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
            setActionError('')
          }}
        />
      )}

      <div className="flex gap-4 items-center mb-4">
        <input
          className="border rounded px-3 py-2 w-full max-w-sm bg-white"
          placeholder="Search by material name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 bg-white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {MATERIAL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 whitespace-nowrap">
          <input
            type="checkbox"
            checked={lowOnly}
            onChange={(e) => setLowOnly(e.target.checked)}
          />
          Low stock only
        </label>
      </div>

      {loading && <p className="text-gray-500">Loading materials...</p>}
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
                <th className="p-2">In Stock</th>
                <th className="p-2">Reorder Level</th>
                <th className="p-2">Unit Cost (KES)</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m._id} className="border-t">
                  <td className="p-2">
                    {m.name}
                    <span className="block text-sm text-gray-500">{m.description}</span>
                  </td>
                  <td className="p-2">{m.category}</td>
                  {/* Stock with its unit, like "120 Pieces" */}
                  <td className="p-2">
                    {m.quantityInStock} {m.unit}
                  </td>
                  <td className="p-2">{m.reorderLevel}</td>
                  <td className="p-2">{showMoney(m.unitCost)}</td>
                  <td className="p-2">
                    {isLow(m) ? (
                      <span className="text-red-600 font-bold">Low stock</span>
                    ) : (
                      <span className="text-green-700">In stock</span>
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(m)}
                      className="text-amber-700 underline mr-3"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(m)}
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
            <p className="text-gray-500 mt-3">No materials found.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Materials
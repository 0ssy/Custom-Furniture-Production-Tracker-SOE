import { useCallback, useEffect, useState } from 'react'
import type { ApiCustomer } from '../types/customer'
import { apiFetch } from '../services/api'
import { extractList } from '../services/list'
import { useAuth } from '../context/AuthContext'
import { canEdit } from '../utils/permissions'
import CustomerForm from '../components/CustomerForm'

function Customers() {
  // Who is logged in. Only some roles may add or edit customers.
  const { user } = useAuth()
  const editable = canEdit(user?.role, 'customers')

  // The customers come from the database, so we start with an empty list
  const [customers, setCustomers] = useState<ApiCustomer[]>([])

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [search, setSearch] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ApiCustomer | null>(null)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Gets all customers from the backend ({ count, customers })
  const loadCustomers = useCallback(async () => {
    try {
      const data = await apiFetch<unknown>('/customers')
      setCustomers(extractList<ApiCustomer>(data, 'customers'))
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load customers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  // Keep only the customers that match the search (name or phone)
  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  function handleAddClick() {
    setEditing(null)
    setSaveError('')
    setShowForm(true)
  }

  function handleEditClick(customer: ApiCustomer) {
    setEditing(customer)
    setSaveError('')
    setShowForm(true)
  }

  // POST creates a new customer, PUT updates an existing one.
  async function handleSave(data: Omit<ApiCustomer, '_id' | 'createdAt'>) {
    setSaving(true)
    setSaveError('')
    try {
      if (editing) {
        await apiFetch(`/customers/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } else {
        await apiFetch('/customers', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      }
      await loadCustomers()
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save the customer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>
        {/* The Add button only shows to roles that may add customers */}
        {editable && (
          <button
            onClick={handleAddClick}
            className="bg-amber-600 text-white px-4 py-2 rounded"
          >
            + Add Customer
          </button>
        )}
      </div>

      {saveError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{saveError}</p>
      )}

      {showForm && (
        <CustomerForm
          key={editing?._id ?? 'new'}
          customer={editing}
          saving={saving}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
            setSaveError('')
          }}
        />
      )}

      <input
        className="border rounded px-3 py-2 mb-4 w-full max-w-sm bg-white"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-gray-500">Loading customers...</p>}
      {loadError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{loadError}</p>
      )}

      {!loading && !loadError && (
        <>
          <table className="w-full bg-white rounded shadow text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Email</th>
                <th className="p-2">Address</th>
                <th className="p-2">Registered</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-2">{c.fullName}</td>
                  <td className="p-2">{c.phone}</td>
                  <td className="p-2">{c.email}</td>
                  <td className="p-2">{c.address}</td>
                  <td className="p-2">{c.createdAt.slice(0, 10)}</td>
                  <td className="p-2">
                    {editable && (
                      <button
                        onClick={() => handleEditClick(c)}
                        className="text-amber-700 underline"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-gray-500 mt-3">No customers found.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Customers
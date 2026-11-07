import { useCallback, useEffect, useState } from 'react'
import type { ApiCustomer } from '../types/customer'
import { apiFetch } from '../services/api'
import CustomerForm from '../components/CustomerForm'

// The list endpoint may send a plain array or { customers: [...] }.
// We accept both, so it works whichever way Jose's controller answers.
type CustomersResponse = ApiCustomer[] | { customers: ApiCustomer[] }

function Customers() {
  // The customers now come from the database, so we start with an empty list
  const [customers, setCustomers] = useState<ApiCustomer[]>([])

  // true while the list is loading
  const [loading, setLoading] = useState(true)
  // error text if loading fails (empty when all is fine)
  const [loadError, setLoadError] = useState('')

  // Text typed in the search box
  const [search, setSearch] = useState('')

  // true = form visible, false = form hidden
  const [showForm, setShowForm] = useState(false)

  // Which customer are we editing? null means we are adding a new one.
  const [editing, setEditing] = useState<ApiCustomer | null>(null)

  // true while a save is in progress, and the error if the save fails
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Gets all customers from the backend and puts them in the list.
  // useCallback keeps the same function between renders, so useEffect
  // below only runs it once.
  const loadCustomers = useCallback(async () => {
    try {
      const data = await apiFetch<CustomersResponse>('/customers')
      setCustomers(Array.isArray(data) ? data : data.customers)
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load customers')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load the customers once, when the page opens
  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  // Keep only the customers that match the search (name or phone)
  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  // Open an empty form
  function handleAddClick() {
    setEditing(null)
    setSaveError('')
    setShowForm(true)
  }

  // Open the form with the chosen customer's details
  function handleEditClick(customer: ApiCustomer) {
    setEditing(customer)
    setSaveError('')
    setShowForm(true)
  }

  // Called by the form when the data is valid.
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
      // Get the fresh list from the database, then close the form
      await loadCustomers()
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      // For example a duplicate email: show the backend's message
      setSaveError(err instanceof Error ? err.message : 'Could not save the customer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Add Customer
        </button>
      </div>

      {/* Error from the backend when saving (red box above the form) */}
      {saveError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{saveError}</p>
      )}

      {/* The key resets the form when we switch between customers */}
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

      {/* Loading and error messages */}
      {loading && <p className="text-gray-500">Loading customers...</p>}
      {loadError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{loadError}</p>
      )}

      {/* The table only shows when loading is finished and there was no error */}
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
                  {/* createdAt looks like 2026-11-05T09:30:00.000Z,
                      so we keep only the first 10 characters (the date) */}
                  <td className="p-2">{c.createdAt.slice(0, 10)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="text-amber-700 underline"
                    >
                      Edit
                    </button>
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
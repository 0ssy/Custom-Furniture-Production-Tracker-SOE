import { useCallback, useEffect, useState } from 'react'
import type { ApiOrder, OrderFormData } from '../types/order'
import { ORDER_STATUSES } from '../types/order'
import type { ApiCustomer } from '../types/customer'
import type { ApiFurniture } from '../types/furniture'
import { apiFetch } from '../services/api'
import { extractList } from '../services/list'
import { useAuth } from '../context/AuthContext'
import OrderForm from '../components/OrderForm'

// Turns the items of an order into text like "Queen Bed x2, Office Chair x1"
function itemsText(order: ApiOrder) {
  return order.items
    .map((i) => `${i.furniture?.name ?? 'Deleted item'} x${i.quantity}`)
    .join(', ')
}

function Orders() {
  // Only an Admin sees Delete, because the backend only lets Admins delete
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  // Everything now comes from the database
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [customers, setCustomers] = useState<ApiCustomer[]>([])
  const [furniture, setFurniture] = useState<ApiFurniture[]>([])

  // true while loading, and the error text if loading fails
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Search text and status filter ('' means all statuses)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ApiOrder | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  // Gets orders, customers and furniture at the same time.
  // Promise.all waits until all three answers are back.
  const loadAll = useCallback(async () => {
    try {
      const [ordersData, customersData, furnitureData] = await Promise.all([
        apiFetch<unknown>('/orders'),
        apiFetch<unknown>('/customers'),
        apiFetch<unknown>('/furniture'),
      ])
      setOrders(extractList<ApiOrder>(ordersData, 'orders'))
      setCustomers(extractList<ApiCustomer>(customersData, 'customers'))
      setFurniture(extractList<ApiFurniture>(furnitureData, 'furniture'))
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load once, when the page opens
  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Only furniture marked as available can be ordered
  const availableFurniture = furniture.filter((f) => f.isAvailable)

  // Keep only orders that match BOTH the search and the status filter.
  // The search checks the customer's name OR the furniture names.
  const filtered = orders.filter((o) => {
    const text = search.toLowerCase()
    const matchesSearch =
      (o.customer?.fullName ?? '').toLowerCase().includes(text) ||
      itemsText(o).toLowerCase().includes(text)
    const matchesStatus = statusFilter === '' || o.orderStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  function handleAddClick() {
    setEditing(null)
    setActionError('')
    setShowForm(true)
  }

  function handleEditClick(order: ApiOrder) {
    setEditing(order)
    setActionError('')
    setShowForm(true)
  }

  // Called by the form when the data is valid.
  // Adding sends customer, items and date (the backend works out the total
  // and sets the status to Pending). Editing sends only status and date.
  async function handleSave(data: OrderFormData) {
    setSaving(true)
    setActionError('')
    try {
      if (editing) {
        await apiFetch(`/orders/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            orderStatus: data.orderStatus,
            expectedDeliveryDate: data.expectedDeliveryDate,
          }),
        })
      } else {
        await apiFetch('/orders', {
          method: 'POST',
          body: JSON.stringify({
            customer: data.customer,
            items: data.items,
            expectedDeliveryDate: data.expectedDeliveryDate,
          }),
        })
      }
      await loadAll()
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save the order')
    } finally {
      setSaving(false)
    }
  }

  // Admin only: delete an order after the user confirms
  async function handleDelete(order: ApiOrder) {
    const name = order.customer?.fullName ?? 'this customer'
    if (!window.confirm(`Delete the order of ${name}? This cannot be undone.`)) return
    setActionError('')
    try {
      await apiFetch(`/orders/${order._id}`, { method: 'DELETE' })
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the order')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Add Order
        </button>
      </div>

      {actionError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{actionError}</p>
      )}

      {/* The key resets the form when we switch between orders */}
      {showForm && (
        <OrderForm
          key={editing?._id ?? 'new'}
          order={editing}
          customers={customers}
          furniture={availableFurniture}
          saving={saving}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
            setActionError('')
          }}
        />
      )}

      {/* Search box and status filter side by side */}
      <div className="flex gap-3 mb-4">
        <input
          className="border rounded px-3 py-2 w-full max-w-sm bg-white"
          placeholder="Search by customer or furniture..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading orders...</p>}
      {loadError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{loadError}</p>
      )}

      {!loading && !loadError && (
        <>
          <table className="w-full bg-white rounded shadow text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Customer</th>
                <th className="p-2">Items</th>
                <th className="p-2">Total (KES)</th>
                <th className="p-2">Status</th>
                <th className="p-2">Order Date</th>
                <th className="p-2">Expected Delivery</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-2">{o.customer?.fullName ?? 'Unknown customer'}</td>
                  <td className="p-2">{itemsText(o)}</td>
                  <td className="p-2">{o.totalAmount.toLocaleString()}</td>
                  <td className="p-2">{o.orderStatus}</td>
                  {/* Dates look like 2026-11-07T09:30:00.000Z, so we keep 10 characters */}
                  <td className="p-2">{o.orderDate.slice(0, 10)}</td>
                  <td className="p-2">{o.expectedDeliveryDate.slice(0, 10)}</td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(o)}
                      className="text-amber-700 underline mr-3"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(o)}
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

          {filtered.length === 0 && <p className="text-gray-500 mt-3">No orders found.</p>}
        </>
      )}
    </div>
  )
}

export default Orders
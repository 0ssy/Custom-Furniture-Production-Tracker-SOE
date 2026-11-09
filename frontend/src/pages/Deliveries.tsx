import { useCallback, useEffect, useState } from 'react'
import type { ApiDelivery, DeliveryFormData } from '../types/delivery'
import { DELIVERY_STATUSES, getNextStatus } from '../types/delivery'
import type { ApiOrder } from '../types/order'
import { apiFetch } from '../services/api'
import { extractList } from '../services/list'
import { setOrderStatus } from '../services/orderStatus'
import { useAuth } from '../context/AuthContext'
import { orderLabel, refId } from '../utils/order'
import { getToday } from '../utils/date'
import DeliveryForm from '../components/DeliveryForm'

// Colour of the status label
function statusClass(status: string) {
  if (status === 'Delivered') return 'text-green-700 font-bold'
  if (status === 'In Transit') return 'text-amber-600 font-bold'
  if (status === 'Failed') return 'text-red-600 font-bold'
  return 'text-gray-700 font-bold' // Pending
}

function Deliveries() {
  // Only an Admin sees Delete, because the backend only lets Admins delete
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [deliveries, setDeliveries] = useState<ApiDelivery[]>([])
  const [orders, setOrders] = useState<ApiOrder[]>([])

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ApiDelivery | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  // Today's date as YYYY-MM-DD (see src/utils/date.ts)
  const today = getToday()

  // Gets deliveries and orders at the same time
  const loadAll = useCallback(async () => {
    try {
      const [deliveriesData, ordersData] = await Promise.all([
        apiFetch<unknown>('/deliveries'),
        apiFetch<unknown>('/orders'),
      ])
      setDeliveries(extractList<ApiDelivery>(deliveriesData, 'deliveries'))
      setOrders(extractList<ApiOrder>(ordersData, 'orders'))
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load deliveries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Readable text for the order of a delivery
  function getOrderText(delivery: ApiDelivery) {
    const order = orders.find((o) => o._id === refId(delivery.order))
    return order ? orderLabel(order) : 'Unknown order'
  }

  // Orders that can still be given a delivery:
  // no delivery yet, and not Cancelled or Delivered
  const availableOrders = orders.filter(
    (o) =>
      !deliveries.some((d) => refId(d.order) === o._id) &&
      o.orderStatus !== 'Cancelled' &&
      o.orderStatus !== 'Delivered'
  )

  // Keep only deliveries that match BOTH the search and the status filter
  const filtered = deliveries.filter((d) => {
    const text = search.toLowerCase()
    const matchesSearch =
      getOrderText(d).toLowerCase().includes(text) ||
      d.deliveryAddress.toLowerCase().includes(text)
    const matchesStatus = statusFilter === '' || d.deliveryStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // A delivery is overdue when its date has passed and it is not finished
  function isOverdue(d: ApiDelivery) {
    const notFinished = d.deliveryStatus === 'Pending' || d.deliveryStatus === 'In Transit'
    return notFinished && d.deliveryDate.slice(0, 10) < today
  }

  // When a delivery becomes Delivered, the order becomes Delivered too
  async function syncOrderDelivered(orderId: string) {
    try {
      await setOrderStatus(orderId, 'Delivered')
    } catch {
      setActionError('The delivery was saved, but the order status could not be changed to Delivered.')
    }
  }

  function handleAddClick() {
    setEditing(null)
    setActionError('')
    setShowForm(true)
  }

  function handleEditClick(delivery: ApiDelivery) {
    setEditing(delivery)
    setActionError('')
    setShowForm(true)
  }

  // Moves a delivery to the next status
  async function handleNextStatus(delivery: ApiDelivery) {
    const next = getNextStatus(delivery.deliveryStatus)
    if (next === null) return
    setActionError('')
    try {
      await apiFetch(`/deliveries/${delivery._id}`, {
        method: 'PUT',
        body: JSON.stringify({ deliveryStatus: next }),
      })
      if (next === 'Delivered') await syncOrderDelivered(refId(delivery.order))
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not change the status')
    }
  }

  // Called by the form when the data is valid
  async function handleSave(data: DeliveryFormData) {
    setSaving(true)
    setActionError('')
    try {
      if (editing) {
        await apiFetch(`/deliveries/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            deliveryAddress: data.deliveryAddress,
            deliveryDate: data.deliveryDate,
            deliveryStatus: data.deliveryStatus,
            notes: data.notes,
          }),
        })
        if (data.deliveryStatus === 'Delivered' && editing.deliveryStatus !== 'Delivered') {
          await syncOrderDelivered(refId(editing.order))
        }
      } else {
        await apiFetch('/deliveries', {
          method: 'POST',
          body: JSON.stringify({
            order: data.order,
            deliveryAddress: data.deliveryAddress,
            deliveryDate: data.deliveryDate,
            notes: data.notes || undefined,
          }),
        })
      }
      await loadAll()
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save the delivery')
    } finally {
      setSaving(false)
    }
  }

  // Admin only: delete a delivery after the user confirms
  async function handleDelete(delivery: ApiDelivery) {
    if (!window.confirm('Delete this delivery? This cannot be undone.')) return
    setActionError('')
    try {
      await apiFetch(`/deliveries/${delivery._id}`, { method: 'DELETE' })
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the delivery')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Deliveries</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Schedule Delivery
        </button>
      </div>

      {actionError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{actionError}</p>
      )}

      {/* The key resets the form when we switch between deliveries */}
      {showForm && (
        <DeliveryForm
          key={editing?._id ?? 'new'}
          delivery={editing}
          orders={availableOrders}
          orderText={editing ? getOrderText(editing) : ''}
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
          placeholder="Search by order or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {DELIVERY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading deliveries...</p>}
      {loadError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{loadError}</p>
      )}

      {!loading && !loadError && (
        <>
          <table className="w-full bg-white rounded shadow text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Address</th>
                <th className="p-2">Delivery Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Notes</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const next = getNextStatus(d.deliveryStatus)
                return (
                  <tr key={d._id} className="border-t">
                    <td className="p-2">{getOrderText(d)}</td>
                    <td className="p-2">{d.deliveryAddress}</td>
                    <td className="p-2">
                      {d.deliveryDate.slice(0, 10)}
                      {isOverdue(d) && (
                        <span className="text-red-600 font-bold ml-2">Overdue</span>
                      )}
                    </td>
                    <td className={`p-2 ${statusClass(d.deliveryStatus)}`}>
                      {d.deliveryStatus}
                    </td>
                    <td className="p-2">{d.notes || '-'}</td>
                    <td className="p-2 whitespace-nowrap">
                      {/* Disabled when there is no next step, or while this same
                          delivery is open in the form (so saving cannot undo it) */}
                      <button
                        onClick={() => handleNextStatus(d)}
                        disabled={next === null || editing?._id === d._id}
                        className="bg-amber-600 text-white px-2 py-1 rounded mr-2 disabled:bg-gray-300"
                      >
                        {next ? `Mark ${next}` : 'No next step'}
                      </button>
                      <button
                        onClick={() => handleEditClick(d)}
                        className="text-amber-700 underline mr-3"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(d)}
                          className="text-red-600 underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-gray-500 mt-3">No deliveries found.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Deliveries
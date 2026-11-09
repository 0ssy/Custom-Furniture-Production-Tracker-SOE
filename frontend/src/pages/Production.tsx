import { useCallback, useEffect, useState } from 'react'
import type { ApiProduction, ProductionFormData, ProductionStatus } from '../types/production'
import { PRODUCTION_STATUSES, getNextStatus, orderStatusFor } from '../types/production'
import type { ApiOrder } from '../types/order'
import { apiFetch } from '../services/api'
import { extractList } from '../services/list'
import { setOrderStatus } from '../services/orderStatus'
import { useAuth } from '../context/AuthContext'
import { orderLabel, refId } from '../utils/order'
import ProductionForm from '../components/ProductionForm'

// Colour of the status label
function statusClass(status: string) {
  if (status === 'Completed') return 'text-green-700 font-bold'
  if (status === 'In Progress') return 'text-amber-600 font-bold'
  if (status === 'On Hold') return 'text-red-600 font-bold'
  return 'text-gray-700 font-bold' // Not Started
}

function Production() {
  // Only an Admin sees Delete, because the backend only lets Admins delete
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [jobs, setJobs] = useState<ApiProduction[]>([])
  const [orders, setOrders] = useState<ApiOrder[]>([])

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ApiProduction | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  // Gets production jobs and orders at the same time
  const loadAll = useCallback(async () => {
    try {
      const [jobsData, ordersData] = await Promise.all([
        apiFetch<unknown>('/production'),
        apiFetch<unknown>('/orders'),
      ])
      setJobs(extractList<ApiProduction>(jobsData, 'production'))
      setOrders(extractList<ApiOrder>(ordersData, 'orders'))
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load production')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Readable text for the order of a job
  function getOrderText(job: ApiProduction) {
    const order = orders.find((o) => o._id === refId(job.order))
    return order ? orderLabel(order) : 'Unknown order'
  }

  // Orders that can still be assigned: no job yet, and not
  // Cancelled, Delivered or Completed (finished work needs no new job)
  const availableOrders = orders.filter(
    (o) =>
      !jobs.some((j) => refId(j.order) === o._id) &&
      o.orderStatus !== 'Cancelled' &&
      o.orderStatus !== 'Delivered' &&
      o.orderStatus !== 'Completed'
  )

  // Keep only jobs that match BOTH the search and the status filter
  const filtered = jobs.filter((j) => {
    const matchesSearch = getOrderText(j).toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === '' || j.productionStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // Keeps the order in step with its production job:
  // In Progress makes the order In Production, Completed makes it Completed.
  // Cancelled and Delivered orders are never changed.
  async function syncOrder(orderId: string, status: ProductionStatus) {
    const target = orderStatusFor(status)
    if (!target) return
    const order = orders.find((o) => o._id === orderId)
    if (
      !order ||
      order.orderStatus === 'Cancelled' ||
      order.orderStatus === 'Delivered' ||
      order.orderStatus === target
    ) {
      return
    }
    try {
      await setOrderStatus(orderId, target)
    } catch {
      setActionError('The job was saved, but the order status could not be updated.')
    }
  }

  function handleAddClick() {
    setEditing(null)
    setActionError('')
    setShowForm(true)
  }

  function handleEditClick(job: ApiProduction) {
    setEditing(job)
    setActionError('')
    setShowForm(true)
  }

  // Moves a job to its next status
  async function handleNextStatus(job: ApiProduction) {
    const next = getNextStatus(job.productionStatus)
    if (next === null) return
    setActionError('')
    try {
      await apiFetch(`/production/${job._id}`, {
        method: 'PUT',
        body: JSON.stringify({ productionStatus: next }),
      })
      await syncOrder(refId(job.order), next)
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not change the status')
    }
  }

  // Called by the form when the data is valid
  async function handleSave(data: ProductionFormData) {
    setSaving(true)
    setActionError('')
    try {
      if (editing) {
        await apiFetch(`/production/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            productionStatus: data.productionStatus,
            notes: data.notes,
          }),
        })
        if (data.productionStatus !== editing.productionStatus) {
          await syncOrder(refId(editing.order), data.productionStatus)
        }
      } else {
        await apiFetch('/production', {
          method: 'POST',
          body: JSON.stringify({ order: data.order, notes: data.notes || undefined }),
        })
      }
      await loadAll()
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save the job')
    } finally {
      setSaving(false)
    }
  }

  // Admin only: delete a job after the user confirms
  async function handleDelete(job: ApiProduction) {
    if (!window.confirm('Delete this production job? This cannot be undone.')) return
    setActionError('')
    try {
      await apiFetch(`/production/${job._id}`, { method: 'DELETE' })
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the job')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Production Tracking</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Assign Order
        </button>
      </div>

      {actionError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{actionError}</p>
      )}

      {/* One summary card for each status, with the number of jobs */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {PRODUCTION_STATUSES.map((s) => (
          <div key={s} className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">{s}</p>
            <p className="text-2xl font-bold">
              {jobs.filter((j) => j.productionStatus === s).length}
            </p>
          </div>
        ))}
      </div>

      {/* The key resets the form when we switch between jobs */}
      {showForm && (
        <ProductionForm
          key={editing?._id ?? 'new'}
          job={editing}
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
          {PRODUCTION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading production jobs...</p>}
      {loadError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{loadError}</p>
      )}

      {!loading && !loadError && (
        <>
          <table className="w-full bg-white rounded shadow text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Status</th>
                <th className="p-2">Started</th>
                <th className="p-2">Completed</th>
                <th className="p-2">Notes</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => {
                const next = getNextStatus(j.productionStatus)
                return (
                  <tr key={j._id} className="border-t">
                    <td className="p-2">{getOrderText(j)}</td>
                    <td className={`p-2 ${statusClass(j.productionStatus)}`}>
                      {j.productionStatus}
                    </td>
                    {/* Dates may be missing, so we show "-" when they are */}
                    <td className="p-2">{j.startDate ? j.startDate.slice(0, 10) : '-'}</td>
                    <td className="p-2">
                      {j.completionDate ? j.completionDate.slice(0, 10) : '-'}
                    </td>
                    <td className="p-2">{j.notes || '-'}</td>
                    <td className="p-2 whitespace-nowrap">
                      {/* Disabled when there is no next step, or while this same
                          job is open in the form (so saving cannot undo it) */}
                      <button
                        onClick={() => handleNextStatus(j)}
                        disabled={next === null || editing?._id === j._id}
                        className="bg-amber-600 text-white px-2 py-1 rounded mr-2 disabled:bg-gray-300"
                      >
                        {next ? `Move to ${next}` : 'Finished'}
                      </button>
                      <button
                        onClick={() => handleEditClick(j)}
                        className="text-amber-700 underline mr-3"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(j)}
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
            <p className="text-gray-500 mt-3">No production jobs found.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Production
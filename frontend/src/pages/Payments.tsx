import { useCallback, useEffect, useState } from 'react'
import type { ApiPayment, PaymentInput, PaymentRecordStatus } from '../types/payment'
import { BALANCE_STATUSES, getBalanceStatus } from '../types/payment'
import type { ApiOrder } from '../types/order'
import { apiFetch } from '../services/api'
import { extractList } from '../services/list'
import { useAuth } from '../context/AuthContext'
import { showMoney } from '../utils/money'
import { orderLabel, refId } from '../utils/order'
import { sumPayments } from '../utils/paymentMath'
import PaymentForm from '../components/PaymentForm'

// Which statuses a payment can move to from its current status
function nextStatuses(status: PaymentRecordStatus): PaymentRecordStatus[] {
  if (status === 'Pending') return ['Completed', 'Failed']
  if (status === 'Completed') return ['Refunded']
  return []
}

// Colour of the payment status label
function recordClass(status: PaymentRecordStatus) {
  if (status === 'Completed') return 'text-green-700 font-bold'
  if (status === 'Pending') return 'text-amber-600 font-bold'
  if (status === 'Failed') return 'text-red-600 font-bold'
  return 'text-gray-600 font-bold' // Refunded
}

// Colour of the order balance status label
function balanceClass(status: string) {
  if (status === 'Paid') return 'text-green-700 font-bold'
  if (status === 'Partial') return 'text-amber-600 font-bold'
  return 'text-red-600 font-bold'
}

function Payments() {
  // Only an Admin sees Delete, because the backend only lets Admins delete
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  // Everything comes from the database
  const [payments, setPayments] = useState<ApiPayment[]>([])
  const [orders, setOrders] = useState<ApiOrder[]>([])

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [showForm, setShowForm] = useState(false)
  // The order to pre-select when the form opens ('' means none)
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  // Gets payments and orders at the same time
  const loadAll = useCallback(async () => {
    try {
      const [paymentsData, ordersData] = await Promise.all([
        apiFetch<unknown>('/payments'),
        apiFetch<unknown>('/orders'),
      ])
      setPayments(extractList<ApiPayment>(paymentsData, 'payments'))
      setOrders(extractList<ApiOrder>(ordersData, 'orders'))
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load payments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Cancelled orders are left out, because nobody owes money for them
  const activeOrders = orders.filter((o) => o.orderStatus !== 'Cancelled')

  // Money really received for an order (Completed payments only)
  function getPaid(order: ApiOrder) {
    return sumPayments(payments, order._id, 'Completed')
  }

  // How much can still be recorded: total minus completed minus pending.
  // Pending money is counted so the same debt cannot be paid twice.
  function getPayable(orderId: string) {
    const order = activeOrders.find((o) => o._id === orderId)
    if (!order) return 0
    return (
      order.totalAmount -
      sumPayments(payments, order._id, 'Completed') -
      sumPayments(payments, order._id, 'Pending')
    )
  }

  // Totals for the three summary cards
  const totalBilled = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalReceived = activeOrders.reduce((sum, o) => sum + getPaid(o), 0)
  const totalOutstanding = totalBilled - totalReceived

  // Orders that can still receive a payment (for the form dropdown)
  const ordersWithRoom = activeOrders.filter((o) => getPayable(o._id) >= 0.01)

  // Every reference already used, in capital letters
  const existingReferences = payments
    .map((p) => (p.transactionReference ?? '').trim().toUpperCase())
    .filter((code) => code !== '')

  // Keep only orders that match BOTH the search and the status filter
  const filtered = activeOrders.filter((o) => {
    const matchesSearch = orderLabel(o).toLowerCase().includes(search.toLowerCase())
    const status = getBalanceStatus(o.totalAmount, getPaid(o))
    const matchesStatus = statusFilter === '' || status === statusFilter
    return matchesSearch && matchesStatus
  })

  // The history, newest first. [...payments] makes a copy so the real list is not changed.
  const history = [...payments].sort((a, b) => b.paymentDate.localeCompare(a.paymentDate))

  function handleAddClick() {
    setSelectedOrderId('')
    setActionError('')
    setShowForm(true)
  }

  // Opens the form with that order already chosen
  function handleRowClick(orderId: string) {
    setSelectedOrderId(orderId)
    setActionError('')
    setShowForm(true)
  }

  // Called by the form when the data is valid. The backend sets Pending.
  async function handleSave(data: PaymentInput) {
    setSaving(true)
    setActionError('')
    try {
      await apiFetch('/payments', { method: 'POST', body: JSON.stringify(data) })
      await loadAll()
      setShowForm(false)
      setSelectedOrderId('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not record the payment')
    } finally {
      setSaving(false)
    }
  }

  // Moves a payment to a new status (for example Pending to Completed)
  async function changeStatus(payment: ApiPayment, status: PaymentRecordStatus) {
    setActionError('')
    try {
      await apiFetch(`/payments/${payment._id}`, {
        method: 'PUT',
        body: JSON.stringify({ paymentStatus: status }),
      })
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not change the status')
    }
  }

  // Admin only: delete a payment after the user confirms
  async function handleDelete(payment: ApiPayment) {
    if (!window.confirm('Delete this payment? This cannot be undone.')) return
    setActionError('')
    try {
      await apiFetch(`/payments/${payment._id}`, { method: 'DELETE' })
      await loadAll()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the payment')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Payments</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Record Payment
        </button>
      </div>

      {actionError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{actionError}</p>
      )}

      {loading && <p className="text-gray-500">Loading payments...</p>}
      {loadError && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{loadError}</p>
      )}

      {!loading && !loadError && (
        <>
          {/* Three summary cards in a row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Total Billed (KES)</p>
              <p className="text-2xl font-bold">{showMoney(totalBilled)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Total Received (KES)</p>
              <p className="text-2xl font-bold">{showMoney(totalReceived)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Outstanding (KES)</p>
              <p className="text-2xl font-bold text-red-600">{showMoney(totalOutstanding)}</p>
            </div>
          </div>

          {/* The key resets the form when we switch between orders */}
          {showForm && (
            <PaymentForm
              key={selectedOrderId || 'new'}
              initialOrderId={selectedOrderId}
              orders={ordersWithRoom}
              getPayable={getPayable}
              existingReferences={existingReferences}
              saving={saving}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setSelectedOrderId('')
                setActionError('')
              }}
            />
          )}

          {/* Search box and balance status filter */}
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
              {BALANCE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Order balances table */}
          <h3 className="text-lg font-bold mb-2">Order Balances</h3>
          <table className="w-full bg-white rounded shadow text-left mb-2">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Total (KES)</th>
                <th className="p-2">Paid (KES)</th>
                <th className="p-2">Pending (KES)</th>
                <th className="p-2">Balance (KES)</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const paid = getPaid(o)
                const pending = sumPayments(payments, o._id, 'Pending')
                const status = getBalanceStatus(o.totalAmount, paid)
                return (
                  <tr key={o._id} className="border-t">
                    <td className="p-2">{orderLabel(o)}</td>
                    <td className="p-2">{showMoney(o.totalAmount)}</td>
                    <td className="p-2">{showMoney(paid)}</td>
                    <td className="p-2">{showMoney(pending)}</td>
                    <td className="p-2">{showMoney(o.totalAmount - paid)}</td>
                    <td className={`p-2 ${balanceClass(status)}`}>{status}</td>
                    <td className="p-2">
                      {/* Disabled when nothing more can be recorded */}
                      <button
                        onClick={() => handleRowClick(o._id)}
                        disabled={getPayable(o._id) < 0.01}
                        className="bg-amber-600 text-white px-2 py-1 rounded disabled:bg-gray-300"
                      >
                        Record Payment
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-gray-500 mb-4">No orders found.</p>}

          {/* Payment history table */}
          <h3 className="text-lg font-bold mt-6 mb-2">Payment History</h3>
          <table className="w-full bg-white rounded shadow text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Order</th>
                <th className="p-2">Amount (KES)</th>
                <th className="p-2">Method</th>
                <th className="p-2">Reference</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((p) => {
                const order = orders.find((o) => o._id === refId(p.order))
                return (
                  <tr key={p._id} className="border-t">
                    <td className="p-2">{p.paymentDate.slice(0, 10)}</td>
                    <td className="p-2">{order ? orderLabel(order) : 'Unknown order'}</td>
                    <td className="p-2">{showMoney(p.amount)}</td>
                    <td className="p-2">{p.paymentMethod}</td>
                    <td className="p-2">{p.transactionReference || '-'}</td>
                    <td className={`p-2 ${recordClass(p.paymentStatus)}`}>{p.paymentStatus}</td>
                    <td className="p-2 whitespace-nowrap">
                      {nextStatuses(p.paymentStatus).map((s) => (
                        <button
                          key={s}
                          onClick={() => changeStatus(p, s)}
                          className="bg-amber-600 text-white px-2 py-1 rounded mr-2"
                        >
                          Mark {s}
                        </button>
                      ))}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(p)}
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
          {history.length === 0 && (
            <p className="text-gray-500 mt-3">No payments recorded yet.</p>
          )}
        </>
      )}
    </div>
  )
}

export default Payments
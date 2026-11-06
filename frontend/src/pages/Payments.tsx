import { useState } from 'react'
import type { Payment } from '../types/payment'
import { PAYMENT_STATUSES, getPaymentStatus } from '../types/payment'
import { mockPayments } from '../data/mockPayments'
import { mockOrders } from '../data/mockOrders'
import { mockCustomers } from '../data/mockCustomers'
import { getToday } from '../utils/date'
import PaymentForm from '../components/PaymentForm'

// Rounds an amount to 2 decimals and adds commas, for showing on screen only.
// Rounding also removes errors like 0.30000000000000004.
// The checks (is anything still owed?) always use the exact numbers instead.
function showMoney(amount: number) {
  return (Math.round(amount * 100) / 100).toLocaleString()
}

function Payments() {
  // The payments shown in the history table. Starts with the fake data.
  const [payments, setPayments] = useState<Payment[]>(mockPayments)

  // NOTE: orders and customers are the original mock lists, so ones added
  // on the other pages will not show here until we use the real backend.
  // Cancelled orders are left out, because nobody owes money for them.
  const orders = mockOrders.filter((o) => o.status !== 'Cancelled')
  const customers = mockCustomers

  // Text typed in the search box
  const [search, setSearch] = useState('')

  // The payment status chosen in the filter. '' means show all.
  const [statusFilter, setStatusFilter] = useState('')

  // true = form visible, false = form hidden
  const [showForm, setShowForm] = useState(false)

  // The order to pre-select when the form opens ('' means none)
  const [selectedOrderId, setSelectedOrderId] = useState('')

  // Today's date as YYYY-MM-DD (see src/utils/date.ts)
  const today = getToday()

  // Builds readable text for an order, like "Mary Wanjiku - Wardrobe (x1)".
  // It finds the order, then the customer who made it.
  function getOrderLabel(orderId: string) {
    const order = orders.find((o) => o._id === orderId)
    if (!order) return 'Unknown order'
    const customer = customers.find((c) => c._id === order.customerId)
    const name = customer ? customer.name : 'Unknown customer'
    return `${name} - ${order.furnitureType} (x${order.quantity})`
  }

  // Adds up all the payments made for one order.
  // reduce goes through the list and keeps a running total (sum).
  function getPaid(orderId: string) {
    return payments
      .filter((p) => p.orderId === orderId)
      .reduce((sum, p) => sum + p.amount, 0)
  }

  // Exact balance: total price minus what was paid.
  // It is NOT rounded here, because rounding could hide a tiny amount
  // that is still owed. Rounding is done only when showing it (showMoney).
  function getBalance(orderId: string) {
    const order = orders.find((o) => o._id === orderId)
    if (!order) return 0
    return order.totalAmount - getPaid(orderId)
  }

  // Totals for the three summary cards at the top
  const totalBilled = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalReceived = orders.reduce((sum, o) => sum + getPaid(o._id), 0)
  const totalOutstanding = totalBilled - totalReceived

  // Orders that still owe money (used for the form dropdown)
  const ordersWithBalance = orders.filter((o) => getBalance(o._id) > 0)

  // All M-Pesa codes already recorded, in capital letters,
  // so "skl4f7g2qw" and "SKL4F7G2QW" count as the same code.
  const existingReferences = payments
    .filter((p) => p.method === 'M-Pesa')
    .map((p) => p.reference.toUpperCase())

  // Keep only the orders that match BOTH the search text and the status filter.
  // The search checks the customer's name OR the furniture type.
  const filtered = orders.filter((o) => {
    const text = search.toLowerCase()
    const matchesSearch = getOrderLabel(o._id).toLowerCase().includes(text)
    const status = getPaymentStatus(o.totalAmount, getPaid(o._id))
    // If no status is chosen, every order passes this check
    const matchesStatus = statusFilter === '' || status === statusFilter
    return matchesSearch && matchesStatus
  })

  // The history, newest payment first. [...payments] makes a copy,
  // so sorting does not change the real list.
  const history = [...payments].sort((a, b) =>
    b.paymentDate.localeCompare(a.paymentDate)
  )

  // Runs when "+ Record Payment" at the top is clicked: open an empty form
  function handleAddClick() {
    setSelectedOrderId('')
    setShowForm(true)
  }

  // Runs when "Record Payment" on a row is clicked: open the form
  // with that order already chosen
  function handleRowClick(orderId: string) {
    setSelectedOrderId(orderId)
    setShowForm(true)
  }

  // Called by the form when the data is valid and Save was clicked
  function handleSave(data: Omit<Payment, '_id'>) {
    // Make a new payment. randomUUID gives a unique fake id.
    // The real backend will make the _id later.
    const newPayment: Payment = { _id: crypto.randomUUID(), ...data }
    setPayments([...payments, newPayment])

    // Close the form after saving
    setShowForm(false)
    setSelectedOrderId('')
  }

  // Colour of the status label: green = paid, amber = partial, red = unpaid
  function statusClass(status: string) {
    if (status === 'Paid') return 'text-green-700 font-bold'
    if (status === 'Partial') return 'text-amber-600 font-bold'
    return 'text-red-600 font-bold'
  }

  return (
    <div>
      {/* Page title and the Record Payment button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Payments</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Record Payment
        </button>
      </div>

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
          <p className="text-2xl font-bold text-red-600">
            {showMoney(totalOutstanding)}
          </p>
        </div>
      </div>

      {/* The key resets the form when we switch between orders */}
      {showForm && (
        <PaymentForm
          key={selectedOrderId || 'new'}
          initialOrderId={selectedOrderId}
          availableOrders={ordersWithBalance}
          getOrderLabel={getOrderLabel}
          getBalance={getBalance}
          today={today}
          existingReferences={existingReferences}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setSelectedOrderId('')
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
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Order balances table */}
      <h3 className="text-lg font-bold mb-2">Order Balances</h3>
      <table className="w-full bg-white rounded shadow text-left mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Order</th>
            <th className="p-2">Total (KES)</th>
            <th className="p-2">Paid (KES)</th>
            <th className="p-2">Balance (KES)</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => {
            const paid = getPaid(o._id)
            const balance = getBalance(o._id)
            const status = getPaymentStatus(o.totalAmount, paid)
            return (
              <tr key={o._id} className="border-t">
                <td className="p-2">{getOrderLabel(o._id)}</td>
                <td className="p-2">{showMoney(o.totalAmount)}</td>
                <td className="p-2">{showMoney(paid)}</td>
                <td className="p-2">{showMoney(balance)}</td>
                <td className={`p-2 ${statusClass(status)}`}>{status}</td>
                <td className="p-2">
                  {/* Disabled when there is nothing left to pay.
                      This uses the exact balance, not the rounded one. */}
                  <button
                    onClick={() => handleRowClick(o._id)}
                    disabled={balance <= 0}
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

      {/* Message when nothing matches */}
      {filtered.length === 0 && (
        <p className="text-gray-500 -mt-4 mb-6">No orders found.</p>
      )}

      {/* Payment history table */}
      <h3 className="text-lg font-bold mb-2">Payment History</h3>
      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Order</th>
            <th className="p-2">Amount (KES)</th>
            <th className="p-2">Method</th>
            <th className="p-2">Reference</th>
          </tr>
        </thead>
        <tbody>
          {history.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.paymentDate}</td>
              <td className="p-2">{getOrderLabel(p.orderId)}</td>
              <td className="p-2">{showMoney(p.amount)}</td>
              <td className="p-2">{p.method}</td>
              <td className="p-2">{p.reference || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {history.length === 0 && (
        <p className="text-gray-500 mt-3">No payments recorded yet.</p>
      )}
    </div>
  )
}

export default Payments
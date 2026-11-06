import { useState } from 'react'
import type { Delivery } from '../types/delivery'
import { DELIVERY_STATUSES, getNextStatus } from '../types/delivery'
import { mockDeliveries } from '../data/mockDeliveries'
import { mockOrders } from '../data/mockOrders'
import { mockCustomers } from '../data/mockCustomers'
import { getToday } from '../utils/date'
import DeliveryForm from '../components/DeliveryForm'

function Deliveries() {
  // The deliveries shown in the table. Starts with the fake data.
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries)

  // NOTE: orders and customers are the original mock lists, so ones added
  // on the other pages will not show here until we use the real backend.
  const orders = mockOrders
  const customers = mockCustomers

  // Text typed in the search box
  const [search, setSearch] = useState('')

  // The status chosen in the filter. '' means show all.
  const [statusFilter, setStatusFilter] = useState('')

  // true = form visible, false = form hidden
  const [showForm, setShowForm] = useState(false)

  // Which delivery are we editing? null means we are scheduling a new one.
  const [editing, setEditing] = useState<Delivery | null>(null)

  // Today's date as YYYY-MM-DD (see src/utils/date.ts)
  const today = getToday()

  // Builds readable text for an order, like "Mary Wanjiku - Wardrobe (x1)".
  function getOrderLabel(orderId: string) {
    const order = orders.find((o) => o._id === orderId)
    if (!order) return 'Unknown order'
    const customer = customers.find((c) => c._id === order.customerId)
    const name = customer ? customer.name : 'Unknown customer'
    return `${name} - ${order.furnitureType} (x${order.quantity})`
  }

  // Finds the address of the customer who made the order
  function getOrderAddress(orderId: string) {
    const order = orders.find((o) => o._id === orderId)
    if (!order) return ''
    const customer = customers.find((c) => c._id === order.customerId)
    return customer ? customer.address : ''
  }

  // Orders that can still be given a delivery:
  // no delivery yet, and not Cancelled or Delivered.
  const availableOrders = orders.filter(
    (o) =>
      !deliveries.some((d) => d.order === o._id) &&
      o.status !== 'Cancelled' &&
      o.status !== 'Delivered'
  )

  // Keep only deliveries that match BOTH the search text and the status filter.
  // The search checks the order text OR the address.
  const filtered = deliveries.filter((d) => {
    const text = search.toLowerCase()
    const matchesSearch =
      getOrderLabel(d.order).toLowerCase().includes(text) ||
      d.deliveryAddress.toLowerCase().includes(text)
    const matchesStatus = statusFilter === '' || d.deliveryStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // A delivery is overdue when its date has passed and it is not finished
  function isOverdue(d: Delivery) {
    const notFinished = d.deliveryStatus === 'Pending' || d.deliveryStatus === 'In Transit'
    return notFinished && d.deliveryDate < today
  }

  // Colour of the status label
  function statusClass(status: string) {
    if (status === 'Delivered') return 'text-green-700 font-bold'
    if (status === 'In Transit') return 'text-amber-600 font-bold'
    if (status === 'Failed') return 'text-red-600 font-bold'
    return 'text-gray-700 font-bold' // Pending
  }

  // Runs when "+ Schedule Delivery" is clicked
  function handleAddClick() {
    setEditing(null)
    setShowForm(true)
  }

  // Runs when "Edit" is clicked
  function handleEditClick(delivery: Delivery) {
    setEditing(delivery)
    setShowForm(true)
  }

  // Runs when the status button is clicked: move to the next status
  function handleNextStatus(delivery: Delivery) {
    const next = getNextStatus(delivery.deliveryStatus)
    if (next === null) return // nothing after Delivered or Failed
    setDeliveries(
      deliveries.map((d) => (d._id === delivery._id ? { ...d, deliveryStatus: next } : d))
    )
  }

  // Called by the form when the data is valid and Save was clicked
  function handleSave(data: Omit<Delivery, '_id'>) {
    if (editing) {
      // EDIT: replace only the delivery we edited
      setDeliveries(deliveries.map((d) => (d._id === editing._id ? { ...d, ...data } : d)))
    } else {
      // SCHEDULE: make a new delivery with a unique fake id.
      // The real backend will make the _id later.
      setDeliveries([...deliveries, { _id: crypto.randomUUID(), ...data }])
    }
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      {/* Page title and the Schedule button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Deliveries</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Schedule Delivery
        </button>
      </div>

      {/* The key resets the form when we switch between deliveries.
          minDate is today for a new delivery, and '' (no limit) when editing. */}
      {showForm && (
        <DeliveryForm
          key={editing?._id ?? 'new'}
          delivery={editing}
          availableOrders={availableOrders}
          getOrderLabel={getOrderLabel}
          getOrderAddress={getOrderAddress}
          minDate={editing ? '' : today}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
        />
      )}

      {/* Search box and status filter side by side */}
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

      {/* Deliveries table */}
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
                <td className="p-2">{getOrderLabel(d.order)}</td>
                <td className="p-2">{d.deliveryAddress}</td>
                <td className="p-2">
                  {d.deliveryDate}
                  {/* Red label if the delivery is late */}
                  {isOverdue(d) && (
                    <span className="text-red-600 font-bold ml-2">Overdue</span>
                  )}
                </td>
                <td className={`p-2 ${statusClass(d.deliveryStatus)}`}>
                  {d.deliveryStatus}
                </td>
                <td className="p-2">{d.notes || '-'}</td>
                <td className="p-2 whitespace-nowrap">
                  {/* Moves to the next status. Disabled when there is no next
                      status, or while this same delivery is open in the form
                      (otherwise saving the form could undo the change). */}
                  <button
                    onClick={() => handleNextStatus(d)}
                    disabled={next === null || editing?._id === d._id}
                    className="bg-amber-600 text-white px-2 py-1 rounded mr-2 disabled:bg-gray-300"
                  >
                    {next ? `Mark ${next}` : 'No next step'}
                  </button>
                  <button
                    onClick={() => handleEditClick(d)}
                    className="text-amber-700 underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Message when nothing matches */}
      {filtered.length === 0 && (
        <p className="text-gray-500 mt-3">No deliveries found.</p>
      )}
    </div>
  )
}

export default Deliveries
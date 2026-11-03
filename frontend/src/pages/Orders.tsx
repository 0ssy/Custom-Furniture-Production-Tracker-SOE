import { useState } from 'react'
import type { Order } from '../types/order'
import { ORDER_STATUSES } from '../types/order'
import { mockOrders } from '../data/mockOrders'
import { mockCustomers } from '../data/mockCustomers'
import OrderForm from '../components/OrderForm'

function Orders() {
  // The list of orders shown in the table. Starts with the fake data.
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  // The customers used for the dropdown and to show names in the table.
  // NOTE: this is the original mock list, so customers added on the
  // Customers page will not show here until we use the real backend.
  const customers = mockCustomers

  // Text typed in the search box
  const [search, setSearch] = useState('')

  // The status chosen in the filter. '' means show all statuses.
  const [statusFilter, setStatusFilter] = useState('')

  // true = form visible, false = form hidden
  const [showForm, setShowForm] = useState(false)

  // Which order are we editing? null means we are adding a new one.
  const [editing, setEditing] = useState<Order | null>(null)

  // An order only stores the customerId, so this finds the customer's name.
  // If the customer is not found we show "Unknown".
  function getCustomerName(customerId: string) {
    const customer = customers.find((c) => c._id === customerId)
    return customer ? customer.name : 'Unknown'
  }

  // Keep only the orders that match BOTH the search text and the status filter.
  // The search checks the customer's name OR the furniture type.
  const filtered = orders.filter((o) => {
    const text = search.toLowerCase()
    const matchesSearch =
      getCustomerName(o.customerId).toLowerCase().includes(text) ||
      o.furnitureType.toLowerCase().includes(text)
    // If no status is chosen, every order passes this check
    const matchesStatus = statusFilter === '' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Runs when "+ Add Order" is clicked: open an empty form
  function handleAddClick() {
    setEditing(null)
    setShowForm(true)
  }

  // Runs when "Edit" is clicked: open the form with that order's details
  function handleEditClick(order: Order) {
    setEditing(order)
    setShowForm(true)
  }

  // Called by the form when the data is valid and Save was clicked
  function handleSave(data: Omit<Order, '_id' | 'createdAt'>) {
    if (editing) {
      // EDIT: go through the list. For the order we edited, copy the old
      // order and replace it with the new data. Other orders stay the same.
      setOrders(orders.map((o) => (o._id === editing._id ? { ...o, ...data } : o)))
    } else {
      // ADD: make a new order. randomUUID gives a unique fake id.
      // The real backend will make the _id later.
      const newOrder: Order = {
        _id: crypto.randomUUID(),
        ...data,
        // today's date as YYYY-MM-DD in the computer's own timezone
        createdAt: new Date().toLocaleDateString('en-CA'),
      }
      setOrders([...orders, newOrder])
    }

    // Close the form after saving
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      {/* Page title and the Add button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Add Order
        </button>
      </div>

      {/* The form only shows when showForm is true.
          The key resets the form when we switch between orders. */}
      {showForm && (
        <OrderForm
          key={editing?._id ?? 'new'}
          order={editing}
          customers={customers}
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

      {/* Orders table */}
      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Customer</th>
            <th className="p-2">Furniture</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Total (KES)</th>
            <th className="p-2">Specifications</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* One row for each order that passed the search and filter */}
          {filtered.map((o) => (
            <tr key={o._id} className="border-t">
              <td className="p-2">{getCustomerName(o.customerId)}</td>
              <td className="p-2">{o.furnitureType}</td>
              <td className="p-2">{o.quantity}</td>
              {/* toLocaleString adds commas, so 45000 shows as 45,000 */}
              <td className="p-2">{o.totalAmount.toLocaleString()}</td>
              <td className="p-2">{o.specifications || '-'}</td>
              <td className="p-2">{o.status}</td>
              <td className="p-2">{o.createdAt}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEditClick(o)}
                  className="text-amber-700 underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Message when nothing matches */}
      {filtered.length === 0 && (
        <p className="text-gray-500 mt-3">No orders found.</p>
      )}
    </div>
  )
}

export default Orders
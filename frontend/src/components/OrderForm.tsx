import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ApiOrder, OrderFormData, OrderStatus } from '../types/order'
import { ORDER_STATUSES } from '../types/order'
import type { ApiCustomer } from '../types/customer'
import type { ApiFurniture } from '../types/furniture'
import { getToday } from '../utils/date'

// Props are the things the parent page (Orders.tsx) gives to this form.
// order:     if it has an order we are EDITING, if null we are ADDING.
// customers: used to fill the customer dropdown.
// furniture: the available furniture, used to fill the item dropdowns.
// saving:    true while the backend is busy.
type Props = {
  order: ApiOrder | null
  customers: ApiCustomer[]
  furniture: ApiFurniture[]
  saving: boolean
  onSave: (data: OrderFormData) => void
  onCancel: () => void
}

// One line of the order while the user is typing.
// Numbers are kept as text until we save. "key" lets React tell the rows apart.
type Row = {
  key: number
  furniture: string
  quantity: string
  unitPrice: string
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  customer?: string
  date?: string
}

// True if the text is a real number above 0 (rejects NaN and Infinity)
function isPositive(text: string) {
  const n = Number(text)
  return text.trim() !== '' && Number.isFinite(n) && n > 0
}

function OrderForm({ order, customers, furniture, saving, onSave, onCancel }: Props) {
  // Used when ADDING: the chosen customer and the item rows
  const [customerId, setCustomerId] = useState('')
  const [rows, setRows] = useState<Row[]>([
    { key: 1, furniture: '', quantity: '1', unitPrice: '' },
  ])
  // The key to give the next row we add
  const [nextKey, setNextKey] = useState(2)

  // Used for both: the delivery date (first 10 characters of the date text)
  // and the status. A new order always starts as Pending.
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    order ? order.expectedDeliveryDate.slice(0, 10) : ''
  )
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    order?.orderStatus ?? 'Pending'
  )

  // Error messages. "rowErrors" is keyed by the row's key.
  const [errors, setErrors] = useState<FormErrors>({})
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({})

  // Changes one row. Example: updateRow(2, { quantity: '3' })
  function updateRow(key: number, changes: Partial<Row>) {
    setRows(rows.map((r) => (r.key === key ? { ...r, ...changes } : r)))
  }

  // When furniture is chosen, fill the unit price with its base price
  function handleFurnitureChange(key: number, furnitureId: string) {
    const item = furniture.find((f) => f._id === furnitureId)
    updateRow(key, {
      furniture: furnitureId,
      unitPrice: item ? String(item.basePrice) : '',
    })
  }

  function addRow() {
    setRows([...rows, { key: nextKey, furniture: '', quantity: '1', unitPrice: '' }])
    setNextKey(nextKey + 1)
  }

  function removeRow(key: number) {
    setRows(rows.filter((r) => r.key !== key))
  }

  // Live total shown to the user. The backend calculates the real one.
  const total = rows.reduce((sum, r) => {
    const q = Number(r.quantity)
    const p = Number(r.unitPrice)
    return Number.isFinite(q) && Number.isFinite(p) ? sum + q * p : sum
  }, 0)

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}
    const newRowErrors: Record<number, string> = {}
    const today = getToday()

    if (!order) {
      if (customerId === '') newErrors.customer = 'Please choose a customer'

      // Check every item row
      for (const r of rows) {
        const q = Number(r.quantity)
        if (r.furniture === '') {
          newRowErrors[r.key] = 'Please choose a furniture item'
        } else if (r.quantity.trim() === '' || !Number.isInteger(q) || q < 1) {
          newRowErrors[r.key] = 'Quantity must be a whole number of 1 or more'
        } else if (!isPositive(r.unitPrice)) {
          newRowErrors[r.key] = 'Unit price must be a number above 0'
        }
      }
    }

    // Dates like 2026-11-10 can be compared as plain text
    // because the year comes first, then the month, then the day.
    if (expectedDeliveryDate === '') {
      newErrors.date = 'Expected delivery date is required'
    } else if (!order && expectedDeliveryDate <= today) {
      // The backend rejects a date that is not in the future
      newErrors.date = 'Delivery date must be after today'
    } else if (order && expectedDeliveryDate <= order.orderDate.slice(0, 10)) {
      newErrors.date = 'Delivery date must be after the order date'
    }

    setErrors(newErrors)
    setRowErrors(newRowErrors)
    return (
      Object.keys(newErrors).length === 0 && Object.keys(newRowErrors).length === 0
    )
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

    onSave({
      customer: customerId,
      items: rows.map((r) => ({
        furniture: r.furniture,
        quantity: Number(r.quantity),
        unitPrice: Number(r.unitPrice),
      })),
      expectedDeliveryDate,
      orderStatus,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">{order ? 'Edit Order' : 'Add Order'}</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Customer: dropdown when adding, plain text when editing */}
        <div>
          <label className="block text-sm mb-1">Customer *</label>
          {order ? (
            <p className="border rounded px-2 py-1 bg-gray-100">
              {order.customer?.fullName ?? 'Unknown customer'}
            </p>
          ) : (
            <select
              className="w-full border rounded px-2 py-1"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">-- Choose customer --</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.fullName}
                </option>
              ))}
            </select>
          )}
          {errors.customer && <p className="text-red-600 text-sm">{errors.customer}</p>}
        </div>

        {/* Expected delivery date. type="date" shows a calendar picker */}
        <div>
          <label className="block text-sm mb-1">Expected Delivery Date *</label>
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={expectedDeliveryDate}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
          />
          {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
        </div>

        {/* Status: only when editing. New orders always start as Pending. */}
        {order && (
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Items */}
      <h4 className="font-bold mt-4 mb-2">Items</h4>

      {order ? (
        // Editing: the items cannot be changed, so we only list them
        <ul className="list-disc ml-6 mb-2">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.furniture?.name ?? 'Deleted item'} x{item.quantity} at{' '}
              {item.unitPrice.toLocaleString()} each
            </li>
          ))}
        </ul>
      ) : (
        <>
          {rows.map((r) => (
            <div key={r.key} className="mb-3">
              <div className="grid grid-cols-12 gap-2 items-center">
                <select
                  className="col-span-6 border rounded px-2 py-1"
                  value={r.furniture}
                  onChange={(e) => handleFurnitureChange(r.key, e.target.value)}
                >
                  <option value="">-- Choose furniture --</option>
                  {furniture.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.basePrice.toLocaleString()})
                    </option>
                  ))}
                </select>
                <input
                  className="col-span-2 border rounded px-2 py-1"
                  placeholder="Qty"
                  value={r.quantity}
                  onChange={(e) => updateRow(r.key, { quantity: e.target.value })}
                />
                <input
                  className="col-span-3 border rounded px-2 py-1"
                  placeholder="Unit price"
                  value={r.unitPrice}
                  onChange={(e) => updateRow(r.key, { unitPrice: e.target.value })}
                />
                {/* An order needs at least one item, so the last row cannot be removed */}
                <button
                  type="button"
                  onClick={() => removeRow(r.key)}
                  disabled={rows.length === 1}
                  className="col-span-1 text-red-600 disabled:text-gray-300"
                >
                  X
                </button>
              </div>
              {rowErrors[r.key] && (
                <p className="text-red-600 text-sm">{rowErrors[r.key]}</p>
              )}
            </div>
          ))}

          <button type="button" onClick={addRow} className="text-amber-700 underline">
            + Add another item
          </button>
          <p className="mt-2 font-bold">Total: KES {total.toLocaleString()}</p>
        </>
      )}

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-1 rounded disabled:bg-gray-300"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {/* type="button" so Cancel does NOT submit the form */}
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default OrderForm
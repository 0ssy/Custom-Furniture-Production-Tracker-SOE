import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ApiDelivery, DeliveryFormData, DeliveryStatus } from '../types/delivery'
import { DELIVERY_STATUSES } from '../types/delivery'
import type { ApiOrder } from '../types/order'
import { orderLabel } from '../utils/order'
import { getToday } from '../utils/date'

// Props are the things the parent page (Deliveries.tsx) gives to this form.
// delivery:     if it has a delivery we are EDITING, if null we are SCHEDULING.
// orders:       orders that can still get a delivery (for the dropdown).
// orderText:    readable text of the order of the delivery being edited.
// saving:       true while the backend is busy.
type Props = {
  delivery: ApiDelivery | null
  orders: ApiOrder[]
  orderText: string
  saving: boolean
  onSave: (data: DeliveryFormData) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  order?: string
  address?: string
  date?: string
}

function DeliveryForm({ delivery, orders, orderText, saving, onSave, onCancel }: Props) {
  // One state for each input. When editing we start with the current values.
  const [order, setOrder] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState(delivery?.deliveryAddress ?? '')
  // The date text looks like 2026-11-10T00:00:00.000Z, so we keep 10 characters
  const [deliveryDate, setDeliveryDate] = useState(
    delivery ? delivery.deliveryDate.slice(0, 10) : ''
  )
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(
    delivery?.deliveryStatus ?? 'Pending'
  )
  const [notes, setNotes] = useState(delivery?.notes ?? '')

  const [errors, setErrors] = useState<FormErrors>({})

  // When an order is chosen, fill the address with the customer's address
  // if the address box is still empty
  function handleOrderChange(orderId: string) {
    setOrder(orderId)
    if (deliveryAddress.trim() === '' && orderId !== '') {
      const chosen = orders.find((o) => o._id === orderId)
      setDeliveryAddress(chosen?.customer?.address ?? '')
    }
  }

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    // A new delivery needs an order (when editing the order cannot change)
    if (!delivery && order === '') newErrors.order = 'Please choose an order'

    if (deliveryAddress.trim().length < 3) {
      newErrors.address = 'Delivery address must be at least 3 characters'
    }

    // Dates like 2026-11-10 can be compared as plain text
    // because the year comes first, then the month, then the day.
    if (deliveryDate === '') {
      newErrors.date = 'Delivery date is required'
    } else if (!delivery && deliveryDate < getToday()) {
      newErrors.date = 'Delivery date cannot be in the past'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return

    onSave({
      order,
      deliveryAddress: deliveryAddress.trim(),
      deliveryDate,
      deliveryStatus,
      notes: notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">
        {delivery ? 'Update Delivery' : 'Schedule Delivery'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Order: a dropdown when scheduling, plain text when editing */}
        <div>
          <label className="block text-sm mb-1">Order *</label>
          {delivery ? (
            <p className="border rounded px-2 py-1 bg-gray-100">{orderText}</p>
          ) : (
            <select
              className="w-full border rounded px-2 py-1"
              value={order}
              onChange={(e) => handleOrderChange(e.target.value)}
            >
              <option value="">-- Choose order --</option>
              {orders.map((o) => (
                <option key={o._id} value={o._id}>
                  {orderLabel(o)}
                </option>
              ))}
            </select>
          )}
          {errors.order && <p className="text-red-600 text-sm">{errors.order}</p>}
        </div>

        {/* Status: only when editing. New deliveries start as Pending. */}
        {delivery && (
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value as DeliveryStatus)}
            >
              {DELIVERY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Delivery Address *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
          {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Delivery Date *</label>
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
          {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm mb-1">Notes</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Any delivery instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-1 rounded disabled:bg-gray-300"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
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

export default DeliveryForm
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Delivery, DeliveryStatus } from '../types/delivery'
import { DELIVERY_STATUSES } from '../types/delivery'
import type { Order } from '../types/order'

// Props are the things the parent page (Deliveries.tsx) gives to this form.
// delivery:        if it has a delivery we are EDITING, if null we are SCHEDULING.
// availableOrders: orders that can still get a delivery (for the dropdown).
// getOrderLabel:   turns an order id into text like "Mary Wanjiku - Wardrobe (x1)".
// getOrderAddress: gives the customer's address, used to fill the address box.
// minDate:         earliest allowed date. '' means no limit (used when editing).
type Props = {
  delivery: Delivery | null
  availableOrders: Order[]
  getOrderLabel: (orderId: string) => string
  getOrderAddress: (orderId: string) => string
  minDate: string
  onSave: (data: Omit<Delivery, '_id'>) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  order?: string
  deliveryAddress?: string
  deliveryDate?: string
}

function DeliveryForm({
  delivery,
  availableOrders,
  getOrderLabel,
  getOrderAddress,
  minDate,
  onSave,
  onCancel,
}: Props) {
  // One state for each input. When editing we start with the delivery's
  // current values, when scheduling we start empty.
  const [order, setOrder] = useState(delivery?.order ?? '')
  const [deliveryAddress, setDeliveryAddress] = useState(delivery?.deliveryAddress ?? '')
  const [deliveryDate, setDeliveryDate] = useState(delivery?.deliveryDate ?? '')
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(
    delivery?.deliveryStatus ?? 'Pending'
  )
  const [notes, setNotes] = useState(delivery?.notes ?? '')

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Runs when a different order is chosen in the dropdown.
  // If the address box is still empty, we fill it with the customer's address.
  function handleOrderChange(orderId: string) {
    setOrder(orderId)
    if (deliveryAddress.trim() === '' && orderId !== '') {
      setDeliveryAddress(getOrderAddress(orderId))
    }
  }

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    // When scheduling a new delivery an order must be chosen.
    // (When editing, the order cannot be changed.)
    if (!delivery && order === '') {
      newErrors.order = 'Please choose an order'
    }

    // The address is required. trim() makes "   " count as empty.
    if (deliveryAddress.trim() === '') {
      newErrors.deliveryAddress = 'Delivery address is required'
    }

    // The date is required. For a new delivery it cannot be in the past.
    // Dates like 2026-11-10 can be compared as plain text
    // because the year comes first, then the month, then the day.
    if (deliveryDate === '') {
      newErrors.deliveryDate = 'Delivery date is required'
    } else if (minDate !== '' && deliveryDate < minDate) {
      newErrors.deliveryDate = 'Delivery date cannot be in the past'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

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
            <p className="border rounded px-2 py-1 bg-gray-100">
              {getOrderLabel(delivery.order)}
            </p>
          ) : (
            <select
              className="w-full border rounded px-2 py-1"
              value={order}
              onChange={(e) => handleOrderChange(e.target.value)}
            >
              <option value="">-- Choose order --</option>
              {availableOrders.map((o) => (
                <option key={o._id} value={o._id}>
                  {getOrderLabel(o._id)}
                </option>
              ))}
            </select>
          )}
          {errors.order && <p className="text-red-600 text-sm">{errors.order}</p>}
        </div>

        {/* Status dropdown */}
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

        {/* Delivery address */}
        <div>
          <label className="block text-sm mb-1">Delivery Address *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
          {errors.deliveryAddress && (
            <p className="text-red-600 text-sm">{errors.deliveryAddress}</p>
          )}
        </div>

        {/* Delivery date. type="date" shows a calendar picker */}
        <div>
          <label className="block text-sm mb-1">Delivery Date *</label>
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
          {errors.deliveryDate && (
            <p className="text-red-600 text-sm">{errors.deliveryDate}</p>
          )}
        </div>

        {/* Notes (optional) */}
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

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-amber-600 text-white px-4 py-1 rounded">
          Save
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

export default DeliveryForm
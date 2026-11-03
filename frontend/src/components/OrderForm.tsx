import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Order, OrderStatus } from '../types/order'
import { ORDER_STATUSES } from '../types/order'
import type { Customer } from '../types/customer'

// The furniture types shown in the dropdown.
const FURNITURE_TYPES = [
  'Wardrobe',
  'Bed',
  'Sofa',
  'Dining Table',
  'Chair',
  'Cabinet',
  'Other',
]

// Props are the things the parent page (Orders.tsx) gives to this form.
// order:     if it has an order we are EDITING, if null we are ADDING.
// customers: the list used to fill the customer dropdown.
// onSave:    runs when the form is valid and Save is clicked.
//            It gets the data without _id and createdAt (the system makes those).
// onCancel:  runs when Cancel is clicked.
type Props = {
  order: Order | null
  customers: Customer[]
  onSave: (data: Omit<Order, '_id' | 'createdAt'>) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional
// because most of the time there is no error.
type FormErrors = {
  customerId?: string
  furnitureType?: string
  quantity?: string
  totalAmount?: string
}

function OrderForm({ order, customers, onSave, onCancel }: Props) {
  // One state for each input. When editing we start with the order's
  // current values, when adding we start empty (or with a default).
  const [customerId, setCustomerId] = useState(order?.customerId ?? '')
  const [furnitureType, setFurnitureType] = useState(order?.furnitureType ?? '')
  // quantity and totalAmount are kept as text while typing,
  // and changed into numbers only when saving.
  const [quantity, setQuantity] = useState(order ? String(order.quantity) : '1')
  const [totalAmount, setTotalAmount] = useState(
    order ? String(order.totalAmount) : ''
  )
  const [specifications, setSpecifications] = useState(order?.specifications ?? '')
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? 'Pending')

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    // A customer must be chosen
    if (customerId === '') {
      newErrors.customerId = 'Please choose a customer'
    }

    // A furniture type must be chosen
    if (furnitureType === '') {
      newErrors.furnitureType = 'Please choose a furniture type'
    }

    // Quantity must be a whole number of 1 or more.
    // Number.isInteger checks there is no decimal like 1.5
    const qty = Number(quantity)
    if (quantity.trim() === '' || !Number.isInteger(qty) || qty < 1) {
      newErrors.quantity = 'Quantity must be a whole number of 1 or more'
    }

    // Total amount must be a number bigger than 0
    const amount = Number(totalAmount)
    if (totalAmount.trim() === '' || isNaN(amount) || amount <= 0) {
      newErrors.totalAmount = 'Amount must be a number greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

    // Everything is fine. Change the text into real numbers
    // and send the data to the parent page.
    onSave({
      customerId,
      furnitureType,
      quantity: Number(quantity),
      totalAmount: Number(totalAmount),
      specifications: specifications.trim(),
      status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      {/* Title changes depending on whether we are editing or adding */}
      <h3 className="text-lg font-bold mb-3">
        {order ? 'Edit Order' : 'Add Order'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Customer dropdown */}
        <div>
          <label className="block text-sm mb-1">Customer *</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">-- Choose customer --</option>
            {/* One option for each customer. value is the id, text is the name */}
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="text-red-600 text-sm">{errors.customerId}</p>
          )}
        </div>

        {/* Furniture type dropdown */}
        <div>
          <label className="block text-sm mb-1">Furniture Type *</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={furnitureType}
            onChange={(e) => setFurnitureType(e.target.value)}
          >
            <option value="">-- Choose type --</option>
            {FURNITURE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.furnitureType && (
            <p className="text-red-600 text-sm">{errors.furnitureType}</p>
          )}
        </div>

        {/* Quantity input */}
        <div>
          <label className="block text-sm mb-1">Quantity *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {errors.quantity && (
            <p className="text-red-600 text-sm">{errors.quantity}</p>
          )}
        </div>

        {/* Total amount input */}
        <div>
          <label className="block text-sm mb-1">Total Amount (KES) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
          {errors.totalAmount && (
            <p className="text-red-600 text-sm">{errors.totalAmount}</p>
          )}
        </div>

        {/* Status dropdown, filled from the list in types/order.ts */}
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Specifications input (optional) */}
        <div>
          <label className="block text-sm mb-1">Specifications</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Size, colour, material..."
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        {/* type="submit" makes this button trigger handleSubmit */}
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

export default OrderForm
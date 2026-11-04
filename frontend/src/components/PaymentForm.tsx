import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Payment, PaymentMethod } from '../types/payment'
import { PAYMENT_METHODS } from '../types/payment'
import type { Order } from '../types/order'

// Props are the things the parent page (Payments.tsx) gives to this form.
// initialOrderId:  order to pre-select ('' means none chosen yet).
// availableOrders: orders that still have a balance (used for the dropdown).
// getOrderLabel:   turns an order id into text like "Mary Wanjiku - Wardrobe (x1)".
// getBalance:      gives how much is still owed on an order.
// today:           today's date. A payment cannot be dated in the future.
// onSave:          runs when the form is valid. It gets the data without _id.
// onCancel:        runs when Cancel is clicked.
type Props = {
  initialOrderId: string
  availableOrders: Order[]
  getOrderLabel: (orderId: string) => string
  getBalance: (orderId: string) => number
  today: string
  onSave: (data: Omit<Payment, '_id'>) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  orderId?: string
  amount?: string
  reference?: string
  paymentDate?: string
}

function PaymentForm({
  initialOrderId,
  availableOrders,
  getOrderLabel,
  getBalance,
  today,
  onSave,
  onCancel,
}: Props) {
  // One state for each input.
  // amount is kept as text while typing and changed to a number on save.
  const [orderId, setOrderId] = useState(initialOrderId)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('Cash')
  const [reference, setReference] = useState('')
  const [paymentDate, setPaymentDate] = useState(today) // starts as today

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    // An order must be chosen
    if (orderId === '') {
      newErrors.orderId = 'Please choose an order'
    }

    // Amount must be a real number above 0.
    // Number.isFinite rejects NaN and Infinity (like typing 1e999).
    const amountNumber = Number(amount)
    if (amount.trim() === '' || !Number.isFinite(amountNumber) || amountNumber <= 0) {
      newErrors.amount = 'Amount must be a number greater than 0'
    } else if (orderId !== '' && amountNumber > getBalance(orderId)) {
      // The customer cannot pay more than what is still owed
      newErrors.amount = `Amount cannot be more than the balance (${getBalance(
        orderId
      ).toLocaleString()})`
    }

    // M-Pesa payments must have the M-Pesa code
    if (method === 'M-Pesa' && reference.trim() === '') {
      newErrors.reference = 'Please enter the M-Pesa code'
    }

    // The date is required and cannot be in the future.
    // Dates written like 2026-11-03 can be compared as plain text,
    // because the year comes first, then the month, then the day.
    if (paymentDate === '') {
      newErrors.paymentDate = 'Payment date is required'
    } else if (paymentDate > today) {
      newErrors.paymentDate = 'Payment date cannot be in the future'
    }

    setErrors(newErrors)
    // If newErrors has no keys, nothing is wrong
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

    onSave({
      orderId,
      amount: Number(amount),
      method,
      reference: reference.trim(),
      paymentDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">Record Payment</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Order dropdown */}
        <div>
          <label className="block text-sm mb-1">Order *</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          >
            <option value="">-- Choose order --</option>
            {/* Only orders that still owe money are listed */}
            {availableOrders.map((o) => (
              <option key={o._id} value={o._id}>
                {getOrderLabel(o._id)}
              </option>
            ))}
          </select>
          {/* Show how much is still owed once an order is chosen */}
          {orderId !== '' && (
            <p className="text-sm text-gray-600">
              Balance: KES {getBalance(orderId).toLocaleString()}
            </p>
          )}
          {errors.orderId && <p className="text-red-600 text-sm">{errors.orderId}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm mb-1">Amount (KES) *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
        </div>

        {/* Payment method dropdown */}
        <div>
          <label className="block text-sm mb-1">Method</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Reference (required for M-Pesa) */}
        <div>
          <label className="block text-sm mb-1">
            Reference {method === 'M-Pesa' ? '*' : ''}
          </label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="M-Pesa code or bank reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          {errors.reference && (
            <p className="text-red-600 text-sm">{errors.reference}</p>
          )}
        </div>

        {/* Payment date. type="date" shows a calendar picker */}
        <div>
          <label className="block text-sm mb-1">Payment Date *</label>
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
          {errors.paymentDate && (
            <p className="text-red-600 text-sm">{errors.paymentDate}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        {/* type="submit" makes this button trigger handleSubmit */}
        <button type="submit" className="bg-amber-600 text-white px-4 py-1 rounded">
          Save Payment
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

export default PaymentForm
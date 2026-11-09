import { useState } from 'react'
import type { FormEvent } from 'react'
import type { PaymentInput, PaymentMethod } from '../types/payment'
import { PAYMENT_METHODS } from '../types/payment'
import type { ApiOrder } from '../types/order'
import { orderLabel } from '../utils/order'
import { showMoney } from '../utils/money'

// Props are the things the parent page (Payments.tsx) gives to this form.
// initialOrderId:     order to pre-select ('' means none chosen yet).
// orders:             orders that can still receive money (for the dropdown).
// getPayable:         how much can still be recorded for an order
//                     (total minus completed minus pending payments).
// existingReferences: references already used, in capital letters.
// saving:             true while the backend is busy.
type Props = {
  initialOrderId: string
  orders: ApiOrder[]
  getPayable: (orderId: string) => number
  existingReferences: string[]
  saving: boolean
  onSave: (data: PaymentInput) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  order?: string
  amount?: string
  reference?: string
}

function PaymentForm({
  initialOrderId,
  orders,
  getPayable,
  existingReferences,
  saving,
  onSave,
  onCancel,
}: Props) {
  // One state for each input. The amount is kept as text while typing.
  const [orderId, setOrderId] = useState(initialOrderId)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('Cash')
  const [reference, setReference] = useState('')

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    if (orderId === '') {
      newErrors.order = 'Please choose an order'
    }

    // The amount must be a real number. The backend needs at least 0.01.
    // Number.isFinite rejects NaN and Infinity (like typing 1e999).
    const amountNumber = Number(amount)
    if (amount.trim() === '' || !Number.isFinite(amountNumber) || amountNumber < 0.01) {
      newErrors.amount = 'Amount must be a number of at least 0.01'
    } else if (orderId !== '' && amountNumber > getPayable(orderId)) {
      // The customer cannot pay more than what is still open
      newErrors.amount = `Amount cannot be more than the balance still open (${showMoney(
        getPayable(orderId)
      )})`
    }

    // Mobile money needs its code. Any reference must be new, because every
    // real transaction has its own code. toUpperCase makes small and capital
    // letters count as the same code.
    const code = reference.trim().toUpperCase()
    if (method === 'Mobile Money' && code === '') {
      newErrors.reference = 'Please enter the M-Pesa / mobile money code'
    } else if (code !== '' && existingReferences.includes(code)) {
      newErrors.reference = 'This reference is already recorded'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

    onSave({
      order: orderId,
      amount: Number(amount),
      paymentMethod: method,
      // An empty reference is left out completely
      transactionReference: reference.trim() || undefined,
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
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                {orderLabel(o)}
              </option>
            ))}
          </select>
          {/* Show how much can still be recorded once an order is chosen */}
          {orderId !== '' && (
            <p className="text-sm text-gray-600">
              Open balance: KES {showMoney(getPayable(orderId))}
            </p>
          )}
          {errors.order && <p className="text-red-600 text-sm">{errors.order}</p>}
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

        {/* Reference (required for mobile money) */}
        <div>
          <label className="block text-sm mb-1">
            Reference {method === 'Mobile Money' ? '*' : ''}
          </label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="M-Pesa code or bank reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          {errors.reference && <p className="text-red-600 text-sm">{errors.reference}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-1 rounded disabled:bg-gray-300"
        >
          {saving ? 'Saving...' : 'Save Payment'}
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
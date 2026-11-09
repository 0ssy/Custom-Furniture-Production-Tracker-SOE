import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ApiProduction, ProductionFormData, ProductionStatus } from '../types/production'
import { PRODUCTION_STATUSES } from '../types/production'
import type { ApiOrder } from '../types/order'
import { orderLabel } from '../utils/order'

// Props are the things the parent page (Production.tsx) gives to this form.
// job:       if it has a job we are EDITING, if null we are ASSIGNING a new one.
// orders:    orders that can still be assigned (for the dropdown).
// orderText: readable text of the order of the job being edited.
// saving:    true while the backend is busy.
type Props = {
  job: ApiProduction | null
  orders: ApiOrder[]
  orderText: string
  saving: boolean
  onSave: (data: ProductionFormData) => void
  onCancel: () => void
}

function ProductionForm({ job, orders, orderText, saving, onSave, onCancel }: Props) {
  const [order, setOrder] = useState('')
  const [productionStatus, setProductionStatus] = useState<ProductionStatus>(
    job?.productionStatus ?? 'Not Started'
  )
  const [notes, setNotes] = useState(job?.notes ?? '')

  // Only the order can be wrong, and only when assigning a new job
  const [orderError, setOrderError] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page

    if (!job && order === '') {
      setOrderError('Please choose an order')
      return
    }
    setOrderError('')

    onSave({ order, productionStatus, notes: notes.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">
        {job ? 'Update Production Job' : 'Assign Order to Production'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Order: a dropdown when assigning, plain text when editing */}
        <div>
          <label className="block text-sm mb-1">Order *</label>
          {job ? (
            <p className="border rounded px-2 py-1 bg-gray-100">{orderText}</p>
          ) : (
            <select
              className="w-full border rounded px-2 py-1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="">-- Choose order --</option>
              {orders.map((o) => (
                <option key={o._id} value={o._id}>
                  {orderLabel(o)}
                </option>
              ))}
            </select>
          )}
          {orderError && <p className="text-red-600 text-sm">{orderError}</p>}
        </div>

        {/* Status: only when editing. New jobs always start as Not Started. */}
        {job && (
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={productionStatus}
              onChange={(e) => setProductionStatus(e.target.value as ProductionStatus)}
            >
              {PRODUCTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="col-span-2">
          <label className="block text-sm mb-1">Notes</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Progress notes, who is making it..."
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

export default ProductionForm
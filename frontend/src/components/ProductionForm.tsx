import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ProductionJob, ProductionStage } from '../types/production'
import { PRODUCTION_STAGES } from '../types/production'
import type { Order } from '../types/order'

// Props are the things the parent page (Production.tsx) gives to this form.
// job:             if it has a job we are EDITING, if null we are ASSIGNING a new one.
// availableOrders: orders that can still be assigned (used for the dropdown).
// getOrderLabel:   function that turns an order id into text like "Mary - Wardrobe".
// minDate:         the start date. The expected end date cannot be before it.
// onSave:          runs when the form is valid. It gets the data without _id and startDate.
// onCancel:        runs when Cancel is clicked.
type Props = {
  job: ProductionJob | null
  availableOrders: Order[]
  getOrderLabel: (orderId: string) => string
  minDate: string
  onSave: (data: Omit<ProductionJob, '_id' | 'startDate'>) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  orderId?: string
  assignedTo?: string
  expectedEndDate?: string
}

function ProductionForm({
  job,
  availableOrders,
  getOrderLabel,
  minDate,
  onSave,
  onCancel,
}: Props) {
  // One state for each input. When editing we start with the job's
  // current values, when assigning we start empty (or with a default).
  const [orderId, setOrderId] = useState(job?.orderId ?? '')
  const [stage, setStage] = useState<ProductionStage>(job?.stage ?? 'Not Started')
  const [assignedTo, setAssignedTo] = useState(job?.assignedTo ?? '')
  const [expectedEndDate, setExpectedEndDate] = useState(job?.expectedEndDate ?? '')
  const [notes, setNotes] = useState(job?.notes ?? '')

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    // When assigning a new job, an order must be chosen.
    // (When editing, the order cannot be changed, so no check is needed.)
    if (!job && orderId === '') {
      newErrors.orderId = 'Please choose an order'
    }

    // Someone must be assigned. trim() removes spaces so "   " counts as empty.
    if (assignedTo.trim() === '') {
      newErrors.assignedTo = 'Please enter who is making it'
    }

    // The expected end date is required, and it cannot be before the start date.
    // Dates written like 2026-11-12 can be compared as plain text,
    // because the year comes first, then the month, then the day.
    if (expectedEndDate === '') {
      newErrors.expectedEndDate = 'Expected end date is required'
    } else if (expectedEndDate < minDate) {
      newErrors.expectedEndDate = `End date cannot be before the start date (${minDate})`
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
      stage,
      assignedTo: assignedTo.trim(),
      expectedEndDate,
      notes: notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      {/* Title changes depending on whether we are editing or assigning */}
      <h3 className="text-lg font-bold mb-3">
        {job ? 'Update Production Job' : 'Assign Order to Production'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Order: a dropdown when assigning, plain text when editing */}
        <div>
          <label className="block text-sm mb-1">Order *</label>
          {job ? (
            // Editing: the order is fixed, so we only show its name
            <p className="border rounded px-2 py-1 bg-gray-100">
              {getOrderLabel(job.orderId)}
            </p>
          ) : (
            <select
              className="w-full border rounded px-2 py-1"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            >
              <option value="">-- Choose order --</option>
              {/* Only orders that are not in production yet are listed */}
              {availableOrders.map((o) => (
                <option key={o._id} value={o._id}>
                  {getOrderLabel(o._id)}
                </option>
              ))}
            </select>
          )}
          {errors.orderId && <p className="text-red-600 text-sm">{errors.orderId}</p>}
        </div>

        {/* Stage dropdown, filled from the list in types/production.ts */}
        <div>
          <label className="block text-sm mb-1">Stage</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={stage}
            onChange={(e) => setStage(e.target.value as ProductionStage)}
          >
            {PRODUCTION_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned to */}
        <div>
          <label className="block text-sm mb-1">Assigned To *</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Worker or team name"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
          {errors.assignedTo && (
            <p className="text-red-600 text-sm">{errors.assignedTo}</p>
          )}
        </div>

        {/* Expected end date. type="date" shows a calendar picker */}
        <div>
          <label className="block text-sm mb-1">Expected End Date *</label>
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={expectedEndDate}
            onChange={(e) => setExpectedEndDate(e.target.value)}
          />
          {errors.expectedEndDate && (
            <p className="text-red-600 text-sm">{errors.expectedEndDate}</p>
          )}
        </div>

        {/* Notes (optional) */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Notes</label>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Any progress notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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

export default ProductionForm
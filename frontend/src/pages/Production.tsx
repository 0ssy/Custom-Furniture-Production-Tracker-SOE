import { useState } from 'react'
import type { ProductionJob } from '../types/production'
import { PRODUCTION_STAGES, getProgress } from '../types/production'
import { mockProduction } from '../data/mockProduction'
import { mockOrders } from '../data/mockOrders'
import { mockCustomers } from '../data/mockCustomers'
import ProductionForm from '../components/ProductionForm'

function Production() {
  // The production jobs shown in the table. Starts with the fake data.
  const [jobs, setJobs] = useState<ProductionJob[]>(mockProduction)

  // NOTE: orders and customers are the original mock lists, so ones added
  // on the other pages will not show here until we use the real backend.
  const orders = mockOrders
  const customers = mockCustomers

  // Text typed in the search box
  const [search, setSearch] = useState('')

  // The stage chosen in the filter. '' means show all stages.
  const [stageFilter, setStageFilter] = useState('')

  // true = form visible, false = form hidden
  const [showForm, setShowForm] = useState(false)

  // Which job are we editing? null means we are assigning a new one.
  const [editing, setEditing] = useState<ProductionJob | null>(null)

  // Today's date as YYYY-MM-DD in the computer's own timezone
  const today = new Date().toLocaleDateString('en-CA')

  // A job only stores the orderId, so this builds readable text for it,
  // like "Mary Wanjiku - Wardrobe (x1)". It finds the order, then the customer.
  function getOrderLabel(orderId: string) {
    const order = orders.find((o) => o._id === orderId)
    if (!order) return 'Unknown order'
    const customer = customers.find((c) => c._id === order.customerId)
    const name = customer ? customer.name : 'Unknown customer'
    return `${name} - ${order.furnitureType} (x${order.quantity})`
  }

  // Orders that can still be assigned to production:
  // not already in a job, and not Cancelled or Delivered.
  const availableOrders = orders.filter(
    (o) =>
      !jobs.some((j) => j.orderId === o._id) &&
      o.status !== 'Cancelled' &&
      o.status !== 'Delivered'
  )

  // Keep only the jobs that match BOTH the search text and the stage filter.
  // The search checks the order text OR the person it is assigned to.
  const filtered = jobs.filter((j) => {
    const text = search.toLowerCase()
    const matchesSearch =
      getOrderLabel(j.orderId).toLowerCase().includes(text) ||
      j.assignedTo.toLowerCase().includes(text)
    // If no stage is chosen, every job passes this check
    const matchesStage = stageFilter === '' || j.stage === stageFilter
    return matchesSearch && matchesStage
  })

  // A job is overdue when its end date has passed and it is not completed
  function isOverdue(job: ProductionJob) {
    return job.stage !== 'Completed' && job.expectedEndDate < today
  }

  // Runs when "+ Assign Order" is clicked: open an empty form
  function handleAddClick() {
    setEditing(null)
    setShowForm(true)
  }

  // Runs when "Edit" is clicked: open the form with that job's details
  function handleEditClick(job: ProductionJob) {
    setEditing(job)
    setShowForm(true)
  }

  // Runs when "Next Stage" is clicked: move the job one stage forward
  function handleNextStage(job: ProductionJob) {
    const position = PRODUCTION_STAGES.indexOf(job.stage)
    // If it is already the last stage (Completed), do nothing
    if (position === PRODUCTION_STAGES.length - 1) return
    const nextStage = PRODUCTION_STAGES[position + 1]
    // Replace only this job with a copy that has the new stage
    setJobs(jobs.map((j) => (j._id === job._id ? { ...j, stage: nextStage } : j)))
  }

  // Called by the form when the data is valid and Save was clicked
  function handleSave(data: Omit<ProductionJob, '_id' | 'startDate'>) {
    if (editing) {
      // EDIT: replace only the job we edited, keep the others
      setJobs(jobs.map((j) => (j._id === editing._id ? { ...j, ...data } : j)))
    } else {
      // ASSIGN: make a new job. randomUUID gives a unique fake id and
      // the start date is today. The real backend will make the _id later.
      const newJob: ProductionJob = {
        _id: crypto.randomUUID(),
        ...data,
        startDate: today,
      }
      setJobs([...jobs, newJob])
    }

    // Close the form after saving
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      {/* Page title and the Assign button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Production Tracking</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Assign Order
        </button>
      </div>

      {/* The key resets the form when we switch between jobs.
          minDate is the job's start date, or today for a new job. */}
      {showForm && (
        <ProductionForm
          key={editing?._id ?? 'new'}
          job={editing}
          availableOrders={availableOrders}
          getOrderLabel={getOrderLabel}
          minDate={editing?.startDate ?? today}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
        />
      )}

      {/* Search box and stage filter side by side */}
      <div className="flex gap-3 mb-4">
        <input
          className="border rounded px-3 py-2 w-full max-w-sm bg-white"
          placeholder="Search by order or assigned person..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 bg-white"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="">All stages</option>
          {PRODUCTION_STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Production table */}
      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Order</th>
            <th className="p-2">Assigned To</th>
            <th className="p-2">Stage</th>
            <th className="p-2">Progress</th>
            <th className="p-2">Start</th>
            <th className="p-2">Expected End</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((j) => (
            <tr key={j._id} className="border-t">
              <td className="p-2">{getOrderLabel(j.orderId)}</td>
              <td className="p-2">{j.assignedTo}</td>
              <td className="p-2">{j.stage}</td>
              {/* Progress bar: a grey bar with an amber bar inside it.
                  The inside bar's width is the progress percentage. */}
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 rounded h-2 w-24">
                    <div
                      className="bg-amber-600 h-2 rounded"
                      style={{ width: `${getProgress(j.stage)}%` }}
                    />
                  </div>
                  <span className="text-sm">{getProgress(j.stage)}%</span>
                </div>
              </td>
              <td className="p-2">{j.startDate}</td>
              <td className="p-2">
                {j.expectedEndDate}
                {/* Red label if the job is late */}
                {isOverdue(j) && (
                  <span className="text-red-600 font-bold ml-2">Overdue</span>
                )}
              </td>
              <td className="p-2">{j.notes || '-'}</td>
              <td className="p-2 whitespace-nowrap">
                {/* Next Stage is disabled when the job is already Completed */}
                <button
                  onClick={() => handleNextStage(j)}
                  disabled={j.stage === 'Completed'}
                  className="bg-amber-600 text-white px-2 py-1 rounded mr-2 disabled:bg-gray-300"
                >
                  Next Stage
                </button>
                <button
                  onClick={() => handleEditClick(j)}
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
        <p className="text-gray-500 mt-3">No production jobs found.</p>
      )}
    </div>
  )
}

export default Production
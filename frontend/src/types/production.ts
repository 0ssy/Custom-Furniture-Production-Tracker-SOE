import type { OrderStatus } from './order'

// The production statuses. Same four words as Jose's Production.ts model.
export const PRODUCTION_STATUSES = ['Not Started', 'In Progress', 'Completed', 'On Hold'] as const
export type ProductionStatus = (typeof PRODUCTION_STATUSES)[number]

// A production job as the backend sends it.
// "order" can be an id text, the whole order, or null if the order was deleted.
export type ApiProduction = {
  _id: string
  order: string | { _id: string } | null
  productionStatus: ProductionStatus
  startDate?: string
  completionDate?: string
  notes?: string
}

// Everything the form gives back to the page when Save is clicked
export type ProductionFormData = {
  order: string
  productionStatus: ProductionStatus
  notes: string
}

// The next status in the normal flow, or null if there is none.
// Not Started to In Progress to Completed. A job On Hold resumes as In Progress.
export function getNextStatus(status: ProductionStatus): ProductionStatus | null {
  if (status === 'Not Started') return 'In Progress'
  if (status === 'In Progress') return 'Completed'
  if (status === 'On Hold') return 'In Progress'
  return null
}

// The order status that matches a production status (null = no change).
// Used to keep the order in step with its production job.
export function orderStatusFor(status: ProductionStatus): OrderStatus | null {
  if (status === 'In Progress') return 'In Production'
  if (status === 'Completed') return 'Completed'
  return null
}
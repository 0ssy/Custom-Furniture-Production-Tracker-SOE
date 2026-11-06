// The delivery statuses, written once here.
// These are the same four words used in Jose's Delivery.ts model.
// "as const" means the words will not change.
export const DELIVERY_STATUSES = ['Pending', 'In Transit', 'Delivered', 'Failed'] as const

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number]

// One delivery of an order.
// Field names are the same as in Jose's backend model.
export type Delivery = {
  _id: string                 // unique id (MongoDB creates this)
  order: string               // the _id of the order being delivered
  deliveryAddress: string     // where to deliver
  deliveryDate: string        // planned day, like 2026-11-10
  deliveryStatus: DeliveryStatus
  notes: string               // optional notes
}

// Gives the next status in the normal flow, or null if there is none.
// Pending -> In Transit -> Delivered. Failed and Delivered have no next step.
export function getNextStatus(status: DeliveryStatus): DeliveryStatus | null {
  if (status === 'Pending') return 'In Transit'
  if (status === 'In Transit') return 'Delivered'
  return null
}
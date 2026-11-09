// The delivery statuses. Same four words as Jose's Delivery.ts model.
export const DELIVERY_STATUSES = ['Pending', 'In Transit', 'Delivered', 'Failed'] as const
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number]

// A delivery as the backend sends it.
// "order" can be an id text, the whole order, or null if the order was deleted.
export type ApiDelivery = {
  _id: string
  order: string | { _id: string } | null
  deliveryAddress: string
  deliveryDate: string       // like 2026-11-10T00:00:00.000Z
  deliveryStatus: DeliveryStatus
  notes?: string
}

// Everything the form gives back to the page when Save is clicked
export type DeliveryFormData = {
  order: string
  deliveryAddress: string
  deliveryDate: string
  deliveryStatus: DeliveryStatus
  notes: string
}

// The next status in the normal flow, or null if there is none.
// Pending to In Transit to Delivered. Failed and Delivered have no next step.
export function getNextStatus(status: DeliveryStatus): DeliveryStatus | null {
  if (status === 'Pending') return 'In Transit'
  if (status === 'In Transit') return 'Delivered'
  return null
}
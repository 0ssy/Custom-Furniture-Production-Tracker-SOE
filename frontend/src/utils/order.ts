import type { ApiOrder } from '../types/order'

// Turns the items of an order into text like "Queen Bed x2, Office Chair x1"
export function itemsText(order: ApiOrder) {
  return order.items
    .map((i) => `${i.furniture?.name ?? 'Deleted item'} x${i.quantity}`)
    .join(', ')
}

// Readable text for an order, like "Mary Wanjiku - Queen Bed x1"
export function orderLabel(order: ApiOrder) {
  return `${order.customer?.fullName ?? 'Unknown customer'} - ${itemsText(order)}`
}

// The backend sometimes sends a link to another record as just its id text,
// and sometimes as the whole record. This takes the id out of either one.
export function refId(value: string | { _id: string } | null | undefined) {
  if (!value) return ''
  return typeof value === 'string' ? value : value._id
}
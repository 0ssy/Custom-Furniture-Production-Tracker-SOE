import type { ApiCustomer } from './customer'
import type { ApiFurniture } from './furniture'

// All the statuses an order can have. These are the same six words
// as in Jose's Order.ts model. "as const" means they will not change.
export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'In Production',
  'Completed',
  'Delivered',
  'Cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

// OLD shape, still used by the pages that run on mock data
// (Payments, Production, Deliveries). Removed when they are connected.
export type Order = {
  _id: string
  customerId: string
  furnitureType: string
  quantity: number
  totalAmount: number
  specifications: string
  status: OrderStatus
  createdAt: string
}

// REAL shape: one line of an order, as the backend sends it back.
// The backend fills in the whole furniture object, but it can be null
// if that furniture was deleted later.
export type ApiOrderItem = {
  furniture: ApiFurniture | null
  quantity: number
  unitPrice: number
}

// REAL shape: an order, the same names as Jose's Order.ts model.
// customer is the full customer object (or null if the customer was deleted).
export type ApiOrder = {
  _id: string
  customer: ApiCustomer | null
  items: ApiOrderItem[]
  totalAmount: number            // worked out by the backend
  orderStatus: OrderStatus
  orderDate: string              // like 2026-11-07T09:30:00.000Z
  expectedDeliveryDate: string
}

// One line of an order as we SEND it to the backend (only the furniture id)
export type OrderItemInput = {
  furniture: string
  quantity: number
  unitPrice: number
}

// Everything the form gives back to the page when Save is clicked
export type OrderFormData = {
  customer: string
  items: OrderItemInput[]
  expectedDeliveryDate: string
  orderStatus: OrderStatus
}
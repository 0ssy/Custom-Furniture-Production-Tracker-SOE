// All the statuses an order can have, written once here.
// The form (dropdown) and the page (filter) both use this list,
// so if Jose changes a status name we only edit it in this file.
// "as const" tells TypeScript these exact words will never change.
export const ORDER_STATUSES = [
  'Pending',
  'In Production',
  'Completed',
  'Delivered',
  'Cancelled',
] as const

// OrderStatus can only be one of the words above, nothing else.
export type OrderStatus = (typeof ORDER_STATUSES)[number]

// This describes what an order looks like.
// Field names must match what Jose uses in the backend.
export type Order = {
  _id: string            // unique id (MongoDB creates this automatically)
  customerId: string     // the _id of the customer who made the order
  furnitureType: string  // e.g. Wardrobe, Bed, Sofa
  quantity: number       // how many pieces
  totalAmount: number    // total price in KES
  specifications: string // extra details like size, colour, material
  status: OrderStatus    // where the order is now
  createdAt: string      // date the order was made, like 2026-11-03
}
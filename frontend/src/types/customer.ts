// OLD shape, used by the pages that still run on mock data
// (Orders, Production, Payments, Deliveries).
// It will be removed when those pages are connected to the backend.
export type Customer = {
  _id: string
  name: string
  phone: string
  email: string
  address: string
  createdAt: string
}

// REAL shape, the same names as Jose's Customer.ts model.
// Email and address are required in the backend.
export type ApiCustomer = {
  _id: string        // MongoDB creates this
  fullName: string   // at least 2 characters
  email: string      // required and unique
  phone: string      // at least 7 characters in the backend (we ask for 10 digits)
  address: string    // required, at least 3 characters
  createdAt: string  // like 2026-11-05T09:30:00.000Z
}
// This describes what a customer looks like.
// Every customer in the system must have these fields.
// The field names must match what Jose's backend uses.
export type Customer = {
  _id: string // MongoDB makes this automatically
  name: string
  phone: string
  email: string
  address: string
  createdAt: string // date the customer was registered
}
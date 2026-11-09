// The ways a customer can pay. Same four words as Jose's Payment.ts model.
export const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Card', 'Mobile Money'] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

// The status of ONE payment record (set in the backend)
export const PAYMENT_RECORD_STATUSES = ['Pending', 'Completed', 'Failed', 'Refunded'] as const
export type PaymentRecordStatus = (typeof PAYMENT_RECORD_STATUSES)[number]

// The payment status of a whole ORDER. This is worked out, never stored.
export const BALANCE_STATUSES = ['Unpaid', 'Partial', 'Paid'] as const
export type BalanceStatus = (typeof BALANCE_STATUSES)[number]

// A payment as the backend sends it.
// "order" can be an id text, the whole order, or null if the order was deleted.
export type ApiPayment = {
  _id: string
  order: string | { _id: string } | null
  amount: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentRecordStatus
  paymentDate: string            // like 2026-11-07T09:30:00.000Z
  transactionReference?: string
}

// What we send when recording a payment. The backend sets the status
// to Pending and the date to now by itself.
export type PaymentInput = {
  order: string
  amount: number
  paymentMethod: PaymentMethod
  transactionReference?: string
}

// Works out the payment status of an order from the total and the amount paid
export function getBalanceStatus(totalAmount: number, paid: number): BalanceStatus {
  if (paid <= 0) return 'Unpaid'
  if (paid >= totalAmount) return 'Paid'
  return 'Partial'
}
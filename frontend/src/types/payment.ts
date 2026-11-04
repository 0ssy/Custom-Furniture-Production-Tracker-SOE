// The ways a customer can pay, written once here.
// The form dropdown uses this list. "as const" means the words will not change.
export const PAYMENT_METHODS = ['Cash', 'M-Pesa', 'Bank Transfer'] as const

// PaymentMethod can only be one of the words above, nothing else.
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

// The payment statuses of an order. These are worked out, not typed in.
export const PAYMENT_STATUSES = ['Unpaid', 'Partial', 'Paid'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

// One payment made by a customer for an order.
// Field names must match what Jose uses in the backend.
export type Payment = {
  _id: string            // unique id (MongoDB creates this automatically)
  orderId: string        // the _id of the order being paid for
  amount: number         // how much was paid, in KES
  method: PaymentMethod  // Cash, M-Pesa or Bank Transfer
  reference: string      // M-Pesa code or bank reference (optional except M-Pesa)
  paymentDate: string    // day the money was received, like 2026-11-03
}

// Works out the payment status of an order.
// totalAmount is the order price, paid is the sum of all its payments.
export function getPaymentStatus(totalAmount: number, paid: number): PaymentStatus {
  if (paid <= 0) return 'Unpaid'       // nothing paid yet
  if (paid >= totalAmount) return 'Paid' // fully paid
  return 'Partial'                     // some paid, some still owed
}
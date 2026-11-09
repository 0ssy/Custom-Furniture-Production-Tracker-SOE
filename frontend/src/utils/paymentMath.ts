import type { ApiPayment } from '../types/payment'
import { refId } from './order'

// Adds up the payments of one order that have the given status.
// Only 'Completed' money counts as really received. 'Pending' is money
// that was recorded but not confirmed yet.
export function sumPayments(
  payments: ApiPayment[],
  orderId: string,
  status: 'Completed' | 'Pending'
) {
  return payments
    .filter((p) => refId(p.order) === orderId && p.paymentStatus === status)
    .reduce((sum, p) => sum + p.amount, 0)
}
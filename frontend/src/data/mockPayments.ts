import type { Payment } from '../types/payment'

// Fake payments for testing without the backend.
// orderId matches the _id of the orders in mockOrders.ts:
// '101' Wardrobe (45,000) has NO payments, so it is Unpaid.
// '102' Sofa (90,000) has 30,000 + 15,000 = 45,000 paid, so it is Partial.
// '103' Dining Table (38,000) has 38,000 paid, so it is Paid.
// When Jose finishes the API we delete this file and fetch real data.
export const mockPayments: Payment[] = [
  {
    _id: 'pay1',
    orderId: '102',
    amount: 30000,
    method: 'M-Pesa',
    reference: 'SKL4F7G2QW',
    paymentDate: '2026-11-01',
  },
  {
    _id: 'pay2',
    orderId: '102',
    amount: 15000,
    method: 'Cash',
    reference: '', // cash has no reference
    paymentDate: '2026-11-02',
  },
  {
    _id: 'pay3',
    orderId: '103',
    amount: 38000,
    method: 'Bank Transfer',
    reference: 'BNK-00123',
    paymentDate: '2026-11-02',
  },
]
import type { Delivery } from '../types/delivery'

// Fake deliveries for testing without the backend.
// "order" matches the _id of the orders in mockOrders.ts
// ('103' is the Dining Table, '102' is the Sofa).
// The Wardrobe order ('101') has no delivery yet, so it can be scheduled.
// The first one has a date that has already passed, so it shows "Overdue".
export const mockDeliveries: Delivery[] = [
  {
    _id: 'd1',
    order: '103',
    deliveryAddress: 'Nakuru Town',
    deliveryDate: '2026-11-04',
    deliveryStatus: 'In Transit',
    notes: 'Call the customer before arriving',
  },
  {
    _id: 'd2',
    order: '102',
    deliveryAddress: 'Kisumu, Milimani',
    deliveryDate: '2026-11-20',
    deliveryStatus: 'Pending',
    notes: '', // no notes, to test the "-" display
  },
]
import type { Order } from '../types/order'

// Fake orders for testing without the backend.
// customerId matches the _id of the customers in mockCustomers.ts
// ('1' is Mary, '2' is John, '3' is Faith).
// When Jose finishes the API we delete this file and fetch real data.
export const mockOrders: Order[] = [
  {
    _id: '101',
    customerId: '1',
    furnitureType: 'Wardrobe',
    quantity: 1,
    totalAmount: 45000,
    specifications: '3 doors, mahogany, brown finish',
    status: 'Pending',
    createdAt: '2026-11-01',
  },
  {
    _id: '102',
    customerId: '2',
    furnitureType: 'Sofa',
    quantity: 2,
    totalAmount: 90000,
    specifications: '3-seater, grey fabric',
    status: 'In Production',
    createdAt: '2026-11-01',
  },
  {
    _id: '103',
    customerId: '3',
    furnitureType: 'Dining Table',
    quantity: 1,
    totalAmount: 38000,
    specifications: '6 seater, oak, with glass top',
    status: 'Completed',
    createdAt: '2026-11-02',
  },
]
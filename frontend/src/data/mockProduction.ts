import type { ProductionJob } from '../types/production'

// Fake production jobs for testing without the backend.
// orderId matches the _id of the orders in mockOrders.ts
// ('102' is the Sofa, '103' is the Dining Table).
// The Wardrobe order ('101') has no job yet, so it can be assigned.
// When Jose finishes the API we delete this file and fetch real data.
export const mockProduction: ProductionJob[] = [
  {
    _id: 'p1',
    orderId: '102',
    stage: 'Assembly',
    assignedTo: 'Peter Kamau',
    startDate: '2026-11-02',
    expectedEndDate: '2026-11-12',
    notes: 'Frame is ready, starting assembly',
  },
  {
    _id: 'p2',
    orderId: '103',
    stage: 'Completed',
    assignedTo: 'Samuel Mwangi',
    startDate: '2026-11-01',
    expectedEndDate: '2026-11-05',
    notes: '', // no notes, to test the "-" display
  },
]
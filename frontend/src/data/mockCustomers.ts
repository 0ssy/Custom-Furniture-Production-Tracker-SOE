import type { Customer } from '../types/customer'

// Fake customers so we can build and test without the backend.
// When Jose finishes, we delete this file and fetch from the API instead.
export const mockCustomers: Customer[] = [
  {
    _id: '1',
    name: 'Mary Wanjiku',
    phone: '0712345678',
    email: 'mary@example.com',
    address: 'Nairobi, Kilimani',
    createdAt: '2026-11-01',
  },
  {
    _id: '2',
    name: 'John Otieno',
    phone: '0723456789',
    email: 'john@example.com',
    address: 'Kisumu, Milimani',
    createdAt: '2026-11-01',
  },
  {
    _id: '3',
    name: 'Faith Achieng',
    phone: '0734567890',
    email: '',
    address: 'Nakuru Town',
    createdAt: '2026-11-02',
  },
]
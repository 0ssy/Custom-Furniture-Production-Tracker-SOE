import { apiFetch } from './api'
import type { OrderStatus } from '../types/order'

// Changes only the status of an order.
// Used when a delivery or production job changes, so the order stays in step.
export async function setOrderStatus(orderId: string, status: OrderStatus) {
  await apiFetch(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ orderStatus: status }),
  })
}
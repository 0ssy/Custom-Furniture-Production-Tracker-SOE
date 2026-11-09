import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from './api'
import { extractList } from './list'
import type { ApiOrder } from '../types/order'
import type { ApiCustomer } from '../types/customer'
import type { ApiPayment } from '../types/payment'
import type { ApiProduction } from '../types/production'
import type { ApiDelivery } from '../types/delivery'
import type { ApiMaterial } from '../types/material'

// Everything the Dashboard and Reports pages need, in one place
type SystemData = {
  orders: ApiOrder[]
  customers: ApiCustomer[]
  payments: ApiPayment[]
  production: ApiProduction[]
  deliveries: ApiDelivery[]
  materials: ApiMaterial[]
}

const emptyData: SystemData = {
  orders: [],
  customers: [],
  payments: [],
  production: [],
  deliveries: [],
  materials: [],
}

// A hook that loads all six lists from the backend at the same time.
// Promise.all waits until every answer is back.
export function useSystemData() {
  const [data, setData] = useState<SystemData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [o, c, p, pr, d, m] = await Promise.all([
        apiFetch<unknown>('/orders'),
        apiFetch<unknown>('/customers'),
        apiFetch<unknown>('/payments'),
        apiFetch<unknown>('/production'),
        apiFetch<unknown>('/deliveries'),
        apiFetch<unknown>('/materials'),
      ])
      setData({
        orders: extractList<ApiOrder>(o, 'orders'),
        customers: extractList<ApiCustomer>(c, 'customers'),
        payments: extractList<ApiPayment>(p, 'payments'),
        production: extractList<ApiProduction>(pr, 'production'),
        deliveries: extractList<ApiDelivery>(d, 'deliveries'),
        materials: extractList<ApiMaterial>(m, 'materials'),
      })
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load once, when the page opens
  useEffect(() => {
    load()
  }, [load])

  return { ...data, loading, error }
}
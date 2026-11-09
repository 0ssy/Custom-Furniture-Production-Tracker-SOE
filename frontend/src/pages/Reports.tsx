import type { ReactNode } from 'react'
import { useSystemData } from '../services/useSystemData'
import { ORDER_STATUSES } from '../types/order'
import { PAYMENT_METHODS } from '../types/payment'
import { PRODUCTION_STATUSES } from '../types/production'
import { DELIVERY_STATUSES } from '../types/delivery'
import { showMoney } from '../utils/money'
import { sumPayments } from '../utils/paymentMath'
import { getToday } from '../utils/date'

// A titled block used for each report, so the markup is written once
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {children}
    </section>
  )
}

function Reports() {
  const { orders, payments, production, deliveries, materials, loading, error } =
    useSystemData()

  if (loading) return <p className="text-gray-500">Loading reports...</p>
  if (error) {
    return <p className="bg-red-100 text-red-700 px-3 py-2 rounded">{error}</p>
  }

  // Money numbers leave out Cancelled orders
  const activeOrders = orders.filter((o) => o.orderStatus !== 'Cancelled')
  const billed = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const received = activeOrders.reduce(
    (sum, o) => sum + sumPayments(payments, o._id, 'Completed'),
    0
  )

  const lowStock = materials.filter((m) => m.quantityInStock <= m.reorderLevel)

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl font-bold">Reports</h2>
        {/* print:hidden hides this button on the printed page */}
        <button
          onClick={() => window.print()}
          className="bg-amber-600 text-white px-4 py-2 rounded print:hidden"
        >
          Print Report
        </button>
      </div>
      <p className="text-gray-500 mb-6">Report date: {getToday()}</p>

      {/* SALES REPORT: orders grouped by status */}
      <Section title="Sales Report">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Total Billed (KES)</p>
            <p className="text-2xl font-bold">{showMoney(billed)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Total Received (KES)</p>
            <p className="text-2xl font-bold">{showMoney(received)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Outstanding (KES)</p>
            <p className="text-2xl font-bold text-red-600">{showMoney(billed - received)}</p>
          </div>
        </div>
        <table className="w-full bg-white rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Order Status</th>
              <th className="p-2">Orders</th>
              <th className="p-2">Value (KES)</th>
            </tr>
          </thead>
          <tbody>
            {ORDER_STATUSES.map((s) => {
              const group = orders.filter((o) => o.orderStatus === s)
              return (
                <tr key={s} className="border-t">
                  <td className="p-2">{s}</td>
                  <td className="p-2">{group.length}</td>
                  <td className="p-2">
                    {showMoney(group.reduce((sum, o) => sum + o.totalAmount, 0))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Section>

      {/* PAYMENTS: money received by method (Completed payments only) */}
      <Section title="Payments Received by Method">
        <table className="w-full bg-white rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Method</th>
              <th className="p-2">Payments</th>
              <th className="p-2">Amount (KES)</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENT_METHODS.map((m) => {
              const group = payments.filter(
                (p) => p.paymentMethod === m && p.paymentStatus === 'Completed'
              )
              return (
                <tr key={m} className="border-t">
                  <td className="p-2">{m}</td>
                  <td className="p-2">{group.length}</td>
                  <td className="p-2">
                    {showMoney(group.reduce((sum, p) => sum + p.amount, 0))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Section>

      {/* PRODUCTION REPORT: jobs grouped by status */}
      <Section title="Production Report">
        <table className="w-full bg-white rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Production Status</th>
              <th className="p-2">Jobs</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTION_STATUSES.map((s) => (
              <tr key={s} className="border-t">
                <td className="p-2">{s}</td>
                <td className="p-2">
                  {production.filter((j) => j.productionStatus === s).length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* DELIVERY REPORT: deliveries grouped by status */}
      <Section title="Delivery Report">
        <table className="w-full bg-white rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Delivery Status</th>
              <th className="p-2">Deliveries</th>
            </tr>
          </thead>
          <tbody>
            {DELIVERY_STATUSES.map((s) => (
              <tr key={s} className="border-t">
                <td className="p-2">{s}</td>
                <td className="p-2">
                  {deliveries.filter((d) => d.deliveryStatus === s).length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* INVENTORY: materials that need to be reordered */}
      <Section title="Low Stock Materials">
        <table className="w-full bg-white rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Material</th>
              <th className="p-2">In Stock</th>
              <th className="p-2">Reorder Level</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((m) => (
              <tr key={m._id} className="border-t">
                <td className="p-2">{m.name}</td>
                <td className="p-2">
                  {m.quantityInStock} {m.unit}
                </td>
                <td className="p-2">{m.reorderLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {lowStock.length === 0 && (
          <p className="text-gray-500 mt-3">No materials are low on stock.</p>
        )}
      </Section>
    </div>
  )
}

export default Reports